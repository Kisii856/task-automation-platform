
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
}

export async function decomposeTask(taskDescription: string): Promise<WorkflowStep[]> {
  const prompt = `
    Convert this task into valid browser automation steps:
    Task: "${taskDescription}"
    Respond in JSON format with steps array.
  `;

  const response = await openai.createChatCompletion({
    model: "gpt-4",
    messages: [{ role: "system", content: prompt }],
  });

  const content = response.data.choices[0]?.message?.content;
  if (!content) throw new Error('No response from OpenAI');

  const { steps } = JSON.parse(content);
  return steps;
}
