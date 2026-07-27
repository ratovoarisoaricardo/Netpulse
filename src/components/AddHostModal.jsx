import React, { useState } from 'react';
import { PlusCircle, X, Server, Globe } from 'lucide-react';

export default function AddHostModal({ isOpen, onClose, onAddHost }) {
  const [name, setName] = useState('');
  const [target, setTarget] = useState('');
  const [type, setType] = useState('Web Server');
  const [location, setLocation] = useState('Europe - Paris');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !target) return;

    onAddHost({
      name,
      target,
      type,
      location
    });

    setName('');
    setTarget('');
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: 'rgba(59,130,246,0.15)', padding: '8px', borderRadius: '10px' }}>
              <PlusCircle size={20} color="var(--accent-blue)" />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>
              Ajouter un Nouvel Hôte / Service à Surveiller
            </h3>
          </div>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Nom de l'équipement / Service
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Serveur Web Production, API Gateway"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '10px 14px',
                color: 'var(--text-primary)',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
              Adresse IP ou Nom de Domaine
            </label>
            <input
              type="text"
              required
              placeholder="Ex: google.com, 8.8.8.8, api.mysite.com"
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(0,0,0,0.3)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '10px 14px',
                color: 'var(--text-primary)',
                fontSize: '0.85rem',
                outline: 'none',
                fontFamily: 'var(--font-mono)'
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Type d'Hôte
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
              >
                <option value="Web Server">Serveur Web / HTTP</option>
                <option value="API Service">API REST / GraphQL</option>
                <option value="Gateway">Routeur / Gateway</option>
                <option value="DNS">Serveur DNS</option>
                <option value="Database">Base de données</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Localisation
              </label>
              <input
                type="text"
                placeholder="Ex: Paris FR, Frankfurt DE"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className="btn btn-primary">
              Ajouter l'Hôte
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
