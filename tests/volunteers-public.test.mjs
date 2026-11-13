import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import ts from 'typescript';
test('public availability explicitly excludes personal fields and reads only slot state',async()=>{
 const names=['SUPABASE_URL','SUPABASE_SERVICE_ROLE_KEY'];
 const original=Object.fromEntries(names.map(n=>[n,process.env[n]]));
 const originalFetch=globalThis.fetch;
 try {
  process.env.SUPABASE_URL='https://local-test.example';process.env.SUPABASE_SERVICE_ROLE_KEY='test-only';
  const code=ts.transpileModule(await readFile(new URL('../src/lib/volunteers/server.ts',import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText.replace("import 'server-only';",'');
  const {readAvailability}=await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
  const calls=[];
  globalThis.fetch=async url=>{
   calls.push(url);
   if(url.endsWith('/rpc/volunteer_counts')) return Response.json([{id:'slot',event_id:'event',title:'Installation',capacity:null,registered:1,email:'must-not-leak@example.test',first_name:'PRIVATE',category:'U10'}]);
   assert.equal(url,'https://local-test.example/rest/v1/volunteer_slots?select=id,enabled');
   return Response.json([{id:'slot',enabled:false}]);
  };
  const result=await readAvailability();
  assert.deepEqual(result,[{id:'slot',event_id:'event',title:'Installation',capacity:null,registered:1,enabled:false}]);
  assert.equal(calls.length,2);assert.ok(!JSON.stringify(result).includes('must-not-leak'));assert.ok(!JSON.stringify(result).includes('PRIVATE'));
 }finally{
  globalThis.fetch=originalFetch;
  for(const name of names){if(original[name]===undefined)delete process.env[name];else process.env[name]=original[name];}
 }
});
