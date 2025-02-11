
import { chromium } from 'playwright';
import { humanLikeTyping, humanLikeClick, humanLikeScrolling } from '../utils/human-interaction';
import { decomposeTask } from '../utils/task-decomposer';

async function runTests() {
  console.log('Starting automation tests...');
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  try {
    // Test task decomposition
    console.log('Testing task decomposition...');
    const steps = await decomposeTask("Search Google for 'automation testing'");
    console.log('Decomposed steps:', steps);

    // Test human-like interactions
    console.log('Testing human-like interactions...');
    await page.goto('https://www.google.com');
    await humanLikeTyping(page, 'input[name="q"]', 'automation testing');
    await humanLikeClick(page, 'input[type="submit"]');
    await humanLikeScrolling(page);

    console.log('All tests passed successfully!');
  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

if (require.main === module) {
  runTests().catch(console.error);
}
