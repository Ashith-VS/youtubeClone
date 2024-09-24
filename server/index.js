import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv'
import router from './routes/index.js';
import http from 'http';
import { Server } from 'socket.io';

dotenv.config()
const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Middleware
app.use(cors())
app.use(express.json());

const PORT = process.env.PORT || 4000
const MONGO_URL = process.env.MONGO_URL;

// Connect to MongoDB
const connect = () => {
    mongoose.connect(MONGO_URL)
        .then(() => console.log('Connected to MongoDB'))
        .catch(error => console.error('Error connecting to MongoDB:', error));
}

// app.listen(PORT, () => {
//     connect()
//     console.log(`Server is running on port ${PORT}`);
// });

app.use('/', router)

// Socket.IO connection
io.on('connection', (socket) => {
    console.log('User connected', socket.id);
    
     // Join a specific room
     socket.on('join-room', (roomId) => {
        socket.join(roomId);
        console.log(`${socket.id} joined room ${roomId}`);
    });

    // Handle chat messages
    socket.on('chat-message', (data) => {
        const { username, message } = data;
        io.emit('chat-message', `${username}: ${message}`);
    });

    // Handle WebRTC signaling (offer, answer, ICE candidates)
    socket.on('offer', (offer) => {
        socket.broadcast.emit('offer', offer);
    });

    socket.on('answer', (answer) => {
        socket.broadcast.emit('answer', answer);
    });

    socket.on('ice-candidate', (candidate) => {
        socket.broadcast.emit('ice-candidate', candidate);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected', socket.id);
    });
});


// Start the server
server.listen(PORT, () => {
    connect();  // Connect to MongoDB when the server starts
    console.log(`Server is running on port ${PORT}`);
});
