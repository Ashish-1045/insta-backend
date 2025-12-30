import Redis from "ioredis";
import config from "../config/config.js";
// console.log(config.REDIS_HOST);

const redis = new Redis({
    host:config.REDIS_HOST,
    password:config.REDIS_PASSWORD,
    port:config.REDIS_PORT,
})

redis.on('connect',()=>{
    console.log('Redis connected')
})

export default redis;