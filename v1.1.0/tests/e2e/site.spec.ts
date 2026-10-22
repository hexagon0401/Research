import {test,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
test('legacy project and planning-source links keep their identities',async({page})=>{
 await page.goto('/research/state-firm-models#P-005');await expect(page.locator('#P-005')).toBeVisible();await page.reload();await expect(page.locator('#P-005')).toContainText('비교 가설');
 await page.getByRole('button',{name:'KO',exact:true}).first().click();await expect(page.locator('h1')).toContainText('미국·중국');await page.reload();await expect(page.locator('h1')).toContainText('미국·중국');
 await page.goto('/library/integration-handoff');await expect(page.getByText('열람 가능한 작업계획 발췌문')).toBeVisible();
});
test('library keeps missing books distinct from available research',async({page})=>{
 await page.goto('/library');await page.getByRole('searchbox').fill('Thiel');await expect(page.locator('.collection-row')).toHaveCount(1);await page.getByRole('link',{name:/Zero to One/}).click();await expect(page.getByText('Not supplied',{exact:true})).toBeVisible();await expect(page.getByText('Not available',{exact:true})).toBeVisible();
});
test('home and document navigation survive without JavaScript',async({browser,baseURL})=>{
 const context=await browser.newContext({javaScriptEnabled:false});const p=await context.newPage();await p.goto(`${baseURL}/`);await expect(p.locator('h1')).toContainText('national power');await expect(p.locator('[data-research-node]')).toHaveCount(13);await p.goto(`${baseURL}/archive`);await p.locator('.report-list h2 a').first().click();await expect(p.locator('#transcript')).toContainText('corporate');await context.close();
});
test('home accessibility and core page widths remain usable',async({page})=>{
 await page.emulateMedia({reducedMotion:'reduce'});await page.goto('/');const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa']).analyze();expect(result.violations.map(v=>({id:v.id,nodes:v.nodes.map(n=>n.target)}))).toEqual([]);
 for(const route of ['/','/archive','/reports/S00','/library','/methods','/about','/accessibility']){await page.goto(route);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),route).toBe(true);}
});
test('unknown documents fail cleanly',async({page})=>{
 const response=await page.goto('/archive/not-a-document');expect(response?.status()).toBe(404);await expect(page.locator('h1')).toContainText('still unwritten');
});
test('both languages fit the release viewport matrix',async({page},info)=>{
 test.skip(info.project.name!=='desktop','Matrix runs once');
 for(const width of [320,375,390,768,1024,1200,1440,1920]){await page.setViewportSize({width,height:900});for(const lang of ['EN','KO']){await page.goto('/');await page.getByRole('button',{name:lang,exact:true}).first().click();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${width} ${lang} home`).toBe(true);await page.goto('/reports/S14');expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`${width} ${lang} table`).toBe(true);}}
});
test('public planning APIs retain provenance and unavailable material stays unavailable',async({request})=>{
 const m=await(await request.get('/api/public/manifest')).json();expect(m.projects).toHaveLength(6);expect((await(await request.get('/api/public/claims/CLAIM-01')).json()).verificationStatus).toBe('UNVERIFIED');const d=await(await request.get('/api/public/documents/corporate-resilience')).json();expect(d.paragraphs[0].en).toBeNull();expect(d.sourceId).toBe('HANDOFF-01');expect((await request.post('/api/public/sources',{data:{title:'test'}})).status()).toBe(405);
});
test('existing original-file API and no-JavaScript index still resolve safely',async({page,request,browser,baseURL})=>{
 await page.goto('/archive/conditional-partnership');await expect(page.locator('.report-related a[href="/reports/S00"]')).toBeVisible();
 const response=await request.get('/api/public/assets/s00-reader-rev-001/open',{maxRedirects:0});expect(response.status()).toBe(302);expect(response.headers().location).toBe('/report-pdfs/s00/rev-001/reader.pdf');expect(response.headers()['cache-control']).toContain('no-store');
 const context=await browser.newContext({javaScriptEnabled:false});const p=await context.newPage();await p.goto(`${baseURL}/archive/corporate-resilience`);await p.getByRole('link',{name:/Original files \/ 원본/}).click();await expect(p).toHaveURL(/originals\/corporate-resilience/);await context.close();
});
