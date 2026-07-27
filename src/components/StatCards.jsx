import React from 'react';
import { Activity, ShieldCheck, AlertOctagon, ArrowUpRight, ArrowDownRight, Radio, Server } from 'lucide-react';

export default function StatCards({ nodes, isRealMode }) {
  const onlineNodes = nodes.filter(n => n.status === 'online');
  const degradedNodes = nodes.filter(n => n.status === 'degraded');
  const offlineNodes = nodes.filter(n => n.status === 'offline');

  const avgPing = Math.round(
    nodes.reduce((acc, n) => acc + (n.ping || 0), 0) / (nodes.length || 1)
  );

  const avgPacketLoss = (
    nodes.reduce((acc, n) => acc + (n.packetLoss || 0), 0) / (nodes.length || 1)
  ).toFixed(1);

  const globalUptime = (
    (onlineNodes.length / (nodes.length || 1)) * 100
  ).toFixed(2);

  const totalDownload = nodes.reduce((acc, n) => acc + (n.downloadMbps || 0), 0);

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
      gap: '16px',
      marginBottom: '24px'
    }}>
      
      {/* 1. Latence Moyenne */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
            Latence Moyenne (RTT)
          </span>
          <div style={{ background: 'rgba(59,130,246,0.15)', padding: '8px', borderRadius: '10px' }}>
            <Activity size={20} color="var(--accent-blue)" />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
          <span className="font-mono" style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-primary)' }}>
            {avgPing} <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>ms</span>
          </span>
          <span style={{ fontSize: '0.75rem', color: avgPing < 50 ? 'var(--accent-emerald)' : 'var(--accent-amber)', display: 'inline-flex', alignItems: 'center' }}>
            {avgPing < 50 ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />}
            {avgPing < 50 ? 'Optimale' : 'Élevée'}
          </span>
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
          Mesurée sur {nodes.length} hôtes {isRealMode ? '(Pings Réels)' : '(Simulé)'}
        </p>
      </div>

      {/* 2. Taux de Perte de Paquets */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
            Perte de Paquets
          </span>
          <div style={{ 
            background: parseFloat(avgPacketLoss) > 0 ? 'rgba(239,68,68,0.15)' : 'rgba(16,185,129,0.15)', 
            padding: '8px', 
            borderRadius: '10px' 
          }}>
            <AlertOctagon size={20} color={parseFloat(avgPacketLoss) > 0 ? 'var(--accent-rose)' : 'var(--accent-emerald)'} />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
          <span className="font-mono" style={{ fontSize: '1.8rem', fontWeight: '800', color: parseFloat(avgPacketLoss) > 0 ? 'var(--accent-rose)' : 'var(--accent-emerald)' }}>
            {avgPacketLoss} <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>%</span>
          </span>
          <span style={{ fontSize: '0.75rem', color: parseFloat(avgPacketLoss) === 0 ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>
            {parseFloat(avgPacketLoss) === 0 ? '0% Paquet Perdu' : `${offlineNodes.length} Hôtes coupés`}
          </span>
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
          Stabilité globale de la transmission
        </p>
      </div>

      {/* 3. Taux d'Uptime Global */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
            Disponibilité Global SLA
          </span>
          <div style={{ background: 'rgba(16,185,129,0.15)', padding: '8px', borderRadius: '10px' }}>
            <ShieldCheck size={20} color="var(--accent-emerald)" />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
          <span className="font-mono" style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--accent-emerald)' }}>
            {globalUptime}%
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            ({onlineNodes.length}/{nodes.length} En Ligne)
          </span>
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
          SLA Cible : 99.90%
        </p>
      </div>

      {/* 4. Trafic / Débit Actif */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
            Débit Réseau Cumulé
          </span>
          <div style={{ background: 'rgba(139,92,246,0.15)', padding: '8px', borderRadius: '10px' }}>
            <Radio size={20} color="var(--accent-purple)" />
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
          <span className="font-mono" style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--accent-purple)' }}>
            {(totalDownload / 1000).toFixed(2)} <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Gbps</span>
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)' }}>
            En Direct
          </span>
        </div>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
          Flux global de données entrant/sortant
        </p>
      </div>

    </div>
  );
}
