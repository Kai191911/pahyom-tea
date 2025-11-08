import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  await redis.set("cupCounter", 0);
  return res.json({ reset: true, at: new Date().toISOString() });
}
