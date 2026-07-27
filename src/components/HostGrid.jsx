import React, { useState } from 'react';
import HostCard from './HostCard';
import { Server, Search, Filter } from 'lucide-react';

export default function HostGrid({ nodes, onInjectIncident, onDeleteNode, onSingleRealPing }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredNodes = nodes.filter(node => {
    const matchesSearch = node.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          node.target.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || node.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div style={{ marginBottom: '28px' }}>
      
      {/* Grid Controls Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Server size={18} color="var(--accent-blue)" />
          <h2 style={{ fontSize: '1.1rem', fontWeight: '700' }}>
            Équipements & Services surveillés ({filteredNodes.length})
          </h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Search Input */}
          <div style={{ position: 'relative' }}>
            <Search size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Rechercher IP / Domaine..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '6px 12px 6px 30px',
                color: 'var(--text-primary)',
                fontSize: '0.8rem',
                outline: 'none',
                width: '180px'
              }}
            />
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: '4px', background: 'rgba(0,0,0,0.3)', padding: '3px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            {['all', 'online', 'degraded', 'offline'].map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                style={{
                  background: filterStatus === status ? 'rgba(255,255,255,0.12)' : 'transparent',
                  color: filterStatus === status ? 'var(--text-primary)' : 'var(--text-muted)',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '4px 8px',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                {status === 'all' ? 'Tous' : status === 'online' ? 'Ligne' : status === 'degraded' ? 'Lents' : 'Hors Ligne'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Host Cards Grid */}
      {filteredNodes.length === 0 ? (
        <div className="glass-panel" style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)' }}>
          Aucun hôte trouvé correspondant à votre filtre.
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '16px'
        }}>
          {filteredNodes.map(node => (
            <HostCard
              key={node.id}
              node={node}
              onInjectIncident={onInjectIncident}
              onDeleteNode={onDeleteNode}
              onSingleRealPing={onSingleRealPing}
            />
          ))}
        </div>
      )}

    </div>
  );
}
