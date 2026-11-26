const puppeteer = require('puppeteer');

(async () => {
  console.log('Launching browser to test frontend with Supabase integration...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('BROWSER LOG ERROR:', msg.text());
    }
  });

  // 1. Test Home Page
  console.log('Testing Home Page: http://localhost:3000');
  await page.goto('http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await new Promise(r => setTimeout(r, 2000));

  const homeTitle = await page.title();
  console.log('Page Title:', homeTitle);

  // Check product cards rendered
  const productCount = await page.$$eval('[data-product-card], a[href*="/product/"]', els => els.length);
  console.log('Rendered product links count on Home:', productCount);

  // Take screenshot of Home
  await page.screenshot({ path: 'C:/Users/Abdul/.gemini/antigravity/brain/a1c287bc-7809-4e20-8938-2052ad2ed8e6/supabase_home_test.png' });
  console.log('Saved screenshot: supabase_home_test.png');

  // 2. Test Admin Dashboard
  console.log('Testing Admin Dashboard: http://localhost:3000/admin');
  await page.goto('http://localhost:3000/admin', { waitUntil: 'domcontentloaded', timeout: 15000 });
  await new Promise(r => setTimeout(r, 2000));

  const adminStatsText = await page.evaluate(() => {
    return document.body.innerText.includes('Boshqaruv Paneli') ? 'Admin Loaded OK' : 'Admin Header not found';
  });
  console.log('Admin Status:', adminStatsText);

  await page.screenshot({ path: 'C:/Users/Abdul/.gemini/antigravity/brain/a1c287bc-7809-4e20-8938-2052ad2ed8e6/supabase_admin_test.png' });
  console.log('Saved screenshot: supabase_admin_test.png');

  await browser.close();
  console.log('Test completed successfully!');
})().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
