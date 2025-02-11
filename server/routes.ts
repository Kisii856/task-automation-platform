import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertWorkflowSchema, type WorkflowStep } from "@shared/schema";

function decomposeTask(task: string): WorkflowStep[] {
  // Simple task decomposition logic
  const steps: WorkflowStep[] = [
    {
      action: "visit",
      url: "https://example.com",
      description: "Navigate to the target website",
    },
    {
      action: "input",
      selector: "#search",
      value: "search term",
      description: "Enter search criteria",
    },
    {
      action: "click",
      selector: "#submit",
      description: "Submit the form",
    },
  ];
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
