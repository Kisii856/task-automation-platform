import { pgTable, text, serial, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { pgTable, serial, text, varchar, timestamp, jsonb } from "drizzle-orm/pg-core";

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const workflows = pgTable('workflows', {
  id: serial('id').primaryKey(),
  userId: serial('user_id').references(() => users.id),
  task: text('task').notNull(),
  steps: jsonb('steps').notNull().$type<WorkflowStep[]>(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const workflows = pgTable("workflows", {
  id: serial("id").primaryKey(),
  task: text("task").notNull(),
  steps: jsonb("steps").$type<WorkflowStep[]>().notNull(),
});

export const workflowStepSchema = z.object({
  action: z.string(),
  selector: z.string().optional(),
  url: z.string().optional(),
  value: z.string().optional(),
  description: z.string(),
});

export type WorkflowStep = z.infer<typeof workflowStepSchema>;

export const insertWorkflowSchema = createInsertSchema(workflows).pick({
  task: true,
  steps: true,
});

export type InsertWorkflow = z.infer<typeof insertWorkflowSchema>;
export type Workflow = typeof workflows.$inferSelect;
