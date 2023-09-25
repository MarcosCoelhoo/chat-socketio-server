require('dotenv').config();
const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.URLCONNECT,
  },
});

io.on('connection', (socket) => {
  console.log(`${socket.id} is connected`);

  socket.on('disconnect', () => {
    console.log(`${socket.id} disconnected`);
  });

  socket.on('setUsername', (username) => {
    socket.data.username = username;
    console.log(`O usuário ${username} foi setado`);
  });

  socket.on('message', (text) => {
    const time = new Date();

    io.emit('receiveMessage', {
      text,
      authorId: socket.id,
      author: socket.data.username,
      time: `${time.getHours()}:${time.getMinutes()}`,
    });

    console.log(`${socket.data.username} enviou uma mensagem!`);
  });
});

server.listen(process.env.PORT, () =>
  console.log(`Server is reading at port ${process.env.PORT}`),
);
