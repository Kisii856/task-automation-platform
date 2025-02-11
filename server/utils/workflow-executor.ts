
import { Browser, chromium } from 'playwright';
import { WorkflowStep } from '../shared/schema';
import { humanLikeTyping, humanLikeClick, humanLikeScrolling, humanLikeMouseMove } from './human-interaction';

export class WorkflowExecutor {
  private browser: Browser | null = null;
  private variables: Record<string, any> = {};

  async init() {
    this.browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox']
    });
  }

  setVariable(name: string, value: any) {
    this.variables[name] = value;
  }

  getVariable(name: string) {
    return this.variables[name];
  }

  async execute(steps: WorkflowStep[]) {
    if (!this.browser) {
      await this.init();
    }
    
    const page = await this.browser!.newPage();
    const results = [];

    try {
      for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        
        // Handle conditions
        if (step.condition) {
          const conditionMet = await this.evaluateCondition(page, step.condition);
          if (!conditionMet) continue;
        }

        switch (step.action) {
          case 'visit':
            await page.goto(step.url!, { waitUntil: 'networkidle' });
            results.push(`Visited ${step.url}`);
            break;

          case 'click':
            await humanLikeClick(page, step.selector!);
            await page.waitForLoadState('networkidle');
            results.push(`Clicked ${step.selector}`);
            break;

          case 'input':
            await humanLikeTyping(page, step.selector!, step.value!);
            results.push(`Typed "${step.value}" into ${step.selector}`);
            break;

          case 'scroll':
            await humanLikeScrolling(page);
            results.push('Scrolled page');
            break;

          case 'wait':
            await page.waitForTimeout(parseInt(step.value!) || 1000);
            results.push(`Waited ${step.value}ms`);
            break;

          case 'extract':
            const value = await page.$eval(step.selector!, (el) => el.textContent);
            this.setVariable(step.value!, value);
            results.push(`Extracted ${value} into ${step.value}`);
            break;
        }

        // Random delay between actions
        await page.waitForTimeout(Math.random() * 1000 + 500);
      }
    } catch (error) {
      console.error('Workflow execution failed:', error);
      throw new Error(`Workflow execution failed: ${error.message}`);
    } finally {
      await page.close();
    }

    return results;
  }

  private async evaluateCondition(page: any, condition: string): Promise<boolean> {
    try {
      if (condition.includes('exists')) {
        const selector = condition.split('exists')[1].trim();
        return await page.$(selector) !== null;
      }
      return await page.evaluate((cond) => eval(cond), condition);
    } catch (error) {
      console.error('Condition evaluation failed:', error);
      return false;
    }
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }
}
