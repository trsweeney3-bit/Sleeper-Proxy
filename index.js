const http = require('http');
const https = require('https');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const path = req.url.replace('/sleeper', '');
  const url = `https://api.sleeper.app/v1${path}`;

  https.get(url, (sleeperRes) => {
    let data = '';
    sleeperRes.on('data', chunk => data += chunk);
    sleeperRes.on('end', () => {
      res.setHeader('Content-Type', 'application/json');
      res.writeHead(200);
      res.end(data);
    });
  }).on('error', (e) => {
    res.writeHead(500);
    res.end(JSON.stringify({ error: e.message }));
  });
});

server.listen(PORT, () => {
  console.log(`Sleeper proxy running on port ${PORT}`);
});
