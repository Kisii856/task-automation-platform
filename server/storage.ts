import { workflows, type Workflow, type InsertWorkflow } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  createWorkflow(workflow: InsertWorkflow): Promise<Workflow>;
  getWorkflows(): Promise<Workflow[]>;
}

export class DatabaseStorage implements IStorage {
  async createWorkflow(insertWorkflow: InsertWorkflow): Promise<Workflow> {
    const [workflow] = await db
      .insert(workflows)
      .values({
        task: insertWorkflow.task,
        steps: insertWorkflow.steps
      })
      .returning();
    return workflow;
  }

  async getWorkflows(): Promise<Workflow[]> {
    return db.select().from(workflows);
  }
}

export const storage = new DatabaseStorage();