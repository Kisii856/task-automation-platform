import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertWorkflowSchema, type WorkflowStep } from "@shared/schema";

function decomposeTask(task: string): WorkflowStep[] {
  // Parse task and generate logical steps
  const steps: WorkflowStep[] = [];
  
  // Extract URL if present
  const urlMatch = task.match(/https?:\/\/[^\s]+/);
  if (urlMatch) {
    steps.push({
      action: "visit",
      url: urlMatch[0],
      description: `Navigate to ${urlMatch[0]}`,
    });
  }

  // Common actions based on keywords
  if (task.toLowerCase().includes("search")) {
    steps.push({
      action: "input",
      selector: "input[type='search'], #search, [aria-label*='search']",
      value: task.split("search")[1]?.trim() || "",
      description: "Enter search term",
    });
    
    steps.push({
      action: "click",
      selector: "button[type='submit'], #submit, [aria-label*='search']",
      description: "Submit search",
    });
  }

  // If no steps were generated, return a placeholder step
  if (steps.length === 0) {
    steps.push({
      action: "visit",
      url: "https://example.com",
      description: "Navigate to website",
    });
  }

  return steps;
}

export function registerRoutes(app: Express): Server {
  app.post("/api/workflows", async (req, res) => {
    try {
      const parsed = insertWorkflowSchema.parse(req.body);
      const steps = decomposeTask(parsed.task);
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
