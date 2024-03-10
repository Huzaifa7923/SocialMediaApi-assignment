import redis from 'redis'

const REDIS_PORT=process.env.REDIS_PORT;
const redisClient=redis.createClient(REDIS_PORT);

redisClient.on("connect",(err)=>{
    if(err){
        console.log(err);
    }
    console.log("REDIS CONNECTED");
})

export default redisClient