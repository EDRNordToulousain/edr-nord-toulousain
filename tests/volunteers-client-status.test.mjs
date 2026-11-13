import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import ts from 'typescript';
test('API flags and counters form one strict snapshot and never infer opening from counts',async()=>{
 const code=ts.transpileModule(await readFile(new URL('../src/lib/volunteers/client-status.ts',import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
 const {parseAvailability}=await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
 const slot={id:'event-installation',event_id:'event',title:'Installation',capacity:null,registered:0,enabled:true};
 const data={slots:[slot,{...slot,id:'other-installation',event_id:'other'}],countsLive:true,registrationOpen:true};
 assert.deepEqual(parseAvailability(data,'event'),{slots:[slot],countsLive:true,status:'open'});
 assert.equal(parseAvailability({...data,registrationOpen:false},'event').status,'closed');
 assert.equal(parseAvailability({...data,countsLive:false},'event').status,'closed');
 for(const invalid of [null,{}, {...data,registrationOpen:'true'},{...data,slots:null},{...data,slots:[{...slot,registered:-1}]},{...data,slots:[{...slot,enabled:undefined}]},{...data,slots:[{...slot,capacity:0}]}])assert.throws(()=>parseAvailability(invalid,'event'));
});
