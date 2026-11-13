import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';
import ts from 'typescript';
test('three matching mission lists preserve finite and unlimited capacities and existing reservations',async()=>{
 const db=new PGlite();
 try {
  await db.exec('create role anon; create role authenticated; create role service_role bypassrls;');
  for(const name of ['202611130001_volunteers.sql','202611130002_missions.sql','202611130003_confirmed_capacities.sql','202611130004_unlimited_availability.sql']) await db.exec(await readFile(new URL('../supabase/migrations/'+name,import.meta.url),'utf8'));
  const code=ts.transpileModule(await readFile(new URL('../src/lib/volunteers/events.ts',import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
  const {previewSlots,volunteerEvents}=await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
  const rows=(await db.query('select * from volunteer_counts()')).rows;
  assert.equal(rows.length,27);
  assert.deepEqual(rows.sort((a,b)=>a.id.localeCompare(b.id)),previewSlots.sort((a,b)=>a.id.localeCompare(b.id)));
  const rls=(await db.query("select relname,relrowsecurity from pg_class where relname in ('volunteer_events','volunteer_slots','volunteer_people','volunteer_assignments','volunteer_rate','volunteer_mail')")).rows;
  assert.equal(rls.length,6);assert.ok(rls.every(t=>t.relrowsecurity));
  for (const event of volunteerEvents) {
   const slots=rows.filter(r=>r.event_id===event.id);
   assert.equal(slots.length,9);assert.equal(slots.filter(s=>s.capacity===null).length,4);
   assert.equal(slots.find(s=>s.id.endsWith('-controle-cartons')).capacity,2);
   assert.equal(slots.find(s=>s.id.endsWith('-annonce-numeros')).capacity,1);
   assert.equal(slots.find(s=>s.id.endsWith('-distribution-numeros')).capacity,1);
  }
  await db.exec("update volunteer_slots set enabled=true");
  assert.equal(rows.filter(s=>s.id.endsWith('-buvette')&&!s.id.endsWith('-rangement-buvette')).every(s=>s.capacity===3),true);
  assert.equal((await db.query('select sum(reserved)::int n from volunteer_slots')).rows[0].n,1);
  // Applying the capacity migration again never inserts a reservation or erases one.
  await db.exec("update volunteer_slots set reserved=2 where id='lespinasse-2026-encaissement'");
  await db.exec(await readFile(new URL('../supabase/migrations/202611130003_confirmed_capacities.sql',import.meta.url),'utf8'));
  assert.equal((await db.query("select reserved from volunteer_slots where id='lespinasse-2026-encaissement'")).rows[0].reserved,2);
  assert.equal((await db.query('select sum(reserved)::int n from volunteer_slots')).rows[0].n,2);
  await db.exec("update volunteer_events set event_date=(now() at time zone 'Europe/Paris')::date+1");
  for(const event of volunteerEvents) {
   const unlimited=['installation','rangement-tables','balayage','rangement-buvette'].map(id=>`${event.id}-${id}`);
   for(let i=0;i<16;i++) {
    const email=`unlimited-${event.id}-${i}@example.test`;
    const result=await db.query("select volunteer_register('Alice','Test',$1,'U10',$2,$3) ok",[email,unlimited,email]);
    assert.equal(result.rows[0].ok,true);
   }
   const counters=(await db.query('select * from volunteer_counts()')).rows;
   for(const id of unlimited) {assert.equal(counters.find(s=>s.id===id).registered,16);assert.equal(counters.find(s=>s.id===id).capacity,null);}
   for(let i=0;i<4;i++) {
    const email=`buvette-${event.id}-${i}@example.test`;
    const result=await db.query("select volunteer_register('Alice','Test',$1,'U10',$2,$3) ok",[email,[`${event.id}-buvette`],email]);
    assert.equal(result.rows[0].ok,i<3);
   }
  }
 }finally {await db.close();}
});
