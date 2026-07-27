import React from 'react';
import { History, ShieldAlert, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function IncidentLog({ incidents }) {
  return (
    <div className="glass-panel" style={{ padding: '24px', marginBottom: '28px' }}>
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <History size={20} color="var(--accent-blue)" />
          <h3 style={{ fontSize: '1.05rem', fontWeight: '700' }}>
            Journal des Incidents & Événements Système ({incidents.length})
          </h3>
        </div>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          Mises à jour automatiques en direct
        </span>
      </div>

      {incidents.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          <CheckCircle2 size={32} color="var(--accent-emerald)" style={{ marginBottom: '8px' }} />
          <p>Aucun incident enregistré. Tous les systèmes fonctionnent nominalement.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '300px', overflowY: 'auto' }}>
          {incidents.map(inc => {
            const isOffline = inc.newStatus === 'offline';
            const isDegraded = inc.newStatus === 'degraded';
            return (
              <div 
                key={inc.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: isOffline ? 'rgba(239, 68, 68, 0.08)' : isDegraded ? 'rgba(245, 158, 11, 0.08)' : 'rgba(16, 185, 129, 0.08)',
                  borderLeft: `4px solid ${isOffline ? 'var(--accent-rose)' : isDegraded ? 'var(--accent-amber)' : 'var(--accent-emerald)'}`,
                  padding: '12px 16px',
                  borderRadius: '8px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {isOffline ? (
                    <ShieldAlert size={18} color="var(--accent-rose)" />
                  ) : isDegraded ? (
                    <AlertTriangle size={18} color="var(--accent-amber)" />
                  ) : (
                    <CheckCircle2 size={18} color="var(--accent-emerald)" />
                  )}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <strong style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>{inc.nodeName}</strong>
                      <span className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{inc.timestamp}</span>
                    </div>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {inc.message}
                    </p>
                  </div>
                </div>

                <span className={`status-badge ${inc.newStatus}`}>
                  {inc.newStatus.toUpperCase()}
                </span>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
