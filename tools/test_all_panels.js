import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('Navigating to http://localhost:3000/admin...');
  await page.goto('http://localhost:3000/admin', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));

  // 1. Overview
  await page.screenshot({ path: 'C:/Users/Abdul/.gemini/antigravity/brain/535e5449-532e-4ad8-aadb-e2692339701e/qa_panel_overview.png' });
  console.log('Saved qa_panel_overview.png');

  // Helper to click sidebar tab
  const clickTab = async (tabText) => {
    await page.evaluate((text) => {
      const btns = Array.from(document.querySelectorAll('aside nav button'));
      const target = btns.find(b => b.textContent.includes(text));
      if (target) target.click();
    }, tabText);
    await new Promise(r => setTimeout(r, 1200));
  };

  // 2. Customers
  console.log('Testing Mijozlar Bazasi...');
  await clickTab('Mijozlar Bazasi');
  await page.screenshot({ path: 'C:/Users/Abdul/.gemini/antigravity/brain/535e5449-532e-4ad8-aadb-e2692339701e/qa_panel_customers.png' });
  console.log('Saved qa_panel_customers.png');

  // 3. Banners
  console.log('Testing Bosh Sahifa Bannerlari...');
  await clickTab('Bannerlari');
  await page.screenshot({ path: 'C:/Users/Abdul/.gemini/antigravity/brain/535e5449-532e-4ad8-aadb-e2692339701e/qa_panel_banners.png' });
  console.log('Saved qa_panel_banners.png');

  // 4. Coupons
  console.log('Testing Chegirma & Kuponlar...');
  await clickTab('Kuponlar');
  await page.screenshot({ path: 'C:/Users/Abdul/.gemini/antigravity/brain/535e5449-532e-4ad8-aadb-e2692339701e/qa_panel_coupons.png' });
  console.log('Saved qa_panel_coupons.png');

  // 5. Reviews
  console.log('Testing Mijozlar Sharhlari...');
  await clickTab('Sharhlari');
  await page.screenshot({ path: 'C:/Users/Abdul/.gemini/antigravity/brain/535e5449-532e-4ad8-aadb-e2692339701e/qa_panel_reviews.png' });
  console.log('Saved qa_panel_reviews.png');

  // 6. Test top navbar "Zayavkalar" button (should switch directly to orders tab!)
  console.log('Testing Navbar Zayavkalar button...');
  await page.evaluate(() => {
    const zayavkaBtn = Array.from(document.querySelectorAll('header button')).find(b => b.textContent.includes('Zayavkalar') || b.textContent.includes('Заявки'));
    if (zayavkaBtn) zayavkaBtn.click();
  });
  await new Promise(r => setTimeout(r, 1200));
  await page.screenshot({ path: 'C:/Users/Abdul/.gemini/antigravity/brain/535e5449-532e-4ad8-aadb-e2692339701e/qa_navbar_zayavkalar_jump.png' });
  console.log('Saved qa_navbar_zayavkalar_jump.png');

  await browser.close();
  console.log('ALL QA COMPLETED SUCCESSFULLY!');
})();
