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
 await db.exec(readFileSync(path.join(project,'supabase/migrations/202611130003_confirmed_capacities.sql'),'utf8'));
 await db.exec("update volunteer_events set event_date=(now() at time zone 'Europe/Paris')::date+1; update volunteer_slots set enabled=true;");
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
 const review=await browser.newPage();await review.goto(origin+'/benevoles/lespinasse-2026',{waitUntil:'networkidle'});await review.getByLabel('Encaissement').first().check();
 assert.ok(await review.getByRole('button',{name:'Confirmer mon inscription'}).isDisabled());await review.close();
 // Explicit opening is tested only against this disposable local fixture.
 await new Promise(resolve=>{app.once('exit',resolve);app.kill('SIGTERM');});
 app=startApp('true');
 for(let i=0;i<50;i++){try{if((await fetch(origin+'/benevoles')).ok)break;}catch{} await new Promise(r=>setTimeout(r,200));}
 assert.equal((await fetch(origin+'/api/benevoles/cron')).status,401);
 assert.equal((await fetch(origin+'/api/benevoles/inscriptions',{method:'POST',headers:{Origin:'https://evil.test','Content-Type':'application/json'},body:'{}'})).status,403);
 assert.equal((await fetch(origin+'/api/benevoles/inscriptions',{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:'{}'})).status,400);
 const context=await browser.newContext({viewport:{width:390,height:844}});const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(origin+'/benevoles#inscription',{waitUntil:'networkidle'});
 assert.equal(await page.locator('h1').textContent(),'L’espace bénévoles');
 assert.equal(await page.locator('article').count(),3);
 assert.equal(await page.locator('form').count(),0);
 assert.ok(await page.getByText('Rejoignez l’équipe des bénévoles de l’EDR Nord Toulousain.',{exact:false}).isVisible());
 assert.equal(await page.getByRole('button',{name:'Ajouter à mon écran d’accueil'}).count(),0);
 assert.equal(await page.getByText('L’ajout à l’écran d’accueil est facultatif.',{exact:false}).count(),0);
 assert.equal(await page.locator('aside').textContent(),'L’espace bénévoles à portée de main');
 assert.ok(await page.locator('#inscription').isVisible());
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth));
 for(const [id,title,venue] of [
 ['lespinasse-2026','Loto de Lespinasse','Salle du Canal des Deux Mers'],
 ['bruguieres-2027','Loto de Bruguières','Salle Xeraco'],
 ['saint-jory-2027','Loto de Saint-Jory','Foyer rural']]) {
  const card=page.getByRole('article').filter({has:page.getByRole('heading',{name:title,exact:true})});
  assert.ok(await card.getByText(venue,{exact:true}).isVisible());
  assert.equal(await card.getByRole('link',{name:'Voir les missions',exact:false}).getAttribute('href'),`/benevoles/${id}`);
 }
 await page.getByRole('link',{name:'Voir les missions — Loto de Lespinasse',exact:true}).click();
 await page.waitForURL('**/benevoles/lespinasse-2026');
 assert.equal(await page.locator('h1').textContent(),'Loto de Lespinasse');
 assert.equal(await page.locator('fieldset').count(),1);
 assert.equal(await page.locator('fieldset label > span > span:first-child').count(),9);
 assert.deepEqual(await page.locator('fieldset label > span > span:first-child').allTextContents(),[
 'Installation des tables, chaises et de la buvette','Encaissement','Tenue de la buvette','Contrôle des cartons','Annonce des numéros','Distribution des numéros','Rangement des tables et chaises','Balayage','Rangement de la buvette']);
 await page.getByText('1 / 4 places prises').waitFor();
 assert.equal(await page.getByText('0 inscrits · Sans limite de bénévoles',{exact:true}).count(),4);
 assert.ok(await page.getByLabel('Rangement de la buvette').isEnabled());
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth));
 const fill=async()=>{
  await page.getByLabel('Nom',{exact:true}).fill('Test-Privé');await page.getByLabel('Prénom',{exact:true}).fill('Alice');
  await page.getByLabel('E-mail',{exact:true}).fill('alice-private@example.test');await page.getByLabel('Catégorie de l’enfant').selectOption('U10');await page.getByLabel('J’accepte').check();
 };
 await page.getByLabel('Encaissement').check();await page.getByLabel(/^Installation/).check();
 await fill();
 await page.getByRole('button',{name:'Confirmer mon inscription'}).click();
 await page.getByRole('status').filter({hasText:'Inscription enregistrée'}).waitFor();
 assert.equal(await page.getByLabel('E-mail',{exact:true}).inputValue(),'');
 assert.equal((await db.query('select count(*)::int n from volunteer_assignments')).rows[0].n,2);
 assert.equal((await db.query('select count(*)::int n from volunteer_mail')).rows[0].n,2);
 assert.equal(await page.locator('fieldset input:checked').count(),0);
 // A second visit follows the home card, with a new form and event-only selection.
 await page.getByRole('link',{name:'Voir les autres événements'}).click();await page.waitForURL(url=>url.pathname==='/benevoles');
 await page.getByRole('link',{name:'Voir les missions — Loto de Bruguières',exact:true}).click();await page.waitForURL('**/benevoles/bruguieres-2027');
 assert.equal(await page.getByLabel('E-mail',{exact:true}).inputValue(),'');assert.equal(await page.locator('fieldset input:checked').count(),0);
 await page.getByLabel('Contrôle des cartons').check();await fill();
 await page.getByRole('button',{name:'Confirmer mon inscription'}).click();await page.getByRole('status').filter({hasText:'Inscription enregistrée'}).waitFor();
 const assignments=(await db.query('select slot_id from volunteer_assignments order by slot_id')).rows.map(r=>r.slot_id);
 assert.deepEqual(assignments,['bruguieres-2027-controle-cartons','lespinasse-2026-encaissement','lespinasse-2026-installation']);
 assert.equal((await db.query('select count(*)::int n from volunteer_mail')).rows[0].n,4);
 const dataResponse=await fetch(origin+'/api/benevoles');const data=await dataResponse.text();assert.equal(dataResponse.headers.get('cache-control'),'no-store');assert.ok(!data.includes('alice-private'));assert.ok(!data.includes('Test-Privé'));
 const publicPage=await context.newPage();await publicPage.goto(origin+'/benevoles/lespinasse-2026',{waitUntil:'networkidle'});assert.ok(await publicPage.getByText('2 / 4 places prises').isVisible());assert.ok(!(await publicPage.content()).includes('alice-private'));
 // Direct links, unique metadata and a clear 404 for unknown events.
 for(const id of ['lespinasse-2026','bruguieres-2027','saint-jory-2027']) {
  const r=await fetch(`${origin}/benevoles/${id}`);assert.equal(r.status,200);
  const html=await r.text();assert.ok(html.includes(`/benevoles/${id}`));assert.ok(!html.includes('alice-private'));
 }
 assert.equal((await fetch(origin+'/benevoles/evenement-inconnu')).status,404);
 await publicPage.goto(origin+'/benevoles/saint-jory-2027',{waitUntil:'networkidle'});
 assert.ok(await publicPage.getByRole('heading',{name:'Loto de Saint-Jory',exact:true}).isVisible());
 assert.equal(await publicPage.locator('fieldset input:checked').count(),0);
 await page.setViewportSize({width:320,height:740});
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth),'Event form overflows a 320px screen');
 await page.goto(origin+'/benevoles',{waitUntil:'networkidle'});
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth),'Event cards overflow a 320px screen');
 await page.setViewportSize({width:1440,height:1000});await page.goto(origin+'/benevoles',{waitUntil:'networkidle'});
 assert.equal(await page.locator('article').count(),3);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth));
 await page.screenshot({path:'/tmp/edr-benevoles-accueil.png',fullPage:true});
 await page.goto(origin+'/benevoles/lespinasse-2026',{waitUntil:'networkidle'});
 await page.screenshot({path:'/tmp/edr-benevoles-evenement.png',fullPage:true});
 await page.evaluate(async()=>{await navigator.serviceWorker.ready;});await page.reload({waitUntil:'networkidle'});
 assert.ok(await page.evaluate(()=>!!navigator.serviceWorker.controller));
 assert.deepEqual(await page.evaluate(async()=>await caches.keys()),[]);
 assert.equal(await page.evaluate(()=>localStorage.length),0);assert.equal(await page.evaluate(()=>sessionStorage.length),0);
 await publicPage.goto(origin+'/',{waitUntil:'networkidle'});assert.equal(await publicPage.evaluate(()=>navigator.serviceWorker.controller),null);
 await context.setOffline(true);await page.reload();await page.getByRole('heading',{name:'Vous êtes hors connexion'}).waitFor();assert.ok(!(await page.content()).includes('alice-private'));
 assert.deepEqual(errors,[]);
 console.log('PASS: home cards and legacy anchor, three event pages, mobile/desktop layout, multiple missions in one submission, fresh form for second event, exact SQL assignments and outbox, public counters, closed-state protection, PWA scope and offline fallback without cached data. No real email sent.');
}finally {if(browser)await browser.close();if(app)app.kill('SIGTERM');if(server)await new Promise(r=>server.close(r));await db.close();}
})().catch(e=>{console.error(e);process.exit(1)});
