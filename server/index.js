import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import router from './routes/index.js';
import cookieParser from 'cookie-parser';

const app = express();
dotenv.config()
app.use(express.json());
app.use(cookieParser())

const PORT = process.env.PORT ||4000
const MONGO_URL = process.env.MONGO_URL;

// Connect to MongoDB
const connect = ()=>{
mongoose.connect(MONGO_URL)
 .then(()=> console.log('Connected to MongoDB'))
 .catch(error=> console.error('Error connecting to MongoDB:', error));
}

app.listen(PORT, () => {
    connect()
    console.log(`Server is running on port ${PORT}`);
});

app.use('/',router)




