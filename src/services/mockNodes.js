export const INITIAL_NODES = [
  {
    id: 'node-1',
    name: 'Cloudflare Edge Gateway',
    target: '1.1.1.1',
    type: 'Gateway',
    location: 'Frankfurt, DE (EU-Central)',
    status: 'online',
    ping: 14,
    minPing: 11,
    maxPing: 22,
    packetLoss: 0.0,
    downloadMbps: 940,
    uploadMbps: 880,
    uptimePercent: 99.98,
    httpStatus: 200,
    sslValid: true,
    lastChecked: new Date().toISOString(),
    history: Array.from({ length: 30 }, (_, i) => 12 + Math.floor(Math.sin(i / 2) * 4) + Math.floor(Math.random() * 3))
  },
  {
    id: 'node-2',
    name: 'Core REST & GraphQL API',
    target: 'api.netpulse.io',
    type: 'API Service',
    location: 'Paris, FR (EU-West)',
    status: 'online',
    ping: 28,
    minPing: 24,
    maxPing: 45,
    packetLoss: 0.1,
    downloadMbps: 450,
    uploadMbps: 410,
    uptimePercent: 99.94,
    httpStatus: 200,
    sslValid: true,
    lastChecked: new Date().toISOString(),
    history: Array.from({ length: 30 }, (_, i) => 25 + Math.floor(Math.cos(i / 3) * 6) + Math.floor(Math.random() * 5))
  },
  {
    id: 'node-3',
    name: 'Google Primary DNS',
    target: '8.8.8.8',
    type: 'DNS',
    location: 'Global Anycast',
    status: 'online',
    ping: 8,
    minPing: 6,
    maxPing: 15,
    packetLoss: 0.0,
    downloadMbps: 1200,
    uploadMbps: 1150,
    uptimePercent: 100.0,
    httpStatus: 200,
    sslValid: true,
    lastChecked: new Date().toISOString(),
    history: Array.from({ length: 30 }, (_, i) => 7 + Math.floor(Math.random() * 3))
  },
  {
    id: 'node-4',
    name: 'PostgreSQL Primary Cluster',
    target: 'db-primary.internal:5432',
    type: 'Database',
    location: 'Datacenter AWS eu-west-3',
    status: 'online',
    ping: 3,
    minPing: 2,
    maxPing: 8,
    packetLoss: 0.0,
    downloadMbps: 3400,
    uploadMbps: 3200,
    uptimePercent: 99.99,
    httpStatus: 200,
    sslValid: true,
    lastChecked: new Date().toISOString(),
    history: Array.from({ length: 30 }, () => 3 + Math.floor(Math.random() * 2))
  },
  {
    id: 'node-5',
    name: 'Auth & Identity Provider',
    target: 'auth.netpulse.io',
    type: 'OAuth / Auth',
    location: 'Dublin, IE (EU-West)',
    status: 'online',
    ping: 32,
    minPing: 28,
    maxPing: 65,
    packetLoss: 0.2,
    downloadMbps: 280,
    uploadMbps: 260,
    uptimePercent: 99.89,
    httpStatus: 200,
    sslValid: true,
    lastChecked: new Date().toISOString(),
    history: Array.from({ length: 30 }, (_, i) => 30 + Math.floor(Math.sin(i) * 5) + Math.floor(Math.random() * 4))
  },
  {
    id: 'node-6',
    name: 'Global CDN Static Assets',
    target: 'cdn.netpulse.net',
    type: 'CDN',
    location: 'London, UK',
    status: 'online',
    ping: 18,
    minPing: 15,
    maxPing: 30,
    packetLoss: 0.0,
    downloadMbps: 1850,
    uploadMbps: 1720,
    uptimePercent: 99.97,
    httpStatus: 200,
    sslValid: true,
    lastChecked: new Date().toISOString(),
    history: Array.from({ length: 30 }, (_, i) => 16 + Math.floor(Math.cos(i) * 3) + Math.floor(Math.random() * 3))
  }
];

// Generate 90-day status bars data for Public Status Page
export const generate90DayHistory = (uptime = 99.9) => {
  const days = [];
  const today = new Date();
  
  for (let i = 89; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Random occasional incident
    const rand = Math.random();
    let status = 'operational';
    let label = '100% Uptime - 0 Incidents';
    
    if (rand > 0.97) {
      status = 'degraded';
      label = `Performance dégradée - Latence élevée (${Math.floor(120 + Math.random() * 80)}ms)`;
    } else if (rand > 0.99) {
      status = 'outage';
      label = 'Interruption de service partielle (12 min)';
    }

    days.push({
      dayIndex: 89 - i,
      date: date.toISOString().split('T')[0],
      formattedDate: date.toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' }),
      status,
      label
    });
  }
  return days;
};
