
import { Server } from 'socket.io';
import http from 'http';
import { server } from './index';

const io = new Server(server, {
  cors: { origin: "*" }
});

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("startWorkflow", (workflowId) => {
    io.emit(`workflow:${workflowId}:status`, { status: "running" });
  });

  socket.on("workflowStep", ({ workflowId, step, status }) => {
    io.emit(`workflow:${workflowId}:step`, { step, status });
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

export { io };
