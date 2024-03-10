import express from 'express'
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import rateLimit from 'express-rate-limit';

import redisClient from './config/redisClient.js'

import userRoutes from './routes/userRoutes.js'
import postRoutes from './routes/postRoutes.js'

const app=express();
dotenv.config()
redisClient.connect();

const PORT=process.env.PORT||4000

//limiting request : Max 2 request per second
const requestThrottler=rateLimit({
    windowMs:1000,
    max:2,
    handler: function(req, res, next) {
        // Send custom message to delaying request
        res.json({ message: "Too many requests, please try again later." });
    }
})

app.use(express.json());
app.use(express.urlencoded({extended:true}));

try{
mongoose.connect(process.env.MONGODB_URI);
console.log('connected')
}catch(err){
    console.log('db error '+err);
}
app.get('/',(req,res)=>{
    console.log('api is running')
})

app.use('/api/users',requestThrottler,userRoutes);
app.use('/api/posts',requestThrottler,postRoutes);

app.listen(PORT,()=>{
    console.log(`listening on ${PORT}!!`);
})