
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertWorkflowSchema, type WorkflowStep } from "@shared/schema";
import { OpenAI } from "openai";
import { z } from "zod";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const systemPrompt = `You are a browser automation expert. Generate specific steps for browser automation tasks.
Each step must have these fields: action (navigate/click/type/scrape), description, and appropriate fields like url, selector, or value.
Example output: [{"action":"navigate","url":"https://example.com","description":"Navigate to website"},{"action":"click","selector":"#search","description":"Click search box"}]`;

function parseAIResponse(content: string): WorkflowStep[] {
  try {
    const steps = JSON.parse(content);
    if (!Array.isArray(steps)) throw new Error("Expected array of steps");
    return steps;
  } catch (error) {
    console.error("Failed to parse AI response:", error);
    return [];
  }
}

async function decomposeTask(task: string): Promise<WorkflowStep[]> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: task }
      ],
    });

    const content = response.choices[0]?.message?.content;
    if (!content) return [];
    
    return parseAIResponse(content);
  } catch (error) {
    console.error("OpenAI API error:", error);
    return [];
  }
}

export function registerRoutes(app: Express): Server {
  app.post("/api/workflows", async (req, res) => {
    try {
      const parsed = insertWorkflowSchema.parse(req.body);
      const steps = await decomposeTask(parsed.task);
      
      if (steps.length === 0) {
        res.status(400).json({ message: "Failed to generate workflow steps" });
        return;
      }

      const workflow = await storage.createWorkflow({
        task: parsed.task,
        steps,
      });
      res.json(workflow);
    } catch (error) {
      res.status(400).json({ message: "Invalid workflow data" });
    }
  });

  app.get("/api/workflows", async (_req, res) => {
    const workflows = await storage.getWorkflows();
    res.json(workflows);
  });

  const httpServer = createServer(app);
  return httpServer;
}
