/**
 * Real Ping Service for NetPulse
 * Connects to the local Node.js Real Monitoring Agent (http://localhost:3001)
 * or performs browser-native HTTP timing fetch checks.
 */

const BACKEND_URL = 'http://localhost:3001';

export async function checkBackendHealth() {
  try {
    const res = await fetch(`${BACKEND_URL}/api/health`, { signal: AbortSignal.timeout(1500) });
    if (res.ok) {
      const data = await res.json();
      return { active: true, info: data };
    }
  } catch (err) {
    // Backend Node agent is not running
  }
  return { active: false };
}

/**
 * Ping multiple real hosts via Node ICMP/HTTP agent or Browser Fetch
 */
export async function performRealBatchCheck(hosts) {
  // First check if Node backend is available
  try {
    const res = await fetch(`${BACKEND_URL}/api/ping-batch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hosts }),
      signal: AbortSignal.timeout(4000)
    });

    if (res.ok) {
      const data = await res.json();
      return { success: true, mode: 'Node ICMP/HTTP Agent', hosts: data.hosts };
    }
  } catch (e) {
    // Backend unreachable, fallback to browser fetch
  }

  // Fallback: Browser HTTP Fetch ping
  const browserResults = await Promise.all(
    hosts.map(async (host) => {
      let targetUrl = host.target;
      if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://')) {
        targetUrl = 'https://' + targetUrl;
      }

      const start = performance.now();
      try {
        const response = await fetch(targetUrl, { 
          method: 'HEAD', 
          mode: 'no-cors',
          cache: 'no-store',
          signal: AbortSignal.timeout(3000) 
        });

        const duration = Math.round(performance.now() - start);
        return {
          ...host,
          status: duration > 200 ? 'degraded' : 'online',
          ping: duration,
          packetLoss: 0,
          httpStatus: response.status || 200,
          lastChecked: new Date().toISOString()
        };
      } catch (err) {
        const duration = Math.round(performance.now() - start);
        return {
          ...host,
          status: 'offline',
          ping: duration > 3000 ? 0 : duration,
          packetLoss: 100,
          httpStatus: 504,
          lastChecked: new Date().toISOString()
        };
      }
    })
  );

  return { success: true, mode: 'Browser Direct Fetch', hosts: browserResults };
}
