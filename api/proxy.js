// Vercel Serverless Function - CORS Proxy
export default async function handler(req, res) {
  // 设置 CORS 头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { url } = req.query;
  
  if (!url) {
    return res.status(400).json({ error: 'Missing url parameter' });
  }

  // 验证 URL 安全性（只允许学校域名）
  const allowedDomains = [
    'bnuzh.edu.cn',
    'bnu.edu.cn',
    'mp.weixin.qq.com',
    'gd.gov.cn',
    'xiumi.us'
  ];
  
  try {
    const urlObj = new URL(url);
    const isAllowed = allowedDomains.some(domain => 
      urlObj.hostname === domain || urlObj.hostname.endsWith('.' + domain)
    );
    
    if (!isAllowed) {
      return res.status(403).json({ error: 'Domain not allowed' });
    }
  } catch {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  try {
    const fetchRes = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    const contentType = fetchRes.headers.get('content-type');
    res.setHeader('Content-Type', contentType || 'text/html');
    
    const buffer = await fetchRes.arrayBuffer();
    res.status(fetchRes.status).send(Buffer.from(buffer));
  } catch (error) {
    res.status(500).json({ error: 'Fetch failed', message: error.message });
  }
}
