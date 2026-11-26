const puppeteer = require('d:/allProject/tools/node_modules/puppeteer-core');

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: 'new',
    defaultViewport: { width: 1440, height: 900 }
  });

  const page = await browser.newPage();
  await page.goto('http://127.0.0.1:3000/shop', { waitUntil: 'networkidle0' });

  // Find "Masaj kreslo AM183"
  console.log('Searching for Masaj kreslo AM183...');
  
  const massageChairCard = await page.evaluateHandle(() => {
    const cards = Array.from(document.querySelectorAll('article'));
    return cards.find(c => c.textContent.includes('Masaj kreslo') || c.textContent.includes('AM183'));
  });

  if (!massageChairCard) {
    console.error('Masaj kreslo AM183 card not found on /shop');
    await browser.close();
    return;
  }

  // Scroll to card
  await page.evaluate((el) => {
    el.scrollIntoView({ behavior: 'instant', block: 'center' });
  }, massageChairCard);
  await new Promise(r => setTimeout(r, 600));

  // Take screenshot before hover
  await page.screenshot({
    path: 'C:/Users/Abdul/.gemini/antigravity/brain/a1c287bc-7809-4e20-8938-2052ad2ed8e6/masaj_kreslo_before_hover.png'
  });

  // Hover over card
  console.log('Hovering over Masaj kreslo AM183...');
  const box = await massageChairCard.boundingBox();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 3);

  await new Promise(r => setTimeout(r, 300));
  console.log('Image 1:', await page.evaluate(el => el.querySelector('img')?.src, massageChairCard));
  await page.screenshot({
    path: 'C:/Users/Abdul/.gemini/antigravity/brain/a1c287bc-7809-4e20-8938-2052ad2ed8e6/masaj_kreslo_hover_img1.png'
  });

  // 1 second later -> image 2
  await new Promise(r => setTimeout(r, 1050));
  console.log('Image 2:', await page.evaluate(el => el.querySelector('img')?.src, massageChairCard));
  await page.screenshot({
    path: 'C:/Users/Abdul/.gemini/antigravity/brain/a1c287bc-7809-4e20-8938-2052ad2ed8e6/masaj_kreslo_hover_img2.png'
  });

  // 1 second later -> image 3
  await new Promise(r => setTimeout(r, 1050));
  console.log('Image 3:', await page.evaluate(el => el.querySelector('img')?.src, massageChairCard));
  await page.screenshot({
    path: 'C:/Users/Abdul/.gemini/antigravity/brain/a1c287bc-7809-4e20-8938-2052ad2ed8e6/masaj_kreslo_hover_img3.png'
  });

  // 1 second later -> image 4
  await new Promise(r => setTimeout(r, 1050));
  console.log('Image 4:', await page.evaluate(el => el.querySelector('img')?.src, massageChairCard));
  await page.screenshot({
    path: 'C:/Users/Abdul/.gemini/antigravity/brain/a1c287bc-7809-4e20-8938-2052ad2ed8e6/masaj_kreslo_hover_img4.png'
  });

  // Unhover
  await page.mouse.move(0, 0);
  await new Promise(r => setTimeout(r, 400));
  console.log('Reset back to Image 1:', await page.evaluate(el => el.querySelector('img')?.src, massageChairCard));
  await page.screenshot({
    path: 'C:/Users/Abdul/.gemini/antigravity/brain/a1c287bc-7809-4e20-8938-2052ad2ed8e6/masaj_kreslo_after_unhover.png'
  });

  await browser.close();
  console.log('Masaj kreslo AM183 test completed!');
})();
