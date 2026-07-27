import React, { useState } from 'react';
import { Activity, Clock, BarChart2 } from 'lucide-react';

export default function LiveLatencyChart({ nodes }) {
  const [selectedNodeId, setSelectedNodeId] = useState(nodes[0]?.id || 'all');
  const [timeRange, setTimeRange] = useState('live');

  const nodeToDisplay = nodes.find(n => n.id === selectedNodeId) || nodes[0];
  const history = nodeToDisplay ? nodeToDisplay.history : [];

  const maxPing = Math.max(...history, 50);
  const minPing = Math.min(...history, 0);

  // Calculate SVG polyline path
  const svgWidth = 800;
  const svgHeight = 220;
  const padding = 20;

  const points = history.map((val, i) => {
    const x = padding + (i / (history.length - 1)) * (svgWidth - padding * 2);
    const y = svgHeight - padding - ((val - minPing) / (maxPing - minPing || 1)) * (svgHeight - padding * 2);
    return `${x},${y}`;
  }).join(' ');

  const areaPoints = `${padding},${svgHeight - padding} ` + points + ` ${svgWidth - padding},${svgHeight - padding}`;

  return (
    <div className="glass-panel" style={{ padding: '24px', marginBottom: '28px' }}>
      
      {/* Chart Control Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ background: 'rgba(59,130,246,0.15)', padding: '8px', borderRadius: '10px' }}>
            <Activity size={20} color="var(--accent-blue)" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: '700' }}>
              Flux de Latence Temps Réel (RTT)
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Évolution de la réponse réseau pour <strong style={{ color: 'var(--accent-blue)' }}>{nodeToDisplay?.name}</strong>
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Host Selector */}
          <select
            value={selectedNodeId}
            onChange={(e) => setSelectedNodeId(e.target.value)}
            style={{
              background: 'rgba(0,0,0,0.4)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '0.8rem',
              outline: 'none'
            }}
          >
            {nodes.map(n => (
              <option key={n.id} value={n.id}>
                {n.name} ({n.target})
              </option>
            ))}
          </select>

          {/* Time Range Pills */}
          <div style={{ display: 'flex', gap: '4px', background: 'rgba(0,0,0,0.4)', padding: '3px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            {['live', '1h', '24h', '7d'].map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                style={{
                  background: timeRange === range ? 'var(--accent-blue)' : 'transparent',
                  color: timeRange === range ? '#fff' : 'var(--text-muted)',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '4px 10px',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                {range.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SVG Latency Chart Canvas */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '220px',
        background: 'rgba(0,0,0,0.3)',
        borderRadius: '12px',
        border: '1px solid var(--border-color)',
        overflow: 'hidden'
      }}>
        
        {/* Horizontal grid lines */}
        <div style={{ position: 'absolute', top: '20%', left: 0, right: 0, borderTop: '1px dashed rgba(255,255,255,0.06)' }}></div>
        <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, borderTop: '1px dashed rgba(255,255,255,0.06)' }}></div>
        <div style={{ position: 'absolute', top: '80%', left: 0, right: 0, borderTop: '1px dashed rgba(255,255,255,0.06)' }}></div>

        {/* Max Ping Label */}
        <span className="font-mono" style={{ position: 'absolute', top: '8px', right: '12px', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
          Max: {maxPing}ms
        </span>

        {/* SVG Curve */}
        <svg width="100%" height="100%" viewBox={`0 0 ${svgWidth} ${svgHeight}`} preserveAspectRatio="none">
          <defs>
            <linearGradient id="latencyGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Fill area below path */}
          <polygon points={areaPoints} fill="url(#latencyGradient)" />

          {/* Main Line */}
          <polyline
            fill="none"
            stroke="#3b82f6"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={points}
          />
        </svg>

        {/* Live Indicator overlay */}
        <div style={{ position: 'absolute', bottom: '12px', left: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="dot-pulse online"></span>
          <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Dernier Ping: <strong style={{ color: 'var(--accent-emerald)' }}>{nodeToDisplay?.ping || 0} ms</strong>
          </span>
        </div>
      </div>

    </div>
  );
}
