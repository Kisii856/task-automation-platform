
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertWorkflowSchema, type WorkflowStep, users } from "@shared/schema";
import { z } from "zod";
import { hashPassword, comparePasswords, generateToken } from "./auth";
import { eq } from "drizzle-orm";
import { db } from "./db";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

app.post("/api/register", async (req, res) => {
  try {
    const { email, password } = registerSchema.parse(req.body);
    const hashedPassword = await hashPassword(password);
    const [user] = await db.insert(users).values({ email, password: hashedPassword }).returning();
    const token = generateToken(user.id);
    res.json({ token });
  } catch (error) {
    res.status(400).json({ error: "Registration failed" });
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const user = await db.query.users.findFirst({ where: eq(users.email, email) });
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const valid = await comparePasswords(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = generateToken(user.id);
    res.json({ token });
  } catch (error) {
    res.status(400).json({ error: "Login failed" });
  }
});

function extractUrl(text: string): string | null {
  const urlMatch = text.match(/https?:\/\/[^\s]+/);
  return urlMatch ? urlMatch[0] : null;
}

async function decomposeTask(task: string): Promise<WorkflowStep[]> {
  const steps: WorkflowStep[] = [];
  const lowercaseTask = task.toLowerCase();

  // Handle navigation tasks
  const url = extractUrl(task);
  if (url) {
    steps.push({
      action: "visit",
      url,
      description: `Navigate to ${url}`,
    });
  }

  // Handle search tasks
  if (lowercaseTask.includes("search")) {
    const searchTerms = task.replace(/search\s+for\s+|search\s+/i, "").trim();
    if (!url) {
      steps.push({
        action: "visit",
        url: "https://www.google.com",
        description: "Navigate to Google",
      });
    }
    
    steps.push({
      action: "input",
      selector: 'input[name="q"]',
      value: searchTerms,
      description: `Enter search terms: "${searchTerms}"`,
    });
    
    steps.push({
      action: "click",
      selector: 'input[type="submit"], button[type="submit"]',
      description: "Submit search",
    });
  }

  // Handle click tasks
  if (lowercaseTask.includes("click")) {
    const buttonText = task.match(/click\s+(?:on\s+)?["']?([^"']+)["']?/i)?.[1];
    if (buttonText) {
      steps.push({
        action: "click",
        selector: `button:contains("${buttonText}"), a:contains("${buttonText}")`,
        description: `Click on "${buttonText}"`,
      });
    }
  }

  // Handle form input tasks
  if (lowercaseTask.includes("type") || lowercaseTask.includes("enter")) {
    const inputMatch = task.match(/(?:type|enter)\s+["']?([^"']+)["']?\s+(?:in|into)\s+["']?([^"']+)["']?/i);
    if (inputMatch) {
      steps.push({
        action: "input",
        selector: `input[placeholder*="${inputMatch[2]}"], input[name*="${inputMatch[2]}"], textarea[placeholder*="${inputMatch[2]}"]`,
        value: inputMatch[1],
        description: `Enter "${inputMatch[1]}" into ${inputMatch[2]} field`,
      });
    }
  }

  // Default step if no specific actions were identified
  if (steps.length === 0) {
    if (!url) {
      steps.push({
        action: "visit",
        url: "https://www.google.com",
        description: "Navigate to Google",
      });
    }
  }

  return steps;
}

export function registerRoutes(app: Express): Server {
  app.post('/api/auth/register', async (req, res) => {
    try {
      const { email, password } = req.body;
      const hashedPassword = await hashPassword(password);
      const user = await db.insert(users).values({ email, password: hashedPassword }).returning();
      const token = generateToken(user[0].id);
      res.json({ token });
    } catch (error) {
      res.status(400).json({ message: 'Registration failed' });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await db.select().from(users).where(eq(users.email, email));
      if (!user[0] || !await comparePasswords(password, user[0].password)) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
      const token = generateToken(user[0].id);
      res.json({ token });
    } catch (error) {
      res.status(400).json({ message: 'Login failed' });
    }
  });
  app.post("/api/workflows", authenticate, async (req, res) => {
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

  app.get("/api/workflows", authenticate, async (_req, res) => {
    const workflows = await storage.getWorkflows();
    res.json(workflows);
  });

  const httpServer = createServer(app);
  return httpServer;
}
