import { createClient } from "redis";

const redisURL = `redis://:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`;

const client = createClient({
    url: redisURL,
});

client.on("error", (err) => console.log("Redis Client Error", err));

export { client };
