import React from 'react';
import { Activity, ShieldCheck } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="glass-panel" style={{
      marginTop: '40px',
      padding: '20px 28px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '16px',
      fontSize: '0.8rem',
      color: 'var(--text-muted)'
    }}>
      
      {/* Brand & Copyright */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          background: 'rgba(59,130,246,0.15)',
          padding: '6px',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Activity size={16} color="var(--accent-blue)" />
        </div>
        <div>
          <span style={{ color: 'var(--text-primary)', fontWeight: '700' }}>
            NetPulse Monitoring System
          </span>
          <span style={{ margin: '0 8px' }}>•</span>
          <span>© {currentYear} <strong>Ratovoarisoa Ricardo</strong>. Tous droits réservés.</span>
        </div>
      </div>

      {/* Center Tagline */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <ShieldCheck size={14} color="var(--accent-emerald)" />
        <span>Plateforme de surveillance ICMP & HTTP haute précision</span>
      </div>

      {/* Links & Version */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <a href="#status" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }} onClick={(e) => e.preventDefault()}>
          Mentions Légales
        </a>
        <a href="#privacy" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }} onClick={(e) => e.preventDefault()}>
          Confidentialité
        </a>
        <span className="font-mono" style={{
          background: 'rgba(255,255,255,0.06)',
          padding: '2px 8px',
          borderRadius: '4px',
          color: 'var(--accent-blue)',
          fontSize: '0.75rem'
        }}>
          v1.0.0
        </span>
      </div>

    </footer>
  );
}
