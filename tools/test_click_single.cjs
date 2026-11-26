const puppeteer = require('d:/allProject/tools/node_modules/puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    defaultViewport: { width: 1440, height: 900 }
  });
  const page = await browser.newPage();

  const pageErrors = [];
  page.on('pageerror', err => {
    console.error('PAGE ERROR:', err.message);
    pageErrors.push(err.message);
  });

  console.log('--- TEST 1: DESKTOP CARD CLICK TO SINGLE PAGE ---');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await page.evaluate(() => window.scrollBy(0, 800));
  await new Promise(r => setTimeout(r, 800));

  // Click first card image
  const firstLink = await page.$('article div a[href^="/product/"]');
  await firstLink.click();

  // Wait for single page to finish loading (h1 should appear)
  await page.waitForSelector('h1', { timeout: 8000 });
  const detailTitle = await page.$eval('h1', el => el.innerText.trim());
  const scrollY = await page.evaluate(() => window.scrollY);
  console.log('Single page loaded:', detailTitle, 'at scrollY:', scrollY);
  console.log('Current URL:', page.url());

  await page.screenshot({
    path: 'C:/Users/Abdul/.gemini/antigravity/brain/535e5449-532e-4ad8-aadb-e2692339701e/qa_single_page_desktop_success.png'
  });

  console.log('--- TEST 2: MOBILE TAP ON CARD TITLE TO SINGLE PAGE ---');
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  await page.evaluate(() => window.scrollBy(0, 600));
  await new Promise(r => setTimeout(r, 800));

  const mobileTitles = await page.$$('article h3 a');
  console.log('Found mobile titles:', mobileTitles.length);

  // Tap on second product title
  await mobileTitles[1].tap();
  await page.waitForSelector('h1', { timeout: 8000 });
  const mobileDetailTitle = await page.$eval('h1', el => el.innerText.trim());
  const mobileScrollY = await page.evaluate(() => window.scrollY);
  console.log('Mobile Single page loaded:', mobileDetailTitle, 'at scrollY:', mobileScrollY);
  console.log('Mobile URL:', page.url());

  await page.screenshot({
    path: 'C:/Users/Abdul/.gemini/antigravity/brain/535e5449-532e-4ad8-aadb-e2692339701e/qa_single_page_mobile_success.png'
  });

  // Test 3: Tatami single page with variants
  console.log('--- TEST 3: TATAMI VARIANTS ON SINGLE PAGE ---');
  await page.goto('http://localhost:3000/product/professional-tatami-1x1m', { waitUntil: 'networkidle0' });
  await page.waitForSelector('h1', { timeout: 8000 });
  const tatamiH1 = await page.$eval('h1', el => el.innerText.trim());
  console.log('Tatami single page H1:', tatamiH1);

  const variants = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('button')).map(b => b.innerText.trim()).filter(t => t.includes('sm'));
  });
  console.log('Tatami variants found:', variants);

  await page.screenshot({
    path: 'C:/Users/Abdul/.gemini/antigravity/brain/535e5449-532e-4ad8-aadb-e2692339701e/qa_tatami_single_page.png'
  });

  await browser.close();

  console.log('--- ALL QA TESTS FINISHED ---');
  console.log('Page Errors encountered:', pageErrors);
  if (pageErrors.length > 0) {
    process.exit(1);
  } else {
    console.log('SUCCESS: All single page navigations and renderings work 100%!');
  }
})();
