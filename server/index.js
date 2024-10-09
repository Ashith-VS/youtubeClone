import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv'
import router from './routes/index.js';
import http from 'http';
import { Server } from 'socket.io';
import cookieParser from 'cookie-parser';

dotenv.config()
const app = express();
const server = http.createServer(app);
// const io = new Server(server);
// Set up socket.io with CORS
const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000", "https://videosstreamerss.netlify.app"], // Frontend origin
        methods: ["GET", "POST"],
        credentials: true  // Allow credentials (cookies, headers, etc.)
    }
});

// Middleware
app.use(cors({
    credentials: true,  // Ensure credentials like cookies are sent
    origin: ["http://localhost:3000", "https://videosstreamerss.netlify.app"],
}))
app.use(express.json());
app.use(cookieParser())


const PORT = process.env.PORT || 4000
const MONGO_URL = process.env.MONGO_URL;

// Connect to MongoDB
const connect = () => {
    mongoose.connect(MONGO_URL)
        .then(() => console.log('Connected to MongoDB'))
        .catch(error => console.error('Error connecting to MongoDB:', error));
}


app.use('/', router)

// // Socket.IO connection
io.on('connection', (socket) => {
    console.log('User connected', socket.id);

    // User joins a specific room
    socket.on('join-room', (roomId) => {
        console.log(`${socket.id} joined room ${roomId}`);
        socket.join(roomId);
    });


    // WebRTC offer
    socket.on('offer', (offer, roomId) => {
        // socket.to(roomId).emit('offer', offer);  // Send offer to the specific room
        socket.broadcast.emit('offer', offer);
    });

    // WebRTC answer
    socket.on('answer', (answer, roomId) => {
        // socket.to(roomId).emit('answer', answer);  // Send answer to the specific room
        socket.broadcast.emit('answer', answer);
    });

    // ICE candidate
    socket.on('ice-candidate', (candidate, roomId) => {
        // socket.to(roomId).emit('ice-candidate', candidate);  // Send ICE candidate to the specific room
        socket.broadcast.emit('ice-candidate', candidate);
    });

    // Handle chat messages sent to a specific room
    socket.on('chat-message', (data) => {
        const { username, message } = data;
        io.emit('chat-message', `${username}: ${message}`);
        // const { username, message, roomId } = data;
        // console.log('username, message,: roomId: ', username, message, roomId);
        // io.to(roomId).emit('chat-message', `${username}: ${message}`);  // Emit chat to the specific room
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('User disconnected', socket.id);
        socket.leaveAll();  // Ensure the user leaves all joined rooms
    });
});

// Start the server
server.listen(PORT, () => {
    connect();  // Connect to MongoDB when the server starts
    console.log(`Server is running on port ${PORT}`);
});
