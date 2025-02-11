
import { chromium } from 'playwright';
import { WorkflowExecutor } from '../utils/workflow-executor';
import { humanLikeTyping, humanLikeClick, humanLikeScrolling } from '../utils/human-interaction';

async function runTests() {
  console.log('Starting automation tests...');
  const executor = new WorkflowExecutor();
  
  try {
    // Test workflow execution
    const steps = [
      {
        action: 'visit',
        url: 'https://www.google.com',
        description: 'Navigate to Google'
      },
      {
        action: 'input',
        selector: 'input[name="q"]',
        value: 'automation testing',
        description: 'Enter search terms'
      },
      {
        action: 'click',
        selector: 'input[type="submit"]',
        description: 'Submit search'
      },
      {
        action: 'scroll',
        description: 'Scroll through results'
      }
    ];

    console.log('Executing test workflow...');
    const results = await executor.execute(steps);
    console.log('Workflow results:', results);

    console.log('All tests passed successfully!');
  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  } finally {
    await executor.cleanup();
  }
}

if (require.main === module) {
  runTests().catch(console.error);
}
