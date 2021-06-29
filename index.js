//reference - https://redislabs.com/blog/getting-started-with-redisearch-2-0/

import express, { urlencoded } from "express"
import ejs from 'ejs';
// -- if using ioredis
// import redis from 'ioredis'
// var redisClient = new redis();
//-- if using node-redis
import redis from 'redis'
// import redisearch from 'redis-redisearch';
// redisearch(redis);
const redisClient = redis.createClient();
try{redisClient.send_command("FT.CREATE",['idx:job_description', "ON", "hash", "PREFIX", "1", "job_description:"] );
}catch(err){console.log(err)}

//middleware
const app = express();
app.set('view engine', 'ejs')
app.use(express.json());
app.use(express.urlencoded({extended: true}))
//routes
app.post('/store', async (req, res)=>{
    const jd = await req.body.jd;
    redisClient.hset(`job_description:${Math.random() * 1000}`, "jd", jd, ()=> console.log("value added"));
    res.redirect('/');
})
app.post("/getsuggestions", (req, res)=>{
    const result = redisClient.send_command(`FT.CREATE idx:job_description ${jd} RETURN 3 jd`);
    // FT.SEARCH idx:job_description "@jd:soft" RETURN 3 jd - for searching a particular field
    // FT.SEARCH idx:job_description "soft*" RETURN 3   jd  - prefix matches
    //  FT.SEARCH idx:job_description "%ware%" RETURN 3 jd  - fuzzy search

    res.send(result);

})



app.listen(3000, ()=>{
    console.log("listening on port 3000")
})