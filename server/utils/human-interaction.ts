import { Page } from 'playwright';

export async function humanLikeScrolling(page: Page) {
  const scrollHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  const viewportHeight = await page.evaluate(() => window.innerHeight);
  let currentScroll = 0;

  while (currentScroll < scrollHeight) {
    const scrollAmount = Math.floor(Math.random() * 200) + 100;
    currentScroll += scrollAmount;
    await page.evaluate((y) => window.scrollTo(0, y), currentScroll);
    await page.waitForTimeout(Math.random() * 500 + 200);
  }
}

export async function humanLikeTyping(page: Page, selector: string, text: string) {
  await page.focus(selector);
  for (const char of text) {
    await page.keyboard.type(char, { delay: Math.random() * 150 + 50 });
    await page.waitForTimeout(Math.random() * 100);
  }
}

export async function humanLikeMouseMove(page: Page, x: number, y: number) {
  const steps = Math.floor(Math.random() * 70) + 30;
  await page.mouse.move(x, y, { steps });
}

export async function humanLikeClick(page: Page, selector: string) {
  const element = await page.locator(selector).boundingBox();
  if (element) {
    const randomX = element.x + element.width * Math.random();
    const randomY = element.y + element.height * Math.random();
    await humanLikeMouseMove(page, randomX, randomY);
    await page.waitForTimeout(Math.random() * 400 + 100);
    await page.click(selector);
  }
}