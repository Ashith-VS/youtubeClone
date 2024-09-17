import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv'
import router from './routes/index.js';
// import "./mediaServer.js"
import http from 'http';
import { Server } from 'socket.io';

dotenv.config()

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000', // Frontend origin
        methods: ['GET', 'POST'],         // Allowed methods
        credentials: true                 // Allow cookies
    }
});
// CORS Configuration
// const corsOptions = {
//     origin: 'http://localhost:3000',
//     credentials: true, // Allow cookies and other credentials
// };


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
// io.on('connection', (socket) => {
//     console.log('User connected', socket.id);
//     socket.on('disconnect', () => {
//         console.log('User disconnected');
//     });
// });
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    
    socket.on('offer', (offer) => {
        console.log('offer: ', offer);
        socket.broadcast.emit('offer', offer);  // Broadcast to all clients
      });
    
      socket.on('answer', (answer) => {
        console.log('answer: ', answer);
        socket.broadcast.emit('answer', answer);  // Broadcast to all clients
      });
    
      socket.on('ice-candidate', (candidate) => {
        console.log('candidate: ', candidate);
        socket.broadcast.emit('ice-candidate', candidate);  // Broadcast to all clients
      });

    // Handle chat messages or any events here
    socket.on('chat-message', (message) => {
        io.emit('chat-message', message);  // Broadcast message to all clients
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected:', socket.id);
    });
});

// Start the server
server.listen(PORT, () => {
    connect();  // Connect to MongoDB when the server starts
    console.log(`Server is running on port ${PORT}`);
});
