const puppeteer = require('d:/allProject/tools/node_modules/puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    defaultViewport: { width: 390, height: 844, isMobile: true, hasTouch: true }
  });
  const page = await browser.newPage();

  console.log('1. Loading Admin Dashboard on Mobile (390x844)...');
  await page.goto('http://localhost:3000/admin', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));

  // Switch to Products tab
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const pBtn = btns.find(b => b.innerText.includes('Mahsulotlar') || b.innerText.includes('Products'));
    if (pBtn) pBtn.click();
  });
  await new Promise(r => setTimeout(r, 1000));

  // Check 1: Sticky header before scroll
  const headerBefore = await page.$eval('header', el => el.getBoundingClientRect().top);
  console.log('Header top at rest:', headerBefore);

  // Scroll down 400px
  await page.evaluate(() => window.scrollBy(0, 400));
  await new Promise(r => setTimeout(r, 800));

  // Check 2: Sticky header after scroll
  const headerAfter = await page.$eval('header', el => el.getBoundingClientRect().top);
  console.log('Header top after scrollBy 400px:', headerAfter);

  // Check 3: Mobile 1-row product items
  const productRows = await page.evaluate(() => {
    // Find all mobile items
    const rows = Array.from(document.querySelectorAll('.block.lg\\:hidden > div'));
    return rows.map(r => {
      const rect = r.getBoundingClientRect();
      const title = r.querySelector('h4') ? r.querySelector('h4').innerText.trim() : '';
      const buttons = Array.from(r.querySelectorAll('button')).map(b => ({
        title: b.getAttribute('title'),
        right: b.getBoundingClientRect().right,
        visible: b.getBoundingClientRect().right <= window.innerWidth + 5
      }));
      return {
        title,
        width: rect.width,
        right: rect.right,
        windowWidth: window.innerWidth,
        fitsInWindow: rect.right <= window.innerWidth + 5,
        buttons
      };
    });
  });

  console.log(`Found ${productRows.length} product rows on mobile.`);
  if (productRows.length > 0) {
    console.log('Sample row verification:', productRows[0]);
  }

  await page.screenshot({
    path: 'C:/Users/Abdul/.gemini/antigravity/brain/535e5449-532e-4ad8-aadb-e2692339701e/qa_admin_mobile_products_sticky.png'
  });

  // Check 4: Desktop view
  console.log('2. Testing Desktop View (1440x900)...');
  await page.setViewport({ width: 1440, height: 900, isMobile: false, hasTouch: false });
  await page.evaluate(() => window.scrollTo(0, 0));
  await new Promise(r => setTimeout(r, 1000));

  await page.evaluate(() => window.scrollBy(0, 500));
  await new Promise(r => setTimeout(r, 800));

  const desktopHeaderTop = await page.$eval('header', el => el.getBoundingClientRect().top);
  console.log('Desktop Header top after scrollBy 500px:', desktopHeaderTop);

  await page.screenshot({
    path: 'C:/Users/Abdul/.gemini/antigravity/brain/535e5449-532e-4ad8-aadb-e2692339701e/qa_admin_desktop_products.png'
  });

  await browser.close();

  const isStickyPassed = Math.abs(headerAfter) < 2 && Math.abs(desktopHeaderTop) < 2;
  const isRowFitsPassed = productRows.every(r => r.fitsInWindow && r.buttons.every(b => b.visible));

  console.log('--- TEST RESULTS ---');
  console.log('Sticky Header Test Passed:', isStickyPassed);
  console.log('1-Row Product Layout Passed:', isRowFitsPassed);

  if (!isStickyPassed || !isRowFitsPassed) {
    process.exit(1);
  }
})();
