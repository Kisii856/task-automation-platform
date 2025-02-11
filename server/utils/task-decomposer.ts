import { Configuration, OpenAIApi } from 'openai';
import { config } from '../config';

const configuration = new Configuration({
  apiKey: config.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export interface WorkflowStep {
  action: string;
  selector?: string;
  url?: string;
  value?: string;
  description: string;
}

export async function decomposeTask(taskDescription: string): Promise<WorkflowStep[]> {
  try {
    const prompt = `
      Convert this browser automation task into specific steps:
      Task: "${taskDescription}"
      Return a JSON array of steps with these fields:
      - action: 'navigate'|'click'|'type'|'scroll'|'wait'
      - selector?: string (CSS selector)
      - url?: string
      - value?: string
      - description: string (human readable)
    `;

    const response = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [{ role: "system", content: prompt }],
      temperature: 0.2,
    });

    const content = response.data.choices[0]?.message?.content;
    if (!content) throw new Error('No response from OpenAI');

    const { steps } = JSON.parse(content);
    return steps;
  } catch (error) {
    console.error('Task decomposition failed:', error);
    throw new Error('Failed to decompose task into steps');
  }
}