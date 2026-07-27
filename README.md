# 🌐 NetPulse - System Uptime & Real-Time Network Monitoring

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)](https://github.com/)
[![Author](https://img.shields.io/badge/author-Ratovoarisoa%20Ricardo-orange.svg)](https://github.com/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)
[![React](https://img.shields.io/badge/frontend-React%2018-61dafb.svg)](https://react.dev/)

**NetPulse** est une solution complète, moderne et haute performance de surveillance réseau en temps réel créée par **Ratovoarisoa Ricardo**. Conçue pour offrir aux administrateurs système et ingénieurs DevOps une visibilité instantanée sur la latence (RTT), le taux de perte de paquets, la disponibilité des hôtes (SLA) et la santé globale d'une infrastructure.

---

## 🎯 Raison d'Être & Objectifs

La surveillance d'infrastructure moderne exige une réactivité à la milliseconde près. **NetPulse** répond à ce besoin grâce à une **architecture hybride unique** :

1. **Surveillance Réelle d'Infrastructure (Production Mode)** : Un agent léger en Node.js zéro dépendance exécute de véritables pings ICMP au niveau du système d'exploitation et des Health Checks HTTP/HTTPS certifiés.
2. **Environnement de Test et Démo (Simulation Mode)** : Un moteur de télémétrie réseau réaliste avec générateur de pannes pour tester la résilience et former les équipes d'astreinte.

---

## ✨ Fonctionnalités Principales

### 🔴 1. Monitoring Hybride Temps Réel (ICMP + HTTP)
- **Agent Backend Découplé (`server.js`)** : Réalise des sondages ICMP bas niveau et contrôle les certificats/statuts HTTP (`200 OK`, `502 Bad Gateway`, `504 Gateway Timeout`).
- **Basculement Réseau Dynamique** : Si l'agent backend est arrêté, l'application bascule automatiquement en mesure d'horodatage direct via l'API Browser Fetch.

### 📊 2. Visualisation et Graphiques de Latence
- **Sparklines SVG 30-Secondes** : Chaque carte d'équipement intègre un mini-graphique SVG recalculé à chaque battement de cœur (*heartbeat*).
- **Flux Temps Réel SVG (`LiveLatencyChart`)** : Courbe fluide avec remplissage en dégradé, suivi de tendance et sélecteur de fenêtres temporelles (Live, 1h, 24h, 7j).

### ⚡ 3. Simulateur d'Incidents Réseau
- Panneau de simulation pour tester la réaction du système :
  - 💥 **Coupure Fibre / Panne Serveur** (Passage instantané en HTTP 504 / Offline).
  - ⚠️ **Surcharge / Latence Élevée** (Spike RTT > 200ms).
  - 🛡️ **Attaque / Perte de Paquets** (Simulation de 15% de perte).
  - 🟢 **Rétablissement Global**.

### 🌐 4. Page de Statut Publique (Status Page 90 Jours)
- Interface de communication de crise style *GitHub/Stripe Status Page*.
- Barres de santé interactives pour chaque jour des 90 derniers jours avec calcul automatique du SLA.

---

## 🚀 Installation & Démarrage Rapide

```bash
cd custom-vpn-app
npm run dev
```
👉 Ouvrez votre navigateur sur **`http://localhost:3000`**

### Pour lancer l'Agent ICMP Réel (Node Backend) :
```bash
node server.js
```

---

## 🛡️ Protection & Droits d'Auteur

- **Développeur & Auteur :** Ratovoarisoa Ricardo
- **Copyright :** Copyright (c) 2026 Ratovoarisoa Ricardo. Tous droits réservés.
- **Licence :** Distribué sous licence MIT. Consultez le fichier [`LICENSE`](./LICENSE) pour plus de détails.
