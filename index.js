require('dotenv').config();
const PORT = process.env.PORT;
const app = require('./app');
const mongoose = require('./src/config/db');
const http = require('http');
const { Server } = require('socket.io');
const initializeCronJobs = require('./src/tasks/cronJobs');

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ['GET', 'POST'],
    credentials: true, 
  },
});

io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);
  socket.on('disconnect', () => {
    console.log('Cliente desconectado:', socket.id);
  });
});


initializeCronJobs(io);


server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server raised on port: ${PORT}`);
});
