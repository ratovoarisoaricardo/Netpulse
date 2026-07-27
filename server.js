import http from 'http';
import https from 'https';
import { exec } from 'child_process';
import { parse as parseUrl } from 'url';

const PORT = process.env.PORT || 3001;

/**
 * Enable CORS headers for React frontend
 */
function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

/**
 * Execute real system ICMP Ping command (Windows / Linux / macOS)
 */
function realPingHost(target) {
  return new Promise((resolve) => {
    const isWin = process.platform === 'win32';
    const cleanHost = target.replace(/https?:\/\//, '').split('/')[0].split(':')[0];
    
    const cmd = isWin 
      ? `ping -n 1 -w 2000 ${cleanHost}` 
      : `ping -c 1 -W 2 ${cleanHost}`;

    const startTime = Date.now();

    exec(cmd, (error, stdout) => {
      const duration = Date.now() - startTime;

      if (error || !stdout) {
        return resolve({
          target: cleanHost,
          status: 'offline',
          ping: 0,
          packetLoss: 100,
          rawOutput: stdout || error?.message || 'Hôte non joignable'
        });
      }

      let pingMs = duration;
      const msMatch = stdout.match(/time[=<](\d+)ms/i) || stdout.match(/temps[=<](\d+)ms/i) || stdout.match(/=\s*(\d+)ms/i);
      if (msMatch && msMatch[1]) {
        pingMs = parseInt(msMatch[1], 10);
      }

      let packetLoss = 0;
      const lossMatch = stdout.match(/(\d+)%\s*(loss|perte)/i);
      if (lossMatch && lossMatch[1]) {
        packetLoss = parseFloat(lossMatch[1]);
      }

      const status = packetLoss >= 100 ? 'offline' : (pingMs > 150 || packetLoss > 0 ? 'degraded' : 'online');

      resolve({
        target: cleanHost,
        status,
        ping: pingMs,
        packetLoss,
        rawOutput: stdout.trim()
      });
    });
  });
}

/**
 * Execute real HTTP / HTTPS Health Check
 */
function realHttpCheck(url) {
  return new Promise((resolve) => {
    let formattedUrl = url;
    if (!formattedUrl.startsWith('http://') && !formattedUrl.startsWith('https://')) {
      formattedUrl = 'https://' + formattedUrl;
    }

    const client = formattedUrl.startsWith('https://') ? https : http;
    const startTime = Date.now();

    const req = client.get(formattedUrl, { timeout: 3000 }, (res) => {
      const duration = Date.now() - startTime;
      const statusCode = res.statusCode || 200;
      const isOk = statusCode >= 200 && statusCode < 400;

      resolve({
        target: formattedUrl,
        status: isOk ? (duration > 300 ? 'degraded' : 'online') : 'degraded',
        ping: duration,
        httpStatus: statusCode,
        packetLoss: isOk ? 0 : 50,
        sslValid: formattedUrl.startsWith('https://')
      });
    });

    req.on('error', () => {
      const duration = Date.now() - startTime;
      resolve({
        target: formattedUrl,
        status: 'offline',
        ping: duration,
        httpStatus: 504,
        packetLoss: 100,
        sslValid: false
      });
    });

    req.on('timeout', () => {
      req.destroy();
      resolve({
        target: formattedUrl,
        status: 'offline',
        ping: 0,
        httpStatus: 504,
        packetLoss: 100,
        sslValid: false
      });
    });
  });
}

// Create HTTP Server
const server = http.createServer(async (req, res) => {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = parseUrl(req.url, true);
  const pathname = parsedUrl.pathname;

  if (pathname === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'active', nodeVersion: process.version, time: new Date().toISOString() }));
    return;
  }

  if (pathname === '/api/ping') {
    const target = parsedUrl.query.target || '8.8.8.8';
    const type = parsedUrl.query.type || 'icmp';
    
    let result;
    if (type === 'http' || target.startsWith('http')) {
      result = await realHttpCheck(target);
    } else {
      result = await realPingHost(target);
    }

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(result));
    return;
  }

  if (pathname === '/api/ping-batch' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const { hosts } = JSON.parse(body || '{}');
        if (!Array.isArray(hosts)) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'hosts must be an array' }));
          return;
        }

        const results = await Promise.all(
          hosts.map(async (host) => {
            if (host.target.startsWith('http') || host.type === 'API Service' || host.type === 'Web Server') {
              const httpRes = await realHttpCheck(host.target);
              return { ...host, ...httpRes };
            } else {
              const pingRes = await realPingHost(host.target);
              return { ...host, ...pingRes };
            }
          })
        );

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ timestamp: new Date().toISOString(), hosts: results }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not Found' }));
});

server.listen(PORT, () => {
  console.log(`\n🚀 NetPulse Real Monitoring Agent (Zero Dependency) running on http://localhost:${PORT}`);
  console.log(`📡 Real Ping ICMP & HTTP endpoints ready!\n`);
});
