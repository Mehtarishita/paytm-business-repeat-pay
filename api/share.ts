import { Redis } from '@upstash/redis';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const redisUrl = process.env.UPSTASH_REDIS_REST_URL || "";
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN || "";

const redis = redisUrl && redisToken ? new Redis({
  url: redisUrl,
  token: redisToken,
}) : null;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data = req.body;
    
    // Generate a random token
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    
    const shareData = {
      ...data,
      shareToken: token,
      sharedAt: Date.now()
    };

    if (redis) {
      // Store in Redis with an expiration (e.g. 30 days)
      await redis.set(`share:${token}`, JSON.stringify(shareData), { ex: 30 * 24 * 60 * 60 });
    } else {
      console.warn("UPSTASH_REDIS_REST_URL not set. Mocking success.");
    }

    return res.status(200).json({ token, success: true });
  } catch (error) {
    console.error("Error creating share:", error);
    return res.status(500).json({ error: 'Failed to create share link' });
  }
}
