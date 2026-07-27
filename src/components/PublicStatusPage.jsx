import React, { useState } from 'react';
import { generate90DayHistory } from '../services/mockNodes';
import { CheckCircle2, AlertOctagon, Globe, ArrowLeft, ShieldCheck, Calendar } from 'lucide-react';

export default function PublicStatusPage({ nodes, onBackToDashboard }) {
  const [hoveredDay, setHoveredDay] = useState(null);

  const globalStatus = nodes.some(n => n.status === 'offline') 
    ? 'outage' 
    : nodes.some(n => n.status === 'degraded') 
    ? 'degraded' 
    : 'operational';

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', paddingBottom: '40px' }}>
      
      {/* Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <button className="btn btn-secondary" onClick={onBackToDashboard}>
          <ArrowLeft size={16} />
          Retour au Dashboard Privé
        </button>

        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Globe size={14} /> Page de Statut Publique Officielle
        </span>
      </div>

      {/* Global Status Banner */}
      <div className="glass-panel" style={{
        padding: '24px 32px',
        marginBottom: '32px',
        background: globalStatus === 'operational' 
          ? 'linear-gradient(135deg, rgba(16,185,129,0.15) 0%, rgba(16,185,129,0.05) 100%)' 
          : 'linear-gradient(135deg, rgba(239,68,68,0.15) 0%, rgba(239,68,68,0.05) 100%)',
        border: `1px solid ${globalStatus === 'operational' ? 'rgba(16,185,129,0.4)' : 'rgba(239,68,68,0.4)'}`,
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {globalStatus === 'operational' ? (
            <CheckCircle2 size={40} color="var(--accent-emerald)" />
          ) : (
            <AlertOctagon size={40} color="var(--accent-rose)" />
          )}
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800' }}>
              {globalStatus === 'operational' ? 'Tous les Systèmes sont Opérationnels' : 'Interruption Partielle du Réseau'}
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Mis à jour en temps réel • Taux de disponibilité global : 99.96%
            </p>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <span className="font-mono" style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--accent-emerald)' }}>
            99.98% SLA
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>
            Sur 90 jours glissants
          </span>
        </div>
      </div>

      {/* 90-Day Status Bars Grid */}
      <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Calendar size={18} color="var(--accent-blue)" />
        Historique de Disponibilité des Services (90 derniers jours)
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '36px' }}>
        {nodes.map(node => {
          const daysHistory = generate90DayHistory(node.uptimePercent);

          return (
            <div key={node.id} className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: '700' }}>{node.name}</h4>
                  <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{node.target} • {node.location}</span>
                </div>
                <span style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--accent-emerald)' }}>
                  {node.status === 'online' ? '100% Opérationnel' : 'Service Perturbé'}
                </span>
              </div>

              {/* 90 Bars */}
              <div style={{ display: 'flex', gap: '3px', alignItems: 'center', height: '32px' }}>
                {daysHistory.map((day, idx) => (
                  <div
                    key={idx}
                    onMouseEnter={() => setHoveredDay({ nodeName: node.name, ...day })}
                    onMouseLeave={() => setHoveredDay(null)}
                    style={{
                      flex: 1,
                      height: '100%',
                      borderRadius: '2px',
                      background: day.status === 'operational' 
                        ? 'var(--accent-emerald)' 
                        : day.status === 'degraded' 
                        ? 'var(--accent-amber)' 
                        : 'var(--accent-rose)',
                      opacity: 0.85,
                      cursor: 'pointer',
                      transition: 'transform 0.15s ease'
                    }}
                    title={`${day.date} : ${day.label}`}
                  />
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                <span>Il y a 90 jours</span>
                <span>Aujourd'hui (99.9% Uptime)</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tooltip Hover Overlay if active */}
      {hoveredDay && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: '#0f172a',
          border: '1px solid var(--accent-blue)',
          borderRadius: '10px',
          padding: '12px 18px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          zIndex: 100
        }}>
          <strong style={{ fontSize: '0.85rem', color: 'var(--accent-blue)' }}>{hoveredDay.nodeName}</strong>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-primary)', marginTop: '2px' }}>
            Date: {hoveredDay.date}
          </div>
          <div style={{ fontSize: '0.75rem', color: hoveredDay.status === 'operational' ? 'var(--accent-emerald)' : 'var(--accent-amber)' }}>
            {hoveredDay.label}
          </div>
        </div>
      )}

    </div>
  );
}
