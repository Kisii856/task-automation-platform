
import { Browser, chromium } from 'playwright';
import { WorkflowStep } from '../shared/schema';
import { humanLikeTyping, humanLikeClick } from './human-interaction';

export class WorkflowExecutor {
  private browser: Browser | null = null;

  async init() {
    this.browser = await chromium.launch();
  }

  async execute(steps: WorkflowStep[]) {
    if (!this.browser) {
      await this.init();
    }
    
    const page = await this.browser!.newPage();
    const results = [];

    try {
      for (const step of steps) {
        switch (step.action) {
          case 'visit':
            await page.goto(step.url!);
            results.push(`Visited ${step.url}`);
            break;
          case 'click':
            await humanLikeClick(page, step.selector!);
            results.push(`Clicked ${step.selector}`);
            break;
          case 'input':
            await humanLikeTyping(page, step.selector!, step.value!);
            results.push(`Typed "${step.value}" into ${step.selector}`);
            break;
        }
      }
    } catch (error) {
      throw new Error(`Workflow execution failed: ${error.message}`);
    } finally {
      await page.close();
    }

    return results;
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}
