import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PGlite } from '@electric-sql/pglite';
import { chromium } from 'playwright';
import { readFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { spawn } from 'node:child_process';
import assert from 'node:assert/strict';
const project=fileURLToPath(new URL('..', import.meta.url));
(async()=>{
const db=new PGlite();let app, browser, server;
try {
 await db.exec('create role anon; create role authenticated; create role service_role bypassrls;');
 await db.exec(readFileSync(path.join(project,'supabase/migrations/202611130001_volunteers.sql'),'utf8'));
 await db.exec(readFileSync(path.join(project,'supabase/migrations/202611130002_missions.sql'),'utf8'));
 await db.exec("update volunteer_events set event_date=(now() at time zone 'Europe/Paris')::date+1; update volunteer_slots set enabled=true where capacity is not null; insert into volunteer_slots values('lespinasse-2026-installation','lespinasse-2026','Installation',8,0,true) on conflict(id) do update set capacity=8,enabled=true;");
 server=createServer(async(req,res)=>{try{
  assert.equal(req.headers.authorization,'Bearer local-test-only');
  let body='';for await(const chunk of req) body+=chunk;
  const args=JSON.parse(body);let data;
  if(req.url==='/rest/v1/rpc/volunteer_counts') data=(await db.query('select * from volunteer_counts()')).rows;
  else if(req.url==='/rest/v1/rpc/volunteer_register') data=(await db.query('select volunteer_register($1,$2,$3,$4,$5,$6) ok',[args.p_first,args.p_last,args.p_email,args.p_category,args.p_slots,args.p_bucket])).rows[0].ok;
  else throw Error('Unexpected RPC');
  res.writeHead(200,{'Content-Type':'application/json'});res.end(JSON.stringify(data));
 }catch(e){console.error(e.message);res.writeHead(500);res.end('{}');}});
 await new Promise(r=>server.listen(3401,'127.0.0.1',r));
 const startApp=(registrationFlag)=>spawn(process.execPath,['node_modules/next/dist/bin/next','start','--hostname','127.0.0.1','--port','3400'],{cwd:project,env:{...process.env,VOLUNTEERS_REGISTRATION_ENABLED:registrationFlag,SUPABASE_URL:'http://127.0.0.1:3401',SUPABASE_SERVICE_ROLE_KEY:'local-test-only',RESEND_API_KEY:'local-test-only',VOLUNTEERS_EMAIL_FROM:'test@example.test',CRON_SECRET:'local-test-only',VOLUNTEERS_RATE_SALT:'local-test-only',VOLUNTEERS_ORIGIN:'http://127.0.0.1:3400',NEXT_TELEMETRY_DISABLED:'1'},stdio:'ignore'});
 app=startApp('false');
 const origin='http://127.0.0.1:3400';
 for(let i=0;i<50;i++){try{if((await fetch(origin+'/benevoles')).ok)break;}catch{} await new Promise(r=>setTimeout(r,200));}
 // With all services configured and database slots enabled, validation is still required.
 assert.equal((await (await fetch(origin+'/api/benevoles')).json()).registrationOpen,false);
 assert.equal((await fetch(origin+'/api/benevoles/inscriptions',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:JSON.stringify({firstName:'Alice',lastName:'Test',email:'closed@example.test',category:'U10',consent:true,slots:['lespinasse-2026-encaissement']})})).status,503);
 assert.equal((await fetch(origin+'/api/benevoles/cron',{headers:{Authorization:'Bearer local-test-only'}})).status,503);
 assert.equal((await db.query('select count(*)::int n from volunteer_people')).rows[0].n,0);
 browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH || '/usr/bin/chromium',args:['--no-sandbox'],headless:true});
 const review=await browser.newPage();await review.goto(origin+'/benevoles',{waitUntil:'networkidle'});await review.getByLabel('Encaissement').first().check();
 assert.ok(await review.getByRole('button',{name:'Confirmer mon inscription'}).isDisabled());await review.close();
 // Explicit opening is tested only against this disposable local fixture.
 await new Promise(resolve=>{app.once('exit',resolve);app.kill('SIGTERM');});
 app=startApp('true');
 for(let i=0;i<50;i++){try{if((await fetch(origin+'/benevoles')).ok)break;}catch{} await new Promise(r=>setTimeout(r,200));}
 assert.equal((await fetch(origin+'/api/benevoles/cron')).status,401);
 assert.equal((await fetch(origin+'/api/benevoles/inscriptions',{method:'POST',headers:{Origin:'https://evil.test','Content-Type':'application/json'},body:'{}'})).status,403);
 assert.equal((await fetch(origin+'/api/benevoles/inscriptions',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:'{}'})).status,400);
 const context=await browser.newContext({viewport:{width:390,height:844}});const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(origin+'/benevoles',{waitUntil:'networkidle'});
 assert.equal(await page.locator('h1').textContent(),'L’espace bénévoles');
 assert.equal(await page.locator('fieldset').count(),3);
 for (const field of await page.locator('fieldset').all()) assert.deepEqual(await field.locator('label > span > span:first-child').allTextContents(),[
 'Installation des tables, chaises et de la buvette','Encaissement','Tenue de la buvette','Contrôle des cartons','Annonce des numéros','Distribution des numéros','Rangement des tables et chaises','Balayage','Rangement de la buvette']);
 assert.ok(await page.getByText('1 / 4 inscrits').isVisible());
 await page.getByLabel('Encaissement').first().check();await page.getByLabel(/^Installation/).first().check();await page.locator('fieldset').nth(1).getByLabel('Contrôle des cartons').check();
 await page.getByLabel('Nom',{exact:true}).fill('Test-Privé');await page.getByLabel('Prénom',{exact:true}).fill('Alice');
 await page.getByLabel('E-mail',{exact:true}).fill('alice-private@example.test');await page.getByLabel('Catégorie de l’enfant').selectOption('U10');await page.getByLabel('J’accepte').check();
 await page.getByRole('button',{name:'Confirmer mon inscription'}).click();
 await page.getByRole('status').filter({hasText:'Inscription enregistrée'}).waitFor();
 assert.equal(await page.getByLabel('E-mail',{exact:true}).inputValue(),'');
 const dataResponse=await fetch(origin+'/api/benevoles');const data=await dataResponse.text();assert.equal(dataResponse.headers.get('cache-control'),'no-store');assert.ok(!data.includes('alice-private'));assert.ok(!data.includes('Test-Privé'));
 assert.equal((await db.query('select count(*)::int n from volunteer_assignments')).rows[0].n,3);
 assert.equal((await db.query('select count(*)::int n from volunteer_mail')).rows[0].n,4);
 const publicPage=await context.newPage();await publicPage.goto(origin+'/benevoles',{waitUntil:'networkidle'});assert.ok(await publicPage.getByText('2 / 4 inscrits').isVisible());assert.ok(!(await publicPage.content()).includes('alice-private'));
 await page.evaluate(async()=>{await navigator.serviceWorker.ready;});await page.reload({waitUntil:'networkidle'});
 assert.ok(await page.evaluate(()=>!!navigator.serviceWorker.controller));
 assert.deepEqual(await page.evaluate(async()=>await caches.keys()),[]);
 assert.equal(await page.evaluate(()=>localStorage.length),0);assert.equal(await page.evaluate(()=>sessionStorage.length),0);
 await publicPage.goto(origin+'/',{waitUntil:'networkidle'});assert.equal(await publicPage.evaluate(()=>navigator.serviceWorker.controller),null);
 await context.setOffline(true);await page.reload();await page.getByRole('heading',{name:'Vous êtes hors connexion'}).waitFor();assert.ok(!(await page.content()).includes('alice-private'));
 assert.deepEqual(errors,[]);
 console.log('PASS: closed registration/cron even with configured services and enabled slots, then explicit local opening; API validation/origin/auth, real SQL registration of three missions across two events, outbox, public counters in second browser, mobile form, isolated service worker, empty caches/storage, safe offline fallback. No real email sent.');
}finally {if(browser)await browser.close();if(app)app.kill('SIGTERM');if(server)await new Promise(r=>server.close(r));await db.close();}
})().catch(e=>{console.error(e);process.exit(1)});
