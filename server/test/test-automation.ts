
import { chromium } from 'playwright';
import { humanLikeTyping, humanLikeClick } from '../utils/human-interaction';
import { decomposeTask } from '../utils/task-decomposer';

async function testAutomation() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    const steps = await decomposeTask("Search Google for weather");
    for (const step of steps) {
      switch (step.action) {
        case 'navigate':
          await page.goto(step.url!);
          break;
        case 'fill':
          await humanLikeTyping(page, step.selector!, step.value!);
          break;
        case 'click':
          await humanLikeClick(page, step.selector!);
          break;
      }
    }
  } finally {
    await browser.close();
  }
}

testAutomation().catch(console.error);
