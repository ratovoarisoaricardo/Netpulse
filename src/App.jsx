import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import StatCards from './components/StatCards';
import HostGrid from './components/HostGrid';
import LiveLatencyChart from './components/LiveLatencyChart';
import IncidentSimulator from './components/IncidentSimulator';
import IncidentLog from './components/IncidentLog';
import PublicStatusPage from './components/PublicStatusPage';
import AddHostModal from './components/AddHostModal';
import Footer from './components/Footer';

import { INITIAL_NODES } from './services/mockNodes';
import { TelemetryEngine } from './services/telemetryEngine';
import { checkBackendHealth, performRealBatchCheck } from './services/realPingService';
import { Radio, ShieldAlert, CheckCircle } from 'lucide-react';

export default function App() {
  const [nodes, setNodes] = useState(INITIAL_NODES);
  const [currentView, setCurrentView] = useState('dashboard');
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [incidents, setIncidents] = useState([]);
  const [toast, setToast] = useState(null);

  const [isRealMode, setIsRealMode] = useState(false);
  const [backendStatus, setBackendStatus] = useState({ active: false });

  const engineRef = useRef(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    checkBackendHealth().then(res => {
      setBackendStatus(res);
      if (res.active) {
        showToast("Agent Backend Node.js Détecté! Mode ICMP/HTTP Réel Disponible.", "success");
      }
    });
  }, []);

  useEffect(() => {
    const handleTick = (updatedNodes) => {
      setNodes(updatedNodes);
    };

    const handleIncident = (incident) => {
      setIncidents(prev => [incident, ...prev.slice(0, 19)]);
      showToast(
        `${incident.nodeName} : ${incident.message}`, 
        incident.newStatus === 'offline' ? 'error' : incident.newStatus === 'degraded' ? 'warning' : 'success'
      );
    };

    const engine = new TelemetryEngine(INITIAL_NODES, handleTick, handleIncident);
    engineRef.current = engine;
    engine.start();

    return () => {
      engine.stop();
    };
  }, []);

  useEffect(() => {
    if (!isRealMode || isPaused) return;

    const interval = setInterval(async () => {
      const result = await performRealBatchCheck(nodes);
      if (result.success && result.hosts) {
        setNodes(prev => prev.map(n => {
          const matchedReal = result.hosts.find(r => r.id === n.id || r.target === n.target);
          if (matchedReal) {
            const newHistory = [...n.history.slice(1), matchedReal.ping];
            return {
              ...n,
              status: matchedReal.status,
              ping: matchedReal.ping,
              packetLoss: matchedReal.packetLoss,
              httpStatus: matchedReal.httpStatus || 200,
              lastChecked: matchedReal.lastChecked || new Date().toISOString(),
              history: newHistory
            };
          }
          return n;
        }));
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [isRealMode, isPaused, nodes]);

  const togglePause = () => {
    const nextPaused = !isPaused;
    setIsPaused(nextPaused);
    if (engineRef.current) {
      engineRef.current.setPaused(nextPaused);
    }
  };

  const handleInjectIncident = (nodeId, type) => {
    if (engineRef.current) {
      engineRef.current.injectIncident(nodeId, type);
    }
  };

  const handleAddHost = (hostData) => {
    if (engineRef.current) {
      const newNode = engineRef.current.addNode(hostData);
      showToast(`Hôte ${newNode.name} (${newNode.target}) ajouté au monitoring!`, 'success');
    }
  };

  const handleDeleteNode = (nodeId) => {
    if (engineRef.current) {
      engineRef.current.deleteNode(nodeId);
      showToast("Hôte retiré de la surveillance.", "info");
    }
  };

  const handleSingleRealPing = async (target) => {
    showToast(`Envoi d'un Ping réel vers ${target}...`, 'info');
    const result = await performRealBatchCheck([{ target }]);
    if (result.hosts && result.hosts[0]) {
      const r = result.hosts[0];
      showToast(`Résultat Ping ${target} : ${r.ping}ms (${r.status.toUpperCase()})`, r.status === 'offline' ? 'error' : 'success');
    }
  };

  const getGlobalStatus = () => {
    if (nodes.some(n => n.status === 'offline')) {
      return { type: 'offline', label: 'INCIDENT MAJEUR EN COURS' };
    }
    if (nodes.some(n => n.status === 'degraded')) {
      return { type: 'degraded', label: 'PERFORMANCES DÉGRADÉES' };
    }
    return { type: 'online', label: 'SYSTÈMES OPÉRATIONNELS' };
  };

  return (
    <div className="app-container">
      
      {toast && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 2000,
          background: toast.type === 'error' ? '#7f1d1d' : toast.type === 'warning' ? '#78350f' : '#064e3b',
          border: `1px solid ${toast.type === 'error' ? '#ef4444' : toast.type === 'warning' ? '#f59e0b' : '#10b981'}`,
          color: '#fff',
          padding: '12px 20px',
          borderRadius: '10px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '0.85rem',
          fontWeight: '600'
        }}>
          {toast.type === 'error' ? <ShieldAlert size={18} /> : <CheckCircle size={18} />}
          {toast.message}
        </div>
      )}

      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        globalStatus={getGlobalStatus()}
        nodesCount={nodes.length}
        onOpenAddModal={() => setIsAddModalOpen(true)}
        onToggleSimulator={() => setIsSimulatorOpen(prev => !prev)}
        isSimulatorOpen={isSimulatorOpen}
        isPaused={isPaused}
        onTogglePause={togglePause}
      />

      <div className="glass-panel" style={{
        padding: '10px 20px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Radio size={16} color={isRealMode ? 'var(--accent-emerald)' : 'var(--accent-blue)'} />
          <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>
            Mode Actif : <strong style={{ color: isRealMode ? 'var(--accent-emerald)' : 'var(--accent-blue)' }}>
              {isRealMode ? '🔴 MONITORING EN REEL (Pings ICMP/HTTP Live)' : '⚡ DEMO TEMPS REEL (Simulation Télémétrique)'}
            </strong>
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {backendStatus.active ? '• Backend Node ICMP Connecté' : '• HTTP Browser Timing'}
          </span>
        </div>

        <button
          className={`btn ${isRealMode ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setIsRealMode(prev => !prev)}
          style={{ padding: '4px 12px', fontSize: '0.75rem' }}
        >
          Basculer vers {isRealMode ? 'Mode Démo' : 'Mode Réel'}
        </button>
      </div>

      {currentView === 'dashboard' ? (
        <>
          <StatCards nodes={nodes} isRealMode={isRealMode} />

          {isSimulatorOpen && (
            <IncidentSimulator
              nodes={nodes}
              onInjectIncident={handleInjectIncident}
              onClose={() => setIsSimulatorOpen(false)}
            />
          )}

          <LiveLatencyChart nodes={nodes} />

          <HostGrid
            nodes={nodes}
            onInjectIncident={handleInjectIncident}
            onDeleteNode={handleDeleteNode}
            onSingleRealPing={handleSingleRealPing}
          />

          <IncidentLog incidents={incidents} />
        </>
      ) : (
        <PublicStatusPage
          nodes={nodes}
          onBackToDashboard={() => setCurrentView('dashboard')}
        />
      )}

      <AddHostModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddHost={handleAddHost}
      />

      <Footer />

    </div>
  );
}
