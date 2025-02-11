
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { WorkflowExecutor } from '../utils/workflow-executor';
import { WorkflowStep } from '../shared/schema';

describe('WorkflowExecutor', () => {
  let executor: WorkflowExecutor;

  beforeEach(() => {
    executor = new WorkflowExecutor();
  });

  afterEach(async () => {
    await executor.cleanup();
  });

  it('should execute a simple workflow', async () => {
    const steps: WorkflowStep[] = [
      {
        action: 'visit',
        url: 'https://example.com',
        description: 'Visit example.com'
      }
    ];

    const results = await executor.execute(steps);
    expect(results).toHaveLength(1);
    expect(results[0]).toContain('Visited');
  });

  it('should handle errors gracefully', async () => {
    const steps: WorkflowStep[] = [
      {
        action: 'click',
        selector: '#non-existent',
        description: 'Click non-existent element'
      }
    ];

    await expect(executor.execute(steps)).rejects.toThrow();
  });
});
