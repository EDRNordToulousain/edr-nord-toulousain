import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';
import { PGlite } from '@electric-sql/pglite';

test('existing migration 005 opens only available finite missions and preserves every stored record',async()=>{
 const db=new PGlite();
 try {
  await db.exec('create role anon; create role authenticated; create role service_role bypassrls;');
  for(const name of ['202611130001_volunteers.sql','202611130002_missions.sql','202611130003_confirmed_capacities.sql','202611130004_unlimited_availability.sql']) {
   await db.exec(await readFile(new URL('../supabase/migrations/'+name,import.meta.url),'utf8'));
  }
  await db.exec("update volunteer_events set event_date=(now() at time zone 'Europe/Paris')::date+1");
  // Entirely local fixtures: a full closed buvette, a full already-enabled
  // annonce, and a control mission with one remaining place.
  for(const [eventId,slotId,n] of [
   ['bruguieres-2027','bruguieres-2027-buvette',3],
   ['saint-jory-2027','saint-jory-2027-annonce-numeros',1],
   ['lespinasse-2026','lespinasse-2026-controle-cartons',1],
  ]) for(let i=0;i<n;i++) {
   const person=(await db.query("insert into volunteer_people(event_id,email,first_name,last_name,category) values($1,$2,'Local','Fixture','U10') returning id",[eventId,`${slotId}-${i}@example.test`])).rows[0].id;
   await db.query('insert into volunteer_assignments values($1,$2)',[person,slotId]);
   await db.query("insert into volunteer_mail(person_id,kind,payload) values($1,'confirmation',$2)",[person,{event_id:eventId,missions:[slotId]}]);
  }
  await db.exec("update volunteer_slots set enabled=true where id='saint-jory-2027-annonce-numeros'");
  const tables=['volunteer_events','volunteer_people','volunteer_assignments','volunteer_mail','volunteer_rate'];
  const snapshot=async()=>Object.fromEntries(await Promise.all(tables.map(async table=>[table,(await db.query(`select * from ${table}`)).rows])));
  const before=await snapshot();
  const slotsBefore=(await db.query('select * from volunteer_slots order by id')).rows;
  const migration=await readFile(new URL('../supabase/migrations/202611130005_open_available_limited_missions.sql',import.meta.url),'utf8');
  await db.exec(migration);
  assert.deepEqual(await snapshot(),before);
  const slotsAfter=(await db.query('select * from volunteer_slots order by id')).rows;
  const withoutEnabled=slot=>Object.fromEntries(Object.entries(slot).filter(([key])=>key!=='enabled'));
  assert.deepEqual(slotsAfter.map(withoutEnabled),slotsBefore.map(withoutEnabled));
  const publicSlots=(await db.query('select c.*,s.enabled from volunteer_counts() c join volunteer_slots s using(id) order by id')).rows;
  for(const slot of publicSlots) {
   const previous=slotsBefore.find(s=>s.id===slot.id);
   assert.equal(slot.enabled,slot.capacity!==null && slot.registered<slot.capacity ? true : previous.enabled);
  }
  const lespinasse=publicSlots.find(s=>s.id==='lespinasse-2026-encaissement');
  assert.equal(lespinasse.capacity,4);assert.equal(lespinasse.registered,1);assert.equal(lespinasse.capacity-lespinasse.registered,3);assert.equal(lespinasse.enabled,true);
  assert.equal(slotsAfter.find(s=>s.id===lespinasse.id).reserved,1);
  assert.equal(slotsAfter.reduce((n,s)=>n+s.reserved,0),1);
  for(const slot of publicSlots) {
   const expected={'encaissement':4,'buvette':3,'controle-cartons':2,'annonce-numeros':1,'distribution-numeros':1};
   const suffix=slot.id.slice(slot.event_id.length+1);
   if(suffix in expected)assert.equal(slot.capacity,expected[suffix]);
  }
  const code=ts.transpileModule(await readFile(new URL('../src/lib/volunteers/availability.ts',import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
  const {missionIsFull,availabilityLabel}=await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
  for(const slot of publicSlots.filter(s=>s.capacity!==null)) {
   if(slot.registered<slot.capacity) {
    assert.equal(missionIsFull(slot),false);
    assert.ok(!availabilityLabel(slot,true).includes('Inscriptions fermées'));
   }else assert.equal(missionIsFull(slot),true); // even when enabled was already true
  }
  assert.ok(availabilityLabel(publicSlots.find(s=>s.id==='lespinasse-2026-controle-cartons'),true).includes('1 place restante'));
  const full=publicSlots.filter(s=>missionIsFull(s));
  assert.equal(full.length,2);
  // Complete missions are refused by SQL too, with no new person, assignment
  // or queued email. No provider or production service is contacted.
  for(const slot of full) {
   const result=await db.query("select volunteer_register('Local','Refused',$1,'U10',$2,$3) ok",[`${slot.id}@example.test`,[slot.id],'local-test']);
   assert.equal(result.rows[0].ok,false);
  }
  for(const table of ['volunteer_people','volunteer_assignments','volunteer_mail'])assert.deepEqual((await snapshot())[table],before[table]);
  // Validate the read-only production audit against both history cases locally.
  const audit=await readFile(new URL('../docs/benevoles-production-audit.sql',import.meta.url),'utf8');
  await db.exec(audit);
  await db.exec("create schema supabase_migrations; create table supabase_migrations.schema_migrations(version text primary key); insert into supabase_migrations.schema_migrations values ('202611130004'),('202611130005');");
  await db.exec(audit);
  assert.deepEqual((await db.query('select * from volunteer_slots order by id')).rows,slotsAfter);
  // Local repeatability check only; this is not permission to replay production migrations.
  await db.exec(migration);
  assert.deepEqual((await db.query('select * from volunteer_slots order by id')).rows,slotsAfter);
 }finally {await db.close();}
});
