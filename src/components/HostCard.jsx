import React from 'react';
import { Server, Database, Globe, Shield, Wifi, Trash2, Zap, RefreshCw, Lock } from 'lucide-react';

export default function HostCard({ node, onInjectIncident, onDeleteNode, onSingleRealPing }) {
  const isOffline = node.status === 'offline';
  const isDegraded = node.status === 'degraded';

  // SVG Sparkline calculation
  const history = node.history || [];
  const minVal = Math.min(...history, 5);
  const maxVal = Math.max(...history, 100);
  const range = maxVal - minVal || 1;

  const points = history.map((val, idx) => {
    const x = (idx / (history.length - 1)) * 180;
    const y = 35 - ((val - minVal) / range) * 30;
    return `${x},${y}`;
  }).join(' ');

  const getIcon = () => {
    switch (node.type) {
      case 'Database': return <Database size={18} color="var(--accent-purple)" />;
      case 'DNS': return <Wifi size={18} color="var(--accent-emerald)" />;
      case 'Gateway': return <Shield size={18} color="var(--accent-blue)" />;
      default: return <Server size={18} color="var(--accent-blue)" />;
    }
  };

  return (
    <div className="glass-panel" style={{
      padding: '18px',
      position: 'relative',
      borderColor: isOffline ? 'rgba(239, 68, 68, 0.4)' : isDegraded ? 'rgba(245, 158, 11, 0.4)' : undefined,
      background: isOffline ? 'rgba(239, 68, 68, 0.04)' : undefined
    }}>
      
      {/* Header: Name, Type Icon & Status Badge */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            background: 'rgba(255,255,255,0.06)',
            padding: '8px',
            borderRadius: '10px',
            border: '1px solid var(--border-color)'
          }}>
            {getIcon()}
          </div>
          <div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-primary)', lineHeight: '1.2' }}>
              {node.name}
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
              <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--accent-blue)', background: 'rgba(59,130,246,0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                {node.target}
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                {node.location}
              </span>
            </div>
          </div>
        </div>

        <span className={`status-badge ${node.status}`}>
          <span className={`dot-pulse ${node.status}`}></span>
          {isOffline ? 'OFFLINE' : isDegraded ? 'LENT' : 'OK'}
        </span>
      </div>

      {/* Primary Metrics Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '8px',
        background: 'rgba(0,0,0,0.25)',
        padding: '10px',
        borderRadius: '10px',
        border: '1px solid var(--border-color)',
        marginBottom: '14px'
      }}>
        <div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Latence</span>
          <span className="font-mono" style={{
            fontSize: '1rem',
            fontWeight: '700',
            color: isOffline ? 'var(--accent-rose)' : isDegraded ? 'var(--accent-amber)' : 'var(--accent-emerald)'
          }}>
            {isOffline ? '---' : `${node.ping} ms`}
          </span>
        </div>

        <div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Perte</span>
          <span className="font-mono" style={{
            fontSize: '1rem',
            fontWeight: '700',
            color: node.packetLoss > 0 ? 'var(--accent-rose)' : 'var(--text-secondary)'
          }}>
            {node.packetLoss}%
          </span>
        </div>

        <div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>HTTP Code</span>
          <span className="font-mono" style={{
            fontSize: '0.85rem',
            fontWeight: '600',
            color: node.httpStatus === 200 ? 'var(--accent-emerald)' : 'var(--accent-amber)'
          }}>
            {node.httpStatus || 200}
          </span>
        </div>
      </div>

      {/* SVG Sparkline Latency Graph */}
      <div style={{ marginBottom: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
          <span>Tendance Latence (30s)</span>
          <span className="font-mono">{node.ping}ms</span>
        </div>
        <div style={{ height: '36px', width: '100%', background: 'rgba(0,0,0,0.2)', borderRadius: '6px', overflow: 'hidden', padding: '2px 4px' }}>
          <svg width="100%" height="100%" viewBox="0 0 180 35" preserveAspectRatio="none">
            <polyline
              fill="none"
              stroke={isOffline ? '#ef4444' : isDegraded ? '#f59e0b' : '#3b82f6'}
              strokeWidth="2"
              points={points}
            />
          </svg>
        </div>
      </div>

      {/* Card Action Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid var(--border-color)' }}>
        <button
          className="btn btn-secondary"
          style={{ padding: '4px 10px', fontSize: '0.75rem' }}
          onClick={() => onSingleRealPing(node.target)}
          title="Exécuter un ping réel immédiat"
        >
          <RefreshCw size={13} />
          Ping Réel
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            className="btn btn-secondary"
            style={{ padding: '4px 8px', fontSize: '0.75rem', color: 'var(--accent-amber)' }}
            onClick={() => onInjectIncident(node.id, isOffline ? 'clear' : 'offline')}
            title={isOffline ? 'Rétablir le serveur' : 'Simuler une panne'}
          >
            <Zap size={13} />
            {isOffline ? 'Rétablir' : 'Couper'}
          </button>

          <button
            className="btn btn-secondary"
            style={{ padding: '4px 8px', fontSize: '0.75rem', color: 'var(--accent-rose)' }}
            onClick={() => onDeleteNode(node.id)}
            title="Supprimer cet hôte"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

    </div>
  );
}
