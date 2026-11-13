import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';
test('unlimited missions never fill, closed missions stay explicit, counters agree',async()=>{
 const code=ts.transpileModule(await readFile(new URL('../src/lib/volunteers/availability.ts',import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
 const {availabilityLabel,missionIsFull}=await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
 const slot={id:'slot',event_id:'event',title:'Mission',capacity:3,registered:2,enabled:true};
 assert.ok(availabilityLabel(slot,true).includes('1 place restante'));
 assert.ok(!availabilityLabel(slot,true).includes('1 places restantes'));
 assert.ok(availabilityLabel({...slot,registered:0},true).includes('3 places restantes'));
 assert.ok(availabilityLabel({...slot,registered:3},true).includes('0 places restantes'));
 assert.equal(missionIsFull({...slot,capacity:null,registered:1000}),false);
 assert.equal(missionIsFull({...slot,registered:3}),true);
 assert.equal(availabilityLabel({...slot,capacity:null,registered:1},true),'1 inscrit · Sans limite de bénévoles');
 assert.equal(availabilityLabel({...slot,enabled:false},true),'Inscriptions fermées pour cette mission');
});
