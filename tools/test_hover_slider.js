const puppeteer = require('d:/allProject/tools/node_modules/puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    defaultViewport: { width: 1440, height: 900 }
  });

  const page = await browser.newPage();
  await page.goto('http://127.0.0.1:3000', { waitUntil: 'networkidle0' });

  // Find a product card with multiple images (e.g. Masaj kreslo AM183 or any card with "📷")
  console.log('Searching for card with multiple images...');
  
  // Let's scroll down to products section
  await page.evaluate(() => window.scrollBy(0, 800));
  await new Promise(r => setTimeout(r, 1000));

  const multiImageCard = await page.evaluateHandle(() => {
    const cards = Array.from(document.querySelectorAll('article'));
    for (const card of cards) {
      if (card.textContent.includes('ta rasm') || card.textContent.includes('Masaj kreslo')) {
        return card;
      }
    }
    return cards[0];
  });

  if (!multiImageCard) {
    console.error('No card found');
    await browser.close();
    return;
  }

  // Scroll into view
  await page.evaluate((el) => {
    el.scrollIntoView({ behavior: 'instant', block: 'center' });
  }, multiImageCard);
  await new Promise(r => setTimeout(r, 500));

  // Screenshot initial state
  const initialText = await page.evaluate((el) => el.innerText, multiImageCard);
  const initialImgSrc = await page.evaluate((el) => el.querySelector('img')?.src, multiImageCard);
  console.log('Initial Img Src:', initialImgSrc);
  console.log('Initial badge text:', initialText.split('\n').filter(t => t.includes('rasm')));

  await page.screenshot({
    path: 'C:/Users/Abdul/.gemini/antigravity/brain/a1c287bc-7809-4e20-8938-2052ad2ed8e6/product_hover_0s.png'
  });

  // Now hover over the card!
  console.log('Hovering over card...');
  const boundingBox = await multiImageCard.boundingBox();
  await page.mouse.move(boundingBox.x + boundingBox.width / 2, boundingBox.y + boundingBox.height / 2);

  // Wait 200ms right after hover
  await new Promise(r => setTimeout(r, 200));
  const hover1ImgSrc = await page.evaluate((el) => el.querySelector('img')?.src, multiImageCard);
  const hover1Text = await page.evaluate((el) => el.innerText, multiImageCard);
  console.log('Hover 0.2s Img Src:', hover1ImgSrc);
  console.log('Hover 0.2s badge:', hover1Text.split('\n').filter(t => t.includes('1 /')));
  await page.screenshot({
    path: 'C:/Users/Abdul/.gemini/antigravity/brain/a1c287bc-7809-4e20-8938-2052ad2ed8e6/product_hover_step1.png'
  });

  // Wait 1.1s (cycle 1 -> 2)
  await new Promise(r => setTimeout(r, 1100));
  const hover2ImgSrc = await page.evaluate((el) => el.querySelector('img')?.src, multiImageCard);
  const hover2Text = await page.evaluate((el) => el.innerText, multiImageCard);
  console.log('Hover 1.3s Img Src:', hover2ImgSrc);
  console.log('Hover 1.3s badge:', hover2Text.split('\n').filter(t => t.includes('2 /')));
  await page.screenshot({
    path: 'C:/Users/Abdul/.gemini/antigravity/brain/a1c287bc-7809-4e20-8938-2052ad2ed8e6/product_hover_step2.png'
  });

  // Wait another 1.1s (cycle 2 -> 3)
  await new Promise(r => setTimeout(r, 1100));
  const hover3ImgSrc = await page.evaluate((el) => el.querySelector('img')?.src, multiImageCard);
  const hover3Text = await page.evaluate((el) => el.innerText, multiImageCard);
  console.log('Hover 2.4s Img Src:', hover3ImgSrc);
  console.log('Hover 2.4s badge:', hover3Text.split('\n').filter(t => t.includes('3 /')));
  await page.screenshot({
    path: 'C:/Users/Abdul/.gemini/antigravity/brain/a1c287bc-7809-4e20-8938-2052ad2ed8e6/product_hover_step3.png'
  });

  // Move mouse away (unhover)
  await page.mouse.move(0, 0);
  await new Promise(r => setTimeout(r, 300));
  const unhoverImgSrc = await page.evaluate((el) => el.querySelector('img')?.src, multiImageCard);
  console.log('Unhover Img Src (should reset to initial):', unhoverImgSrc);
  await page.screenshot({
    path: 'C:/Users/Abdul/.gemini/antigravity/brain/a1c287bc-7809-4e20-8938-2052ad2ed8e6/product_unhover.png'
  });

  await browser.close();
  console.log('Test completed successfully!');
})();
