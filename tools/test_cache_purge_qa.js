const puppeteer = require('puppeteer');
const path = require('path');

const ARTIFACT_DIR = 'C:/Users/Abdul/.gemini/antigravity/brain/535e5449-532e-4ad8-aadb-e2692339701e';

async function runTest() {
  console.log('🚀 Starting Cache Purge & Tatami Verification QA...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    // 1. First visit to set the old infected cache
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });

    // Inject dirty old cache simulating the user's browser
    await page.evaluate(() => {
      const dirtyProducts = [
        {
          _id: 'prod_yangi-mahsulot-1141',
          id: 'prod_yangi-mahsulot-1141',
          title: 'Yangi Mahsulot',
          slug: 'yangi-mahsulot-1141',
          price: 1000000,
          category: 'Podstavka & Skameykalar',
          images: ['/uploads/prod_yangi-mahsulot-1141.jpg']
        },
        {
          _id: 'prod_yangi-mahsulot-4815',
          id: 'prod_yangi-mahsulot-4815',
          title: 'Yangi Mahsulot',
          slug: 'yangi-mahsulot-4815',
          price: 1000000,
          category: 'Podstavka & Skameykalar',
          images: ['/uploads/prod_yangi-mahsulot-4815.jpg']
        },
        {
          _id: 'prod_yangi-mahsulot-5248',
          id: 'prod_yangi-mahsulot-5248',
          title: 'Yangi Mahsulot',
          slug: 'yangi-mahsulot-5248',
          price: 1000000,
          category: 'Podstavka & Skameykalar',
          images: ['/uploads/prod_yangi-mahsulot-5248.jpg']
        },
        {
          _id: 'prod_yangi-mahsulot-6210',
          id: 'prod_yangi-mahsulot-6210',
          title: 'Yangi Mahsulot',
          slug: 'yangi-mahsulot-6210',
          price: 1000000,
          category: 'Podstavka & Skameykalar',
          images: ['/uploads/prod_yangi-mahsulot-6210.jpg']
        }
      ];
      localStorage.setItem('nsb_products_v3_sport', JSON.stringify(dirtyProducts));
    });

    console.log('Injected simulated old dirty cache. Now reloading page...');
    await page.reload({ waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 2000));

    // 2. Check if any "Yangi Mahsulot" exists in the DOM
    const yangiMahsulotCards = await page.$$eval('*', els => 
      els.filter(e => e.textContent && e.textContent.includes('Yangi Mahsulot')).map(e => e.tagName)
    );
    console.log('DOM check for "Yangi Mahsulot" text occurrences:', yangiMahsulotCards.length);

    // 3. Check products displayed
    const productTitles = await page.$$eval('h3, h4', headings => 
      headings.map(h => h.textContent.trim()).filter(t => t.length > 2 && t.length < 80)
    );
    console.log('Product Titles found on page:', productTitles);

    // 4. Check if Tatami is present
    const tatamiCard = await page.$eval('body', el => el.textContent.includes('Professional Tatami 1x1m'));
    console.log('Is Professional Tatami 1x1m present?:', tatamiCard);

    // 5. Scroll down to catalog and take screenshot
    await page.evaluate(() => window.scrollBy(0, 800));
    await new Promise(r => setTimeout(r, 1000));

    const screenshotPath = path.join(ARTIFACT_DIR, 'qa_purged_clean_catalog.png');
    await page.screenshot({ path: screenshotPath });
    console.log(`Saved screenshot to ${screenshotPath}`);

    console.log('✅ QA Test completed successfully!');
  } catch (err) {
    console.error('QA Error:', err);
  } finally {
    await browser.close();
  }
}

runTest();
