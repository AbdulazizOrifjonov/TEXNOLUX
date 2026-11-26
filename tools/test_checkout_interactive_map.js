import puppeteer from 'puppeteer';
import path from 'path';

const ARTIFACT_DIR = 'C:/Users/Abdul/.gemini/antigravity/brain/a1c287bc-7809-4e20-8938-2052ad2ed8e6';

(async () => {
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 950 });

    const port = 3000;
    console.log(`Navigating to http://localhost:${port}/...`);
    await page.goto(`http://localhost:${port}/`, { waitUntil: 'networkidle2', timeout: 30000 });

    // Seed cart in localStorage
    await page.evaluate(() => {
      localStorage.setItem('nsb_theme', 'dark');
      document.documentElement.classList.add('dark');

      const sampleItems = [
        {
          _id: 'sample-mouse-1',
          title: 'Ergonomik simsiz sichqoncha Logitech MX Master 3S Wireless',
          price: 1650000,
          quantity: 1,
          images: ['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&auto=format&fit=crop&q=80'],
          slug: 'logitech-mx-master-3s-wireless',
          category: 'Kompyuterlar & Sichqonchalar'
        }
      ];
      localStorage.setItem('nsb_cart', JSON.stringify(sampleItems));
    });

    // Go to checkout
    console.log(`Navigating to http://localhost:${port}/checkout...`);
    await page.goto(`http://localhost:${port}/checkout`, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 1500));

    // Ensure dark mode
    await page.evaluate(() => {
      document.documentElement.classList.add('dark');
    });

    // 1. Take screenshot of manual address mode
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'nsb_checkout_manual_mode_dark.png'),
      fullPage: false
    });
    console.log('Saved nsb_checkout_manual_mode_dark.png');

    // 2. Click the map switch button
    console.log('Switching to Map mode...');
    const switched = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const mapBtn = buttons.find(b => b.textContent && (b.textContent.includes('Yandex Maps') || b.textContent.includes('Xarita')));
      if (mapBtn) {
        mapBtn.click();
        return true;
      }
      return false;
    });
    console.log('Switch button clicked:', switched);

    // Wait for map and tiles to load
    await new Promise(r => setTimeout(r, 3000));

    // 3. Take screenshot of interactive map mode
    await page.screenshot({
      path: path.join(ARTIFACT_DIR, 'nsb_checkout_yandex_map_interactive.png'),
      fullPage: false
    });
    console.log('Saved nsb_checkout_yandex_map_interactive.png');

  } catch (err) {
    console.error('Test error:', err);
  } finally {
    await browser.close();
  }
})();
