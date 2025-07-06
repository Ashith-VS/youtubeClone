import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv'
import router from './routes/index.js';
import cookieParser from 'cookie-parser';

dotenv.config()
const app = express();

// Middleware
// app.use(cors({
//     credentials: true,  // Ensure credentials like cookies are sent
//     origin: "http://localhost:3000",
// }))
app.use(cors())
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

app.listen(PORT, () => {
    connect();  // Connect to MongoDB when the server starts
    console.log(`Server is running on port ${PORT}`);
});
