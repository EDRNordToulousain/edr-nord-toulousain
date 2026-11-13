import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';

test('reproduce disabled unlimited pair, repair it without new reservations, then save all or nothing',async()=>{
 const db=new PGlite();
 try {
  await db.exec('create role anon; create role authenticated; create role service_role bypassrls;');
  for(const name of ['202611130001_volunteers.sql','202611130002_missions.sql','202611130003_confirmed_capacities.sql']) await db.exec(await readFile(new URL('../supabase/migrations/'+name,import.meta.url),'utf8'));
  await db.exec("update volunteer_events set event_date=(now() at time zone 'Europe/Paris')::date+1");
  const slots=['lespinasse-2026-installation','lespinasse-2026-rangement-tables'];
  const signup=async(email,selection=slots)=>(await db.query("select volunteer_register('Alice','Test',$1,'U10',$2,$3) ok",[email,selection,email])).rows[0].ok;
  // Prior tests enabled every slot; reproduce the actual seeded state instead.
  assert.equal(await signup('before@example.test'),false);
  const migration=await readFile(new URL('../supabase/migrations/202611130004_unlimited_availability.sql',import.meta.url),'utf8');
  await db.exec(migration);
  const availability=(await db.query('select c.*,s.enabled from volunteer_counts() c join volunteer_slots s using(id)')).rows;
  assert.equal(availability.filter(s=>s.enabled).length,12);
  assert.ok(availability.filter(s=>slots.includes(s.id)).every(s=>s.capacity===null&&s.enabled));
  assert.equal((await db.query('select sum(reserved)::int n from volunteer_slots')).rows[0].n,1);
  assert.equal(await signup('after@example.test'),true);
  assert.deepEqual((await db.query('select slot_id from volunteer_assignments order by slot_id')).rows.map(r=>r.slot_id),slots);
  assert.equal((await db.query('select count(*)::int n from volunteer_people')).rows[0].n,1);
  assert.equal((await db.query('select count(*)::int n from volunteer_mail')).rows[0].n,2);
  await db.exec(migration);
  assert.equal((await db.query('select count(*)::int n from volunteer_assignments')).rows[0].n,2);
  assert.equal((await db.query('select sum(reserved)::int n from volunteer_slots')).rows[0].n,1);
  // A failure during the actual assignment insert must roll back people,
  // all assignments and both pending emails, not just fail pre-validation.
  await db.exec(`create function test_fail_assignment() returns trigger language plpgsql as $$ begin if new.slot_id like '%-rangement-tables' then raise exception 'simulated storage failure'; end if; return new; end $$;
   create trigger test_failure before insert on volunteer_assignments for each row execute function test_fail_assignment();`);
  await assert.rejects(()=>signup('failed@example.test'),/simulated storage failure/);
  await db.exec('drop trigger test_failure on volunteer_assignments');
  assert.equal((await db.query('select count(*)::int n from volunteer_people')).rows[0].n,1);
  assert.equal((await db.query('select count(*)::int n from volunteer_assignments')).rows[0].n,2);
  assert.equal((await db.query('select count(*)::int n from volunteer_mail')).rows[0].n,2);
  // All four unlimited missions can be selected together after repair.
  assert.equal(await signup('all-four@example.test',['installation','rangement-tables','balayage','rangement-buvette'].map(id=>'lespinasse-2026-'+id)),true);
  assert.equal((await db.query('select count(*)::int n from volunteer_assignments')).rows[0].n,6);
 }finally {await db.close();}
});
