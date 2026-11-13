import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';
test('opening requires exact explicit approval flag AND every service binding',async()=>{
  const names=['VOLUNTEERS_REGISTRATION_ENABLED','SUPABASE_URL','SUPABASE_SERVICE_ROLE_KEY','RESEND_API_KEY','VOLUNTEERS_EMAIL_FROM','CRON_SECRET','VOLUNTEERS_ORIGIN','VOLUNTEERS_RATE_SALT'];
  const original=Object.fromEntries(names.map(n=>[n,process.env[n]]));
  const code=ts.transpileModule(await readFile(new URL('../src/lib/volunteers/server.ts',import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText.replace("import 'server-only';",'');
  const {registrationOpen}=await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
  try {
    for(const name of names)process.env[name]='test-only';
    for(const flag of [undefined,'false','TRUE','1','']) {
      if(flag===undefined)delete process.env.VOLUNTEERS_REGISTRATION_ENABLED;else process.env.VOLUNTEERS_REGISTRATION_ENABLED=flag;
      assert.equal(registrationOpen(),false);
    }
    process.env.VOLUNTEERS_REGISTRATION_ENABLED='true';assert.equal(registrationOpen(),true);
    for(const name of names.slice(1)){delete process.env[name];assert.equal(registrationOpen(),false);process.env[name]='test-only';}
  }finally {for(const name of names){if(original[name]===undefined)delete process.env[name];else process.env[name]=original[name];}}
});
