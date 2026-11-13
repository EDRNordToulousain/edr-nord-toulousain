import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';
import ts from 'typescript';
test('three matching mission lists preserve confirmed capacities and unknown limits',async()=>{
 const db=new PGlite();
 try {
  await db.exec('create role anon; create role authenticated; create role service_role bypassrls;');
  for(const name of ['202611130001_volunteers.sql','202611130002_missions.sql']) await db.exec(await readFile(new URL('../supabase/migrations/'+name,import.meta.url),'utf8'));
  const code=ts.transpileModule(await readFile(new URL('../src/lib/volunteers/events.ts',import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
  const {previewSlots,volunteerEvents}=await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
  const rows=(await db.query('select * from volunteer_counts()')).rows;
  assert.equal(rows.length,27);
  assert.deepEqual(rows.sort((a,b)=>a.id.localeCompare(b.id)),previewSlots.sort((a,b)=>a.id.localeCompare(b.id)));
  const rls=(await db.query("select relname,relrowsecurity from pg_class where relname in ('volunteer_events','volunteer_slots','volunteer_people','volunteer_assignments','volunteer_rate','volunteer_mail')")).rows;
  assert.equal(rls.length,6);assert.ok(rls.every(t=>t.relrowsecurity));
  for (const event of volunteerEvents) {
   const slots=rows.filter(r=>r.event_id===event.id);
   assert.equal(slots.length,9);assert.equal(slots.filter(s=>s.capacity===null).length,5);
   assert.equal(slots.find(s=>s.id.endsWith('-controle-cartons')).capacity,2);
   assert.equal(slots.find(s=>s.id.endsWith('-annonce-numeros')).capacity,1);
   assert.equal(slots.find(s=>s.id.endsWith('-distribution-numeros')).capacity,1);
  }
  await assert.rejects(()=>db.exec("update volunteer_slots set enabled=true where capacity is null"),/check constraint/);
  // Existing administrator decisions are preserved by the additive seed migration.
  await db.exec("update volunteer_slots set capacity=6 where id='lespinasse-2026-encaissement'");
  const migration=await readFile(new URL('../supabase/migrations/202611130002_missions.sql',import.meta.url),'utf8');
  // Only re-execute its idempotent insert, not the schema change.
  await db.exec(migration.slice(migration.indexOf('with missions'),migration.indexOf('-- Closed')));
  assert.equal((await db.query("select capacity from volunteer_slots where id='lespinasse-2026-encaissement'")).rows[0].capacity,6);
 }finally {await db.close();}
});
