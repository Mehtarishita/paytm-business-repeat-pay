import { Redis } from '@upstash/redis';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const redisUrl = process.env.UPSTASH_REDIS_REST_URL || "";
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN || "";

const redis = redisUrl && redisToken ? new Redis({
  url: redisUrl,
  token: redisToken,
}) : null;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { token } = req.query;

  if (req.method === 'GET') {
    try {
      if (!token || typeof token !== 'string') {
        return res.status(400).json({ error: 'Invalid token' });
      }

      if (redis) {
        const data = await redis.get(`share:${token}`);
        if (!data) {
          return res.status(404).json({ error: 'Record not found or expired' });
        }
        
        // Data from upstash might be an object or string depending on version, handle both
        const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
        return res.status(200).json(parsedData);
      } else {
        return res.status(503).json({ error: 'Database backend not configured' });
      }
    } catch (error) {
      console.error("Error fetching share:", error);
      return res.status(500).json({ error: 'Failed to fetch record' });
    }
  } else if (req.method === 'PUT') {
    // Allows updating the status of a shared record (for demo purposes)
    try {
      if (!token || typeof token !== 'string') {
        return res.status(400).json({ error: 'Invalid token' });
      }
      
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ error: 'Status is required' });
      }

      if (redis) {
        const existingData = await redis.get(`share:${token}`);
        if (!existingData) {
          return res.status(404).json({ error: 'Record not found' });
        }
        
        const parsedData = typeof existingData === 'string' ? JSON.parse(existingData) : existingData;
        
        const updatedData = {
          ...parsedData,
          status,
          updatedAt: Date.now()
        };
        
        await redis.set(`share:${token}`, JSON.stringify(updatedData), { ex: 30 * 24 * 60 * 60 });
        return res.status(200).json({ success: true, data: updatedData });
      } else {
        return res.status(503).json({ error: 'Database backend not configured' });
      }
    } catch (error) {
      console.error("Error updating share:", error);
      return res.status(500).json({ error: 'Failed to update record' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
