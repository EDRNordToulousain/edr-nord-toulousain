import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';
const moduleURL=code=>'data:text/javascript;base64,'+Buffer.from(code).toString('base64');
const compile=code=>ts.transpileModule(code,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
test('confirmation, fixed admin recipient, reminder and failed delivery stay server-side',async()=>{
  const eventsURL=moduleURL(compile(await readFile(new URL('../src/lib/volunteers/events.ts',import.meta.url),'utf8')));
  const state={calls:[],requests:[],jobs:[]};globalThis.__volunteerMailTest=state;
  const serverURL=moduleURL(`export function required(n){return n==='VOLUNTEERS_EMAIL_FROM'?'EDR <test@example.test>':'test-only';} export async function rpc(name,args){const s=globalThis.__volunteerMailTest;s.calls.push({name,args});return name==='volunteer_claim_mail'?s.jobs:null;}`);
  let code=compile(await readFile(new URL('../src/lib/volunteers/mail.ts',import.meta.url),'utf8'));
  code=code.replace("import 'server-only';",'').replace("'./server'",JSON.stringify(serverURL)).replace("'./events'",JSON.stringify(eventsURL));
  const originalFetch=globalThis.fetch;
  globalThis.fetch=async(url,options)=>{state.requests.push({url,options});return new Response('{}',{status:state.requests.length===4?429:200});};
  try {
    const {deliverMail}=await import(moduleURL(code));
    state.jobs=['confirmation','admin','reminder','confirmation'].map((kind,i)=>({id:`job-${i}`,kind,email:'private@example.test',first_name:'Alice',last_name:'Private',category:'U10',event_id:'lespinasse-2026',missions:['Encaissement','Installation'],lease:'lease'}));
    const result=await deliverMail();assert.deepEqual(result,{sent:3,failed:1});
    assert.equal(state.calls[0].name,'volunteer_queue_reminders');
    const bodies=state.requests.map(r=>JSON.parse(r.options.body));
    assert.deepEqual(bodies[0].to,['private@example.test']);
    for (const body of bodies) assert.equal(body.reply_to,'communication.edrnordtoulousain@gmail.com');
    assert.deepEqual(bodies[1].to,['communication.edrnordtoulousain@gmail.com']);
    assert.ok(bodies[1].text.includes('Alice Private'));assert.ok(bodies[1].text.includes('U10'));
    assert.ok(bodies[2].subject.includes('demain'));assert.ok(bodies[2].text.includes('Encaissement, Installation'));
    assert.ok(bodies[0].text.includes('18 h'));assert.ok(bodies[0].text.includes('19 h 30'));assert.ok(bodies[0].text.includes('21 h'));
    assert.equal(state.requests[0].options.headers['Idempotency-Key'],'volunteer-job-0');
    assert.equal(state.calls.filter(c=>c.name==='volunteer_finish_mail').at(-1).args.p_success,false);
  } finally {globalThis.fetch=originalFetch;delete globalThis.__volunteerMailTest;}
});
