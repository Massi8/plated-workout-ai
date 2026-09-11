import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ error: 'Email required' });
    }
    try {
      const user = await redis.get(`user:${email.toLowerCase()}`);
      res.status(200).json({ user: user || null });
    } catch (error) {
      console.error('Redis error:', error);
      res.status(500).json({ error: 'Database error' });
    }
  } else if (req.method === 'POST') {
    const { user } = req.body;
    if (!user || !user.email) {
      return res.status(400).json({ error: 'Invalid user data' });
    }
    try {
      await redis.set(`user:${user.email.toLowerCase()}`, user);
      res.status(200).json({ success: true });
    } catch (error) {
      console.error('Redis error:', error);
      res.status(500).json({ error: 'Database error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
