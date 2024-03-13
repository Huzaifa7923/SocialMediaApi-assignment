import redis from 'redis'

// const REDIS_PORT=process.env.REDIS_PORT;

const REDIS_URL=process.env.NODE_ENV==='production'?process.env.REDIS_EXTERNAL_URL:process.env.REDIS_INTERNAL_URL

const redisClient=redis.createClient(REDIS_URL);

redisClient.on("connect",(err)=>{
    if(err){
        console.log(err);
    }
    console.log("REDIS CONNECTED");
})

export default redisClient