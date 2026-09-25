import React from 'react';
import { Zap, AlertTriangle, CheckCircle, Flame, ShieldAlert, X } from 'lucide-react';

export default function IncidentSimulator({ nodes, onInjectIncident, onClose }) {
  return (
    <div className="glass-panel" style={{
      padding: '24px',
      marginBottom: '28px',
      border: '1px solid var(--accent-amber)',
      background: 'rgba(245, 158, 11, 0.05)',
      position: 'relative'
    }}>
      
      {/* Close button */}
      <button 
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          background: 'transparent',
          border: 'none',
          color: 'var(--text-muted)',
          cursor: 'pointer'
        }}
      >
        <X size={18} />
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
        <Zap size={22} color="var(--accent-amber)" />
        <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--accent-amber)' }}>
          Simulateur d'Incidents Réseau & Pannes
        </h3>
      </div>

      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px', maxWidth: '800px' }}>
        <strong>Objectif du simulateur :</strong> Tester la réaction immédiate de NetPulse face aux pannes réseau réelles (coupure de fibre, surcharge serveur, attaque DDoS). Cliquez sur un bouton pour simuler une dégradation et observez le basculement des alertes et graphiques en direct.
      </p>

      {/* Quick Action Buttons */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '20px' }}>
        <button
          className="btn btn-danger"
          onClick={() => onInjectIncident('node-1', 'offline')}
        >
          <Flame size={16} />
          Couper Edge Gateway (Node-1 Offline)
        </button>

        <button
          className="btn btn-secondary"
          style={{ borderColor: 'var(--accent-amber)', color: 'var(--accent-amber)' }}
          onClick={() => onInjectIncident('node-2', 'high_latency')}
        >
          <AlertTriangle size={16} />
          Spike Latence sur REST API (&gt;200ms)
        </button>

        <button
          className="btn btn-secondary"
          style={{ borderColor: 'var(--accent-purple)', color: 'var(--accent-purple)' }}
          onClick={() => onInjectIncident('node-5', 'packet_loss')}
        >
          <ShieldAlert size={16} />
          Perte 15% Paquets sur Auth Server
        </button>

        <button
          className="btn btn-primary"
          style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', border: 'none' }}
          onClick={() => {
            nodes.forEach(n => onInjectIncident(n.id, 'clear'));
          }}
        >
          <CheckCircle size={16} />
          Rétablir Tous les Équipements
        </button>
      </div>

      {/* Target Node Selection Buttons */}
      <div style={{ background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px' }}>
          Contrôle individuel par équipement :
        </span>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '8px' }}>
          {nodes.map(node => (
            <div key={node.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.04)', padding: '6px 10px', borderRadius: '6px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: '600' }}>{node.name.split(' ')[0]}</span>
              <div style={{ display: 'flex', gap: '4px' }}>
                <button
                  onClick={() => onInjectIncident(node.id, node.status === 'offline' ? 'clear' : 'offline')}
                  style={{
                    padding: '2px 6px',
                    fontSize: '0.65rem',
                    borderRadius: '4px',
                    background: node.status === 'offline' ? 'var(--accent-emerald)' : 'var(--accent-rose)',
                    color: '#fff',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {node.status === 'offline' ? 'Fix' : 'Kill'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
