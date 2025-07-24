// server.js
const express = require('express');
const next = require('next');
const http = require('http');
const { Server } = require('socket.io');

const port = parseInt(process.env.PORT || '3000', 10);
const dev = process.env.NODE_ENV !== 'production';

const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
  const app = express();
  const server = http.createServer(app);

  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  // WebSocket logic
 io.on("connection", (socket) => {
  console.log("🔌 User connected:", socket.id);

  socket.on("join-thread", (threadId) => {
    socket.join(threadId);
    console.log(`✅ Joined thread: ${threadId}`);
  });

  socket.on("leave-thread", (threadId) => {
    socket.leave(threadId);
    console.log(`🚪 Left thread: ${threadId}`);
  });

  socket.on("send-message", async (msg) => {
    // Save to DB
    const saved = await Message.create({
      threadId: msg.threadId,
      senderId: msg.senderId,
      text: msg.text,
    });

    await Thread.findByIdAndUpdate(msg.threadId, {
      lastMessage: msg.text,
      updatedAt: new Date(),
    });

    // Broadcast only to users in the same room
    io.to(msg.threadId).emit("new-message", saved);
  });

  socket.on("disconnect", () => {
    console.log("❌ Disconnected");
  });
});

  // Let Next.js handle everything else
  app.use((req, res) => handle(req, res));


  server.listen(port, () => {
    console.log(`✅ Server with Next.js and Socket.IO listening on http://localhost:${port}`);
  });
});
