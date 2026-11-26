import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 950 });

  // Open home first to seed localStorage
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle2', timeout: 30000 });
  
  await page.evaluate(() => {
    localStorage.setItem('nsb_theme', 'dark');
    document.documentElement.classList.add('dark');
    
    const sampleItems = [
      {
        _id: 'sample-1',
        title: 'Qahva mashinasi DeLonghi Magnifica S ECAM 22.110.B ofis uchun',
        price: 7300000,
        quantity: 1,
        images: ['https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=600&auto=format&fit=crop&q=80'],
        slug: 'delonghi-magnifica-s',
        category: "Xo'jalik tovarlari"
      },
      {
        _id: 'sample-2',
        title: "Ko'p funksiyali printer HP LaserJet Pro MFP M428fdw",
        price: 6850000,
        quantity: 1,
        images: ['https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=600&auto=format&fit=crop&q=80'],
        slug: 'hp-laserjet-pro-m428fdw',
        category: 'Orgtexnika & Printerlar'
      }
    ];
    localStorage.setItem('nsb_cart', JSON.stringify(sampleItems));
  });

  // Navigate to Cart
  console.log('Navigating to http://localhost:3000/cart in dark mode...');
  await page.goto('http://localhost:3000/cart', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));
  
  // Ensure dark class is present
  await page.evaluate(() => {
    document.documentElement.classList.add('dark');
  });
  await new Promise(r => setTimeout(r, 500));

  await page.screenshot({ 
    path: 'C:/Users/Abdul/.gemini/antigravity/brain/535e5449-532e-4ad8-aadb-e2692339701e/qa_cart_dark_mode_full_images.png',
    fullPage: false 
  });
  console.log('Saved qa_cart_dark_mode_full_images.png');

  // Checkout page
  console.log('Navigating to http://localhost:3000/checkout in dark mode...');
  await page.goto('http://localhost:3000/checkout', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1500));
  await page.evaluate(() => {
    document.documentElement.classList.add('dark');
  });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ 
    path: 'C:/Users/Abdul/.gemini/antigravity/brain/535e5449-532e-4ad8-aadb-e2692339701e/qa_checkout_dark_mode.png',
    fullPage: false
  });
  console.log('Saved qa_checkout_dark_mode.png');

  // Account page
  console.log('Navigating to http://localhost:3000/account in dark mode...');
  await page.goto('http://localhost:3000/account', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 1500));
  await page.evaluate(() => {
    document.documentElement.classList.add('dark');
  });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ 
    path: 'C:/Users/Abdul/.gemini/antigravity/brain/535e5449-532e-4ad8-aadb-e2692339701e/qa_account_dark_mode.png',
    fullPage: false
  });
  console.log('Saved qa_account_dark_mode.png');

  await browser.close();
  console.log('Visual QA complete!');
})();
