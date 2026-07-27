import React from 'react';
import { 
  Activity, 
  ShieldCheck, 
  AlertTriangle, 
  Globe, 
  LayoutDashboard, 
  PlusCircle, 
  Zap,
  Pause,
  Play
} from 'lucide-react';

export default function Navbar({ 
  currentView, 
  setCurrentView, 
  globalStatus, 
  nodesCount, 
  onOpenAddModal, 
  onToggleSimulator, 
  isSimulatorOpen,
  isPaused,
  onTogglePause
}) {
  return (
    <header className="glass-panel" style={{ marginBottom: '24px', padding: '16px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        
        {/* Brand Logo & Global Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 16px rgba(59, 130, 246, 0.4)'
          }}>
            <Activity size={24} color="#ffffff" />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{ fontSize: '1.35rem', fontWeight: '800', letterSpacing: '-0.5px' }}>
                NetPulse <span style={{ color: 'var(--accent-blue)', fontSize: '0.85rem', fontWeight: '600', padding: '2px 8px', background: 'rgba(59,130,246,0.15)', borderRadius: '6px' }}>v1.0</span>
              </h1>
              <span className={`status-badge ${globalStatus.type}`}>
                <span className={`dot-pulse ${globalStatus.type}`}></span>
                {globalStatus.label}
              </span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Surveillance temps réel • {nodesCount} hôtes actifs
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(0,0,0,0.3)', padding: '4px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
          <button 
            className={`btn ${currentView === 'dashboard' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '6px 14px', fontSize: '0.8rem', border: 'none' }}
            onClick={() => setCurrentView('dashboard')}
          >
            <LayoutDashboard size={15} />
            Dashboard Privé
          </button>
          
          <button 
            className={`btn ${currentView === 'status-page' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '6px 14px', fontSize: '0.8rem', border: 'none' }}
            onClick={() => setCurrentView('status-page')}
          >
            <Globe size={15} />
            Status Page Publique (90j)
          </button>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button 
            className="btn btn-secondary"
            onClick={onTogglePause}
            title={isPaused ? 'Reprendre la télémétrie' : 'Mettre en pause'}
            style={{ padding: '8px 12px' }}
          >
            {isPaused ? <Play size={16} color="var(--accent-emerald)" /> : <Pause size={16} color="var(--accent-amber)" />}
            <span style={{ fontSize: '0.8rem' }}>{isPaused ? 'PAUSÉ' : 'LIVE'}</span>
          </button>

          <button 
            className={`btn ${isSimulatorOpen ? 'btn-primary' : 'btn-secondary'}`}
            onClick={onToggleSimulator}
            style={{ borderColor: isSimulatorOpen ? 'var(--accent-amber)' : undefined }}
          >
            <Zap size={16} color={isSimulatorOpen ? '#ffffff' : 'var(--accent-amber)'} />
            Simulateur de Pannes
          </button>

          <button className="btn btn-primary" onClick={onOpenAddModal}>
            <PlusCircle size={16} />
            Ajouter un Hôte
          </button>
        </div>

      </div>
    </header>
  );
}
