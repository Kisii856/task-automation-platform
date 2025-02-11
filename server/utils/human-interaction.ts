
import { Page } from 'playwright';

export async function humanLikeTyping(page: Page, selector: string, text: string) {
  for (const char of text) {
    await page.fill(selector, char);
    await new Promise(r => setTimeout(r, Math.random() * 150 + 50));
  }
}

export async function humanLikeMouseMove(page: Page, x: number, y: number) {
  const steps = Math.floor(Math.random() * 70) + 30;
  await page.mouse.move(x, y, { steps });
}

export async function humanLikeClick(page: Page, selector: string) {
  const element = await page.locator(selector).boundingBox();
  if (element) {
    await humanLikeMouseMove(page, element.x + 5, element.y + 5);
    await new Promise(r => setTimeout(r, Math.random() * 400 + 100));
    await page.click(selector);
  }
}
