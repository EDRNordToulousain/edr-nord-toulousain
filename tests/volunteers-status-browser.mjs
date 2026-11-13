import {chromium} from 'playwright';
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
const root=fileURLToPath(new URL('..',import.meta.url));
const origin='http://127.0.0.1:3420';
const app=spawn(process.execPath,['node_modules/next/dist/bin/next','start','--hostname','127.0.0.1','--port','3420'],{cwd:root,env:{...process.env,NEXT_TELEMETRY_DISABLED:'1',VOLUNTEERS_REGISTRATION_ENABLED:'false'},stdio:'ignore'});
let browser;
try {
 for(let i=0;i<50;i++){try{if((await fetch(origin+'/benevoles')).ok)break;}catch{}await new Promise(r=>setTimeout(r,200));}
 browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
 const events=['lespinasse-2026','bruguieres-2027','saint-jory-2027'];
 let posts=0;
 for(const width of [320,1440])for(const id of events){
  const context=await browser.newContext({viewport:{width,height:900}});
  const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
  let mode='closed',taken=1,release='local',holdNext=false,held;
  const data=()=>({registrationOpen:mode==='open',countsLive:true,slots:events.flatMap(event_id=>[
   {id:event_id+'-installation',event_id,title:'Installation',capacity:null,registered:0,enabled:true},
   {id:event_id+'-encaissement',event_id,title:'Encaissement',capacity:4,registered:taken,enabled:true},
   {id:event_id+'-buvette',event_id,title:'Tenue de la buvette',capacity:3,registered:3,enabled:true},
  ])});
  await context.route('**/api/benevoles',async route=>{
   const payload=mode==='malformed'?{registrationOpen:true,countsLive:true,slots:null}:data();
   const responseMode=mode;
   if(holdNext){holdNext=false;await new Promise(resolve=>{held=resolve;});}
   try{await route.fulfill({status:responseMode==='error'?503:200,contentType:'application/json',headers:{'Cache-Control':'no-store','X-EDR-Release':release},body:JSON.stringify(payload)});}catch{/* an obsolete fetch may have been aborted */}
  });
  await context.route('**/api/benevoles/inscriptions',async route=>{posts++;await route.abort();});
  await page.goto(origin+'/benevoles/'+id,{waitUntil:'networkidle'});
  const form=page.locator('form#inscription');
  await page.waitForFunction(()=>document.querySelector('form')?.dataset.registrationState==='closed');
  await page.getByRole('checkbox',{name:/Installation/}).check();await page.getByLabel('J’accepte').check();
  const button=page.getByRole('button',{name:'Confirmer mon inscription'});
  assert.ok(await button.isDisabled());
  // Exact reported discrepancy: a new API read is open while the old client snapshot is closed.
  mode='open';
  assert.equal((await page.evaluate(async()=>await (await fetch('/api/benevoles',{cache:'no-store'})).json())).registrationOpen,true);
  assert.equal(await form.getAttribute('data-registration-state'),'closed');
  await page.evaluate(()=>window.dispatchEvent(new Event('focus')));
  await page.waitForFunction(()=>document.querySelector('form')?.dataset.registrationState==='open');
  assert.equal(await page.getByText('Les inscriptions ne sont pas encore ouvertes.',{exact:false}).count(),0);
  assert.ok(await button.isEnabled());assert.ok(await page.getByLabel('Tenue de la buvette').isDisabled());
  await page.getByLabel('J’accepte').uncheck();assert.ok(await button.isDisabled());
  await form.dispatchEvent('submit');assert.equal(posts,0);
  await page.getByLabel('J’accepte').check();await page.getByRole('checkbox',{name:/Installation/}).uncheck();assert.ok(await button.isDisabled());
  await form.dispatchEvent('submit');assert.equal(posts,0);
  await page.getByRole('checkbox',{name:/Installation/}).check();
  // HTML validation also prevents a POST while identity fields are still empty.
  await button.click();assert.equal(posts,0);
  taken=2;await page.evaluate(()=>document.dispatchEvent(new Event('visibilitychange')));
  await page.getByText('2 / 4 places prises · 2 places restantes',{exact:true}).waitFor();
  taken=4;await page.evaluate(()=>window.dispatchEvent(new Event('online')));
  await page.getByText('4 / 4 places prises · 0 places restantes',{exact:true}).waitFor();assert.ok(await page.getByLabel('Encaissement').isDisabled());
  mode='error';await page.evaluate(()=>window.dispatchEvent(new Event('focus')));
  await form.getByRole('alert').waitFor();
  await page.waitForFunction(()=>document.querySelector('form')?.dataset.registrationState==='error');assert.equal(await form.getAttribute('data-registration-state'),'error');assert.ok(await button.isDisabled());
  mode='open';await page.getByRole('button',{name:'Réessayer',exact:true}).click();
  await page.waitForFunction(()=>document.querySelector('form')?.dataset.registrationState==='open');
  mode='malformed';await page.evaluate(()=>window.dispatchEvent(new Event('focus')));
  await form.getByRole('alert').waitFor();
  await page.waitForFunction(()=>document.querySelector('form')?.dataset.registrationState==='error');assert.ok(await button.isDisabled());
  mode='open';await page.getByRole('button',{name:'Réessayer',exact:true}).click();await page.waitForFunction(()=>document.querySelector('form')?.dataset.registrationState==='open');
  // A slower old open response cannot undo a newer closure.
  holdNext=true;held=undefined;await page.evaluate(()=>window.dispatchEvent(new Event('focus')));
  for(let i=0;i<50&&!held;i++)await new Promise(r=>setTimeout(r,10));assert.ok(held);
  mode='closed';await page.evaluate(()=>window.dispatchEvent(new Event('focus')));await page.waitForFunction(()=>document.querySelector('form')?.dataset.registrationState==='closed');
  held();await page.waitForTimeout(100);assert.equal(await form.getAttribute('data-registration-state'),'closed');assert.ok(await button.isDisabled());
  // Detect a mixed HTML/API release without an automatic reload that could erase a form.
  mode='open';release='new-release';await page.evaluate(()=>{document.querySelector('meta[name="edr-volunteers-release"]').content='old-release';window.dispatchEvent(new Event('focus'));});
  await page.getByText('Le site a été mis à jour.',{exact:false}).waitFor();assert.ok(await button.isDisabled());
  release='local';await page.evaluate(()=>{document.querySelector('meta[name="edr-volunteers-release"]').content='local';window.dispatchEvent(new Event('focus'));});
  await page.waitForFunction(()=>document.querySelector('form')?.dataset.registrationState==='open');
  // The pre-submit check must catch closure even before a focus/interval refresh.
  await page.getByLabel('Nom',{exact:true}).fill('Local');await page.getByLabel('Prénom',{exact:true}).fill('Test');await page.getByLabel('E-mail',{exact:true}).fill('local@example.test');await page.getByLabel('Catégorie de l’enfant').selectOption('U10');
  mode='closed';await button.click();await page.waitForFunction(()=>document.querySelector('form')?.dataset.registrationState==='closed');assert.equal(posts,0);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth));assert.deepEqual(errors,[]);
  if(width===320&&id===events[0])await page.screenshot({path:'/tmp/edr-form-status-mobile.png',fullPage:true});
  await context.close();
 }
 // Check scheduled polling using a clock rather than waiting 30 real seconds.
 const context=await browser.newContext();const page=await context.newPage();await page.clock.install();let taken=0;
 await context.route('**/api/benevoles',r=>r.fulfill({json:{registrationOpen:true,countsLive:true,slots:[{id:events[0]+'-encaissement',event_id:events[0],title:'Encaissement',capacity:4,registered:taken,enabled:true}]}}));
 await page.goto(origin+'/benevoles/'+events[0],{waitUntil:'networkidle'});await page.getByText('0 / 4 places prises · 4 places restantes',{exact:true}).waitFor();
 taken=3;await page.clock.runFor(30000);await page.getByText('3 / 4 places prises · 1 place restante',{exact:true}).waitFor();await context.close();
 assert.equal(posts,0);
 console.log('PASS: all 3 events at 320/1440px; old closed snapshot vs open API; focus/visibility/online/poll refresh; closure/error/malformed data fail closed; consent and selection guards; full quotas; stale responses; release mismatch; final pre-submit closure. No registration POST or email sent.');
}finally{if(browser)await browser.close();app.kill('SIGTERM');}
