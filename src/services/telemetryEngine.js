/**
 * Telemetry Engine for NetPulse
 * Handles real-time jitter, ping updates, manual incident injections, and history streaming.
 */

export class TelemetryEngine {
  constructor(initialNodes, onTick, onIncident) {
    this.nodes = JSON.parse(JSON.stringify(initialNodes));
    this.onTick = onTick;
    this.onIncident = onIncident;
    this.timer = null;
    this.paused = false;
    this.forcedIncidents = {}; // id -> 'offline' | 'degraded' | 'high_latency'
    this.tickInterval = 1500; // ms
  }

  start() {
    if (this.timer) return;
    this.timer = setInterval(() => this.tick(), this.tickInterval);
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  setPaused(paused) {
    this.paused = paused;
  }

  injectIncident(nodeId, type) {
    if (type === 'clear') {
      delete this.forcedIncidents[nodeId];
    } else {
      this.forcedIncidents[nodeId] = type;
    }
    this.tick(true);
  }

  addNode(nodeData) {
    const newNode = {
      id: `node-${Date.now()}`,
      name: nodeData.name,
      target: nodeData.target,
      type: nodeData.type || 'Custom Host',
      location: nodeData.location || 'Surveillance Locale',
      status: 'online',
      ping: Math.floor(15 + Math.random() * 30),
      minPing: 10,
      maxPing: 45,
      packetLoss: 0.0,
      downloadMbps: Math.floor(400 + Math.random() * 600),
      uploadMbps: Math.floor(300 + Math.random() * 500),
      uptimePercent: 100.0,
      httpStatus: 200,
      sslValid: true,
      lastChecked: new Date().toISOString(),
      history: Array.from({ length: 30 }, () => 15 + Math.floor(Math.random() * 10))
    };
    this.nodes.push(newNode);
    if (this.onTick) this.onTick([...this.nodes]);
    return newNode;
  }

  deleteNode(nodeId) {
    this.nodes = this.nodes.filter(n => n.id !== nodeId);
    delete this.forcedIncidents[nodeId];
    if (this.onTick) this.onTick([...this.nodes]);
  }

  tick(force = false) {
    if (this.paused && !force) return;

    const updatedNodes = this.nodes.map(node => {
      const forced = this.forcedIncidents[node.id];
      let newStatus = 'online';
      let newPing = node.ping;
      let newPacketLoss = 0.0;
      let newHttpStatus = 200;

      if (forced === 'offline') {
        newStatus = 'offline';
        newPing = 0;
        newPacketLoss = 100.0;
        newHttpStatus = 504;
      } else if (forced === 'high_latency') {
        newStatus = 'degraded';
        newPing = Math.floor(180 + Math.random() * 120);
        newPacketLoss = parseFloat((1.5 + Math.random() * 3.5).toFixed(1));
        newHttpStatus = 200;
      } else if (forced === 'packet_loss') {
        newStatus = 'degraded';
        newPing = Math.floor(45 + Math.random() * 40);
        newPacketLoss = parseFloat((12.0 + Math.random() * 18.0).toFixed(1));
        newHttpStatus = 502;
      } else {
        // Natural jitter
        const delta = Math.floor((Math.random() - 0.48) * 6);
        const basePing = Math.max(node.minPing, Math.min(node.maxPing, node.ping + delta));
        
        // 2% chance of natural micro spike
        if (Math.random() < 0.03) {
          newPing = basePing + Math.floor(Math.random() * 40);
          newStatus = newPing > 90 ? 'degraded' : 'online';
          newPacketLoss = newPing > 90 ? 1.2 : 0.0;
        } else {
          newPing = basePing;
          newStatus = 'online';
          newPacketLoss = 0.0;
        }
      }

      // Detect status transition for incident logging
      if (node.status !== newStatus && this.onIncident) {
        this.onIncident({
          id: `inc-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
          nodeId: node.id,
          nodeName: node.name,
          previousStatus: node.status,
          newStatus: newStatus,
          timestamp: new Date().toLocaleTimeString('fr-FR'),
          message: newStatus === 'offline' 
            ? `Serveur HORS LIGNE (Timeout ICMP / HTTP 504)`
            : newStatus === 'degraded'
            ? `Latence élevée ou perte de paquets décelée (${newPing}ms, ${newPacketLoss}% perte)`
            : `Rétablissement du service normal (${newPing}ms)`
        });
      }

      // Update history buffer (keep last 30 readings)
      const newHistory = [...node.history.slice(1), newPing];

      return {
        ...node,
        status: newStatus,
        ping: newPing,
        packetLoss: newPacketLoss,
        httpStatus: newHttpStatus,
        lastChecked: new Date().toISOString(),
        history: newHistory
      };
    });

    this.nodes = updatedNodes;
    if (this.onTick) {
      this.onTick([...this.nodes]);
    }
  }
}
