import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';
import ts from 'typescript';
const db = new PGlite();
const q = (sql, params=[]) => db.query(sql,params);
const signup = (email, slots) => q("select volunteer_register('Alice','Test',$1,'U10',$2,$3) as ok", [email,slots,`ip:${email}`]);
before(async () => {
  await db.exec('create role anon; create role authenticated; create role service_role bypassrls;');
  await db.exec(await readFile(new URL('../supabase/migrations/202611130001_volunteers.sql',import.meta.url),'utf8'));
  await db.exec(await readFile(new URL('../supabase/migrations/202611130002_missions.sql',import.meta.url),'utf8'));
  await db.exec(await readFile(new URL('../supabase/migrations/202611130003_confirmed_capacities.sql',import.meta.url),'utf8'));
  await db.exec(await readFile(new URL('../supabase/migrations/202611130004_unlimited_availability.sql',import.meta.url),'utf8'));
  // Dates in fixtures stay relative so the tests remain useful after the events.
  await db.exec("update volunteer_events set event_date=(now() at time zone 'Europe/Paris')::date+1; update volunteer_slots set enabled=true;");
});
after(async () => { await db.close(); });
test('reservation, multiple missions, atomic refusal, duplicates and private data', async () => {
  let result=await q('select * from volunteer_counts()');
  assert.equal(result.rows.find(r=>r.id==='lespinasse-2026-encaissement').registered,1);
  assert.equal((await signup('a@example.test',['lespinasse-2026-encaissement','lespinasse-2026-installation'])).rows[0].ok,true);
  assert.equal((await signup('a@example.test',['lespinasse-2026-encaissement'])).rows[0].ok,false);
  assert.equal((await signup('b@example.test',['lespinasse-2026-encaissement'])).rows[0].ok,true);
  assert.equal((await signup('c@example.test',['lespinasse-2026-encaissement'])).rows[0].ok,true);
  assert.equal((await signup('d@example.test',['lespinasse-2026-encaissement','lespinasse-2026-installation'])).rows[0].ok,false);
  result=await q('select * from volunteer_counts()');
  assert.equal(result.rows.find(r=>r.id==='lespinasse-2026-encaissement').registered,4);
  assert.equal(result.rows.find(r=>r.id==='lespinasse-2026-installation').registered,1);
  assert.deepEqual(Object.keys(result.rows[0]).sort(),['capacity','event_id','id','registered','title']);
  assert.equal((await q('select count(*)::int n from volunteer_mail')).rows[0].n,6);
  assert.equal((await signup('d@example.test',['unknown'])).rows[0].ok,false);
  // All affected writes are queued alongside the registration, including rollback.
  await db.exec('begin');
  assert.equal((await signup('rollback@example.test',['lespinasse-2026-installation'])).rows[0].ok,true);
  await db.exec('rollback');
  assert.equal((await q("select count(*)::int n from volunteer_people where email='rollback@example.test'")).rows[0].n,0);
});
test('anonymous and authenticated roles cannot read PII or invoke server functions', async () => {
  for (const role of ['anon','authenticated']) {
    await db.exec(`set role ${role}`);
    for (const table of ['volunteer_people','volunteer_assignments','volunteer_slots','volunteer_rate','volunteer_events']) await assert.rejects(()=>q(`select * from ${table}`),/permission denied/);
    await assert.rejects(()=>q('select * from volunteer_mail'),/permission denied/);
    await assert.rejects(()=>q('select * from volunteer_counts()'),/permission denied/);
    await assert.rejects(()=>signup('x@example.test',['lespinasse-2026-installation']),/permission denied/);
    await db.exec('reset role');
  }
});
test('reminders once per person, leases, stale completions and ambiguous retries', async () => {
  await q('select volunteer_queue_reminders()'); await q('select volunteer_queue_reminders()');
  assert.equal((await q("select count(*)::int n from volunteer_mail where kind='reminder'")).rows[0].n,3);
  let result=await q('select * from volunteer_claim_mail()');
  assert.equal(result.rows.length,3);
  const job=result.rows[0];
  await q('select volunteer_finish_mail($1,gen_random_uuid(),true)',[job.id]);
  assert.equal((await q('select status from volunteer_mail where id=$1',[job.id])).rows[0].status,'sending');
  await q('select volunteer_finish_mail($1,$2,true)',[job.id,job.lease]);
  assert.equal((await q('select status from volunteer_mail where id=$1',[job.id])).rows[0].status,'sent');
  const next=await q('select * from volunteer_claim_mail()');
  assert.ok(next.rows.every(r=>!result.rows.some(old=>old.id===r.id)));
  const retry=result.rows[1];
  await q("update volunteer_mail set lease_until=now()-interval '1 minute' where id=$1",[retry.id]);
  const reclaimed=await q('select * from volunteer_claim_mail()');
  assert.ok(reclaimed.rows.some(r=>r.id===retry.id && r.lease!==retry.lease));
  await q("update volunteer_mail set status='pending',first_attempt=now()-interval '24 hours' where id=$1",[retry.id]);
  await q('select * from volunteer_claim_mail()');
  assert.equal((await q('select status from volunteer_mail where id=$1',[retry.id])).rows[0].status,'manual');
});
test('server validation rejects malformed fields and accepts all categories', async () => {
  const compile=s=>ts.transpileModule(s,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
  const events=compile(await readFile(new URL('../src/lib/volunteers/events.ts',import.meta.url),'utf8'));
  const eventsURL='data:text/javascript;base64,'+Buffer.from(events).toString('base64');
  const code=compile(await readFile(new URL('../src/lib/volunteers/validation.ts',import.meta.url),'utf8')).replace("'./events'",JSON.stringify(eventsURL));
  const {parseRegistration}=await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
  const valid={firstName:'Alice',lastName:'Test',email:'alice@example.test',category:'U10',slots:['lespinasse-2026-installation'],consent:true,website:''};
  for(const category of ['Baby','U6','U8','U10','U12','U14']) assert.equal(parseRegistration({...valid,category}).category,category);
  for(const override of [{category:'U16'},{consent:false},{email:'bad'},{firstName:'\n'},{slots:[]},{slots:['../bad']},{website:'spam'}]) assert.throws(()=>parseRegistration({...valid,...override}));
});
