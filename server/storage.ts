import { type Workflow, type InsertWorkflow } from "@shared/schema";

export interface IStorage {
  createWorkflow(workflow: InsertWorkflow): Promise<Workflow>;
  getWorkflows(): Promise<Workflow[]>;
}

export class MemStorage implements IStorage {
  private workflows: Map<number, Workflow>;
  private currentId: number;

  constructor() {
    this.workflows = new Map();
    this.currentId = 1;
  }

  async createWorkflow(insertWorkflow: InsertWorkflow): Promise<Workflow> {
    const id = this.currentId++;
    const workflow: Workflow = { ...insertWorkflow, id };
    this.workflows.set(id, workflow);
    return workflow;
  }

  async getWorkflows(): Promise<Workflow[]> {
    return Array.from(this.workflows.values());
  }
}

export const storage = new MemStorage();