
import { Server } from 'socket.io';
import { server } from './index';
import { WorkflowStep } from '../shared/schema';

const io = new Server(server, {
  cors: { origin: "*" }
});

type WorkflowStatus = 'pending' | 'running' | 'completed' | 'failed';

interface WorkflowUpdate {
  workflowId: number;
  status: WorkflowStatus;
  step?: WorkflowStep;
  error?: string;
}

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("startWorkflow", (workflowId: number) => {
    io.emit(`workflow:${workflowId}:status`, { status: "running" });
  });

  socket.on("workflowUpdate", (update: WorkflowUpdate) => {
    io.emit(`workflow:${update.workflowId}:update`, update);
  });

  socket.on("workflowError", ({ workflowId, error }) => {
    io.emit(`workflow:${workflowId}:error`, { error });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

export { io };
