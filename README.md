# Commit Protocol

> **Optimistic Agentic Settlement for On-Chain Work Commitments with Discord Integration**

A trustless escrow system for work commitments that combines smart contract escrow, AI-powered verification, and optimistic settlement with dynamic economic security. Discord servers register and manage prepaid MNEE balances for seamless commitment creation.

## 🎯 Overview

Commit Protocol enables Discord communities and projects to:
- ✅ **Discord server registration** with 15 MNEE fee
- ✅ **Prepaid balance system** for MNEE token management
- ✅ **Automatic settlement** via cron job after deadline + dispute window
- ✅ **AI verification agents** (GitHub PRs, Design files, Documents)
- ✅ **Dynamic stakes** that scale with task value, reputation, and AI confidence
- ✅ **Reputation tracking** to reward consistent contributors
- ✅ **Secure relayer pattern** - bot wallet controls all contract interactions

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                      Commit Protocol                              │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌────────────┐   ┌──────────────┐   ┌──────────────┐           │
│  │  Discord   │──▶│  API Server  │──▶│    Smart     │           │
│  │   Server   │   │  (Node.js)   │   │  Contracts   │           │
│  │  (Guild)   │   │              │   │  (Solidity)  │           │
│  └────────────┘   └──────────────┘   └──────────────┘           │
│                          │                   │                   │
│                    ┌─────┴─────┐            │                   │
│                    │           │            │                   │
│              ┌─────▼─────┐ ┌───▼───┐        │                   │
│              │  MongoDB  │ │ IPFS  │   MNEE Token               │
│              │  (Users)  │ │Pinata │                            │
│              └───────────┘ └───────┘                            │
│                                                                   │
│         ┌──────────────┐         ┌──────────────┐               │
│         │ Cron Job     │────────▶│  AI Agents   │               │
│         │ (Settlement) │         │  (Gemini)    │               │
│         └──────────────┘         └──────────────┘               │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

## 💰 MNEE Token

- **Token**: MNEE ERC-20
- **Address**: `0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF`
- **Network**: Ethereum Mainnet
- **Testing**: Fork mainnet using Anvil (no testnet available)

## 📁 Repository Structure

```
mnee-commit/
├── contracts/          # Solidity smart contracts (Foundry)
│   ├── src/Commit.sol
│   ├── test/Commit.t.sol
│   └── script/Deploy.s.sol
│
├── server/             # API Backend (Node.js + TypeScript)
│   ├── src/
│   │   ├── routes/           # REST API endpoints
│   │   ├── services/         # Contract, IPFS, AI agents
│   │   │   └── agents/       # GitHub, Design, Document agents
│   │   ├── models/           # MongoDB models
│   │   └── config/           # Environment config
│   └── README.md
│
├── bot/                # Discord bot
│   └── index.js
│
└── commit-protocol/    # Documentation
    ├── PROTOCOL.md
    └── commit_protocol.pdf
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- MongoDB
- Foundry (for smart contracts)
- Ethereum RPC URL (Alchemy/Infura)

### 1. Smart Contracts

```bash
cd contracts
forge install
cp .env.example .env
forge test
```

### 2. API Server

```bash
cd server
npm install
cp .env.example .env
npm run dev
```

### 3. Discord Bot

```bash
cd bot
npm install
cp .env.example .env
npm start
```

## 🔌 API Endpoints

### Server Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/server/register` | Register Discord server (15 MNEE) |
| POST | `/server/:guildId/deposit` | Deposit MNEE |
| POST | `/server/:guildId/withdraw` | Withdraw MNEE |
| GET | `/server/:guildId` | Get server info |

### Commitments
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/commit/create` | Create commitment |
| POST | `/commit/:id/submit` | Submit work evidence |
| GET | `/commit/:id` | Get commitment |
| GET | `/commit/server/:guildId` | List by server |
| GET | `/commit/contributor/:address` | List by contributor |

### Disputes & Settlement
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/dispute/open` | Open dispute |
| GET | `/dispute/:commitId` | Get dispute |
| POST | `/settlement/batch` | Batch settle |
| GET | `/settlement/pending` | Pending settlements |

### AI Verification Agents
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/agent/github` | GitHub PR verification |
| POST | `/agent/design` | Design verification |
| POST | `/agent/document` | Document verification |
| GET | `/agent/:cid` | Get evidence by CID |

### User Mapping
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/user` | Register username-wallet |
| GET | `/user/:username` | Get wallet by username |
| GET | `/user/wallet/:address` | Get username by wallet |
| DELETE | `/user/:username` | Remove mapping |

### Health
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/admin/stats` | Protocol statistics |

## 🤖 AI Verification Agents

The protocol includes three AI-powered agents using **Gemini 2.0 Flash**:

### 1️⃣ GitHub Code Diff Agent
- Fetches PR details via GitHub API
- Checks CI/test status
- Analyzes code changes against task spec
- Returns confidence score + IPFS evidence

### 2️⃣ Visual Design Agent
- Compares submitted designs to specs
- Uses Gemini Vision for layout/color analysis
- Returns confidence score + IPFS evidence

### 3️⃣ Document Agent
- Parses PDF/Markdown documents
- Checks structure and section coverage
- Returns confidence score + IPFS evidence

## 📊 Dynamic Stake Formula

```
Sreq = Sbase × Mtime × Mrep × MAI
```

- **Sbase**: Base stake (e.g., 0.01 ETH)
- **Mtime**: Time multiplier (prevents last-second disputes)
- **Mrep**: Reputation multiplier (protects proven contributors)
- **MAI**: AI confidence multiplier (2x for high confidence)

## 🔐 Security

- ✅ OpenZeppelin v5.5.0 (ReentrancyGuard, SafeERC20)
- ✅ Secure relayer pattern - only bot wallet can call protected functions
- ✅ Server registration with 15 MNEE fee prevents spam
- ✅ Evidence stored on IPFS (immutable)
- ⏳ Audit pending

## 🛣️ Roadmap

### ✅ Phase 1: Core Protocol
- [x] Smart contract implementation
- [x] ERC-20 escrow with MNEE
- [x] API server with contract interactions
- [x] Discord bot integration

### ✅ Phase 2: AI Integration
- [x] GitHub Code Diff agent
- [x] Visual Design agent
- [x] Document/Research agent
- [x] IPFS evidence storage (Pinata)

### 📋 Phase 3: Decentralization (Planned)
- [ ] Kleros arbitration integration
- [ ] Reputation oracle (federated signers)
- [ ] Multi-chain deployment (Base, Arbitrum)
- [ ] DAO governance

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - see [LICENSE](./LICENSE) for details

## 🔗 Links

- **Documentation**: [PROTOCOL.md](./commit-protocol/PROTOCOL.md)
- **Whitepaper**: [commit_protocol.pdf](./commit-protocol/commit_protocol.pdf)
- **MNEE Token**: [Etherscan](https://etherscan.io/token/0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF)

---

**Built with**: Solidity • TypeScript • Node.js • MongoDB • Foundry • OpenZeppelin • IPFS • Gemini AI