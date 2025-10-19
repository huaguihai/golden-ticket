# 🎫 Golden Ticket - Vérification d'actifs privée basée sur FHE

<div align="center">

![Golden Ticket Banner](https://img.shields.io/badge/Powered%20by-Zama%20fhEVM-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Ethereum](https://img.shields.io/badge/Ethereum-Sepolia-purple)

**Vérification d'actifs préservant la confidentialité avec le chiffrement entièrement homomorphe**

---

### 📖 Lire dans d'autres langues

[![English](https://img.shields.io/badge/English-Click-blue?style=for-the-badge)](./README.md)
[![中文](https://img.shields.io/badge/中文-点击-red?style=for-the-badge)](./README.zh.md)
[![Français](https://img.shields.io/badge/Français-Cliquez-blue?style=for-the-badge)](./README.fr.md)

---

[Démo en direct](#) | [Documentation](./frontend/README.md) | [Contrats](./backend/contracts)

</div>

---

## 📖 Aperçu

**Golden Ticket** est une application décentralisée (DApp) innovante qui exploite la **fhEVM de Zama** (Machine Virtuelle à Chiffrement Entièrement Homomorphe) pour permettre une **vérification d'actifs préservant la confidentialité**.

### 🎯 Le Problème

Les applications blockchain traditionnelles exigent que les utilisateurs exposent leur solde de portefeuille pour prouver leur éligibilité à des événements exclusifs, des services ou des communautés. Cela crée des préoccupations en matière de confidentialité pour les personnes fortunées.

### ✨ Notre Solution

Golden Ticket permet aux utilisateurs de **prouver qu'ils répondent aux exigences d'actifs sans révéler leur solde réel** en utilisant le chiffrement entièrement homomorphe (FHE). Le contrat intelligent apprend seulement si l'utilisateur est qualifié - jamais le montant exact.

### 💡 Cas d'usage

- 🎉 **Événements VIP** : Vérifier l'éligibilité pour des conférences et fêtes exclusives
- 🖼️ **Enchères privées** : Accéder aux enchères de NFT et d'actifs de grande valeur
- 🏛️ **Adhésion DAO** : Rejoindre des communautés privées avec des exigences basées sur les actifs
- 🚀 **Accès anticipé** : Obtenir un accès prioritaire aux opportunités d'investissement

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (Next.js)                       │
│  • Connexion de portefeuille RainbowKit                      │
│  • Chiffrement FHE (fhevmjs)                                 │
│  • Interface utilisateur élégante                            │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┴────────────┬───────────────┐
        ▼                         ▼               ▼
┌──────────────┐       ┌──────────────────┐   ┌──────────┐
│ EventManager │       │ Verification     │   │ NFT      │
│              │◄──────┤ (Logique FHE)    │──►│ Ticket   │
│ • Créer      │       │ • Chiffrer       │   │ • Frapper│
│ • Gérer      │       │ • Vérifier       │   │ • QR Code│
└──────────────┘       └──────────────────┘   └──────────┘
```

### Contrats intelligents (Testnet Sepolia)

| Contrat | Adresse | Objectif |
|---------|---------|----------|
| **EventManager** | `0x7DE2ff3AEf56CE5a6cF3889Ed0173Bbd7C7a004B` | Gérer les événements et les seuils |
| **GoldenTicketVerification** | `0x4472Be950F6a4c1c3E20D3D7A5c1B63b13a352f1` | Logique de vérification FHE |
| **GoldenTicketNFT** | `0x56F581a07fFfEA6E8acD5357fDf0beCecB848EB2` | Billets NFT avec codes QR |

---

## 🚀 Déployer sur Vercel

Déployez votre propre instance de Golden Ticket en un clic :

<div align="center">

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/huaguihai/golden-ticket&project-name=golden-ticket&repository-name=golden-ticket&root-directory=frontend/packages/nextjs)

**Déploiement rapide en moins de 5 minutes ! Aucune configuration requise.**

</div>

> 💡 **Note** : L'application fonctionnera avec des points de terminaison RPC publics. Pour une utilisation en production, ajoutez vos propres clés de fournisseur RPC dans les variables d'environnement Vercel.

Pour des instructions de déploiement détaillées, voir [DEPLOY_TO_VERCEL.md](./DEPLOY_TO_VERCEL.md).

---

## 🚀 Démarrage rapide

### Prérequis

- Node.js v18+
- Gestionnaire de paquets pnpm
- Portefeuille MetaMask
- ETH testnet Sepolia ([Obtenir du robinet](https://sepoliafaucet.com/))

### Installation

```bash
# Cloner le dépôt
git clone https://github.com/huaguihai/golden-ticket.git
cd golden-ticket

# Installer les dépendances frontend
cd frontend
pnpm install

# Démarrer le serveur de développement
cd packages/nextjs
pnpm dev
```

Visitez `http://localhost:3000` pour voir l'application !

### Configuration du backend (Optionnel - pour le développement de contrats)

```bash
cd backend
npm install

# Exécuter les tests
npx hardhat test

# Déployer sur Sepolia
npx hardhat run scripts/deploy.js --network sepolia
```

---

## 📂 Structure du projet

```
golden-ticket/
├── frontend/              # Application frontend Next.js
│   ├── packages/nextjs/
│   │   ├── app/          # Routes de l'application
│   │   ├── components/   # Composants React
│   │   ├── services/     # Service de chiffrement FHE
│   │   └── contracts/    # ABI des contrats
│   └── README.md         # Documentation détaillée du frontend
│
├── backend/              # Contrats intelligents
│   ├── contracts/
│   │   ├── EventManager.sol
│   │   ├── GoldenTicketVerification.sol
│   │   └── GoldenTicketNFT.sol
│   ├── test/            # Tests des contrats
│   └── scripts/         # Scripts de déploiement
│
├── .gitignore
├── LICENSE
└── README.md            # Ce fichier
```

---

## 💻 Stack technologique

### Frontend
- **Framework** : Next.js 15.2.5
- **Styles** : Tailwind CSS
- **Web3** : RainbowKit, wagmi v2, viem, ethers.js
- **FHE** : fhevmjs

### Contrats intelligents
- **Langage** : Solidity ^0.8.24
- **Framework** : Hardhat
- **Bibliothèque FHE** : @fhevm/solidity
- **Standards** : ERC721

### Infrastructure
- **Blockchain** : Testnet Ethereum Sepolia
- **Service FHE** : Zama Gateway
- **Confidentialité** : Chiffrement entièrement homomorphe

---

## 🔐 Comment ça marche

### Approche traditionnelle ❌
```
L'utilisateur envoie le solde réel (0.05 ETH) → Le contrat voit 0.05 ETH
⚠️ Confidentialité violée - solde exposé on-chain
```

### Approche Golden Ticket ✅
```
L'utilisateur chiffre le solde → Le contrat reçoit des données chiffrées
→ Comparaison FHE (chiffré >= seuil)
→ L'oracle déchiffre le résultat → Renvoie seulement "qualifié" ou "non qualifié"
✨ Confidentialité préservée - le solde réel n'est jamais révélé
```

---

## 🧪 Tests

```bash
# Exécuter les tests de contrats intelligents
cd backend
npx hardhat test

# Sortie attendue : Tous les tests réussis ✓
```

---

## 🌟 Fonctionnalités

- ✅ **Confidentialité d'abord** : FHE garantit que votre solde reste chiffré
- ✅ **Détection automatique** : Détecte automatiquement le solde du portefeuille
- ✅ **Billets NFT** : Recevez une preuve NFT on-chain avec code QR
- ✅ **Interface élégante** : Design moderne et réactif
- ✅ **Multi-événements** : Prise en charge de plusieurs événements avec différents seuils

---

## 🛣️ Feuille de route

- [ ] Déploiement sur le mainnet
- [ ] Support des tokens ERC20
- [ ] Application mobile
- [ ] Tableau de bord de l'organisateur d'événements
- [ ] Intégration du marché NFT
- [ ] Support multi-chaînes

---

## 📚 Documentation

- [Documentation Frontend](./frontend/README.md) - Configuration et utilisation détaillées du frontend
- [Tests de contrats intelligents](./backend/test/GoldenTicket.test.ts) - Suite de tests
- [Documentation Zama fhEVM](https://docs.zama.ai/fhevm) - Documentation officielle FHE

---

## 🤝 Contribuer

Les contributions sont les bienvenues ! N'hésitez pas à soumettre une Pull Request.

1. Forker le dépôt
2. Créer votre branche de fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Commiter vos changements (`git commit -m 'Ajouter une fonctionnalité incroyable'`)
4. Pousser vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

Voir [CONTRIBUTING.md](./CONTRIBUTING.md) pour plus de détails.

---

## 📄 Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

## 👨‍💻 Auteur

**im0xmarco**

- Twitter : [@im0xmarco](https://x.com/im0xmarco)
- Construit pour le [Zama Developer Program](https://zama.ai/programs/developer-program)

---

## 🙏 Remerciements

- **Équipe Zama** - Pour la technologie FHE pionnière
- **Communauté Ethereum** - Pour l'infrastructure robuste des contrats intelligents
- **Contributeurs Open Source** - Pour les outils et bibliothèques incroyables

---

## ⚠️ Avertissement

Ce projet est actuellement déployé sur le testnet Sepolia et est destiné à des fins de démonstration et d'éducation. Auditez toujours les contrats intelligents avant le déploiement sur le mainnet.

---

<div align="center">

**⭐ Si vous trouvez ce projet utile, donnez-lui une étoile ! ⭐**

Fait avec ❤️ en utilisant Zama fhEVM

</div>
