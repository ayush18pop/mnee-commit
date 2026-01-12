# Sepolia Testnet Deployment Guide

> Deploy and test the Commit Protocol on Sepolia testnet with MockMNEE tokens.

## Prerequisites

1. **Sepolia ETH** - Get from [Sepolia Faucet](https://sepoliafaucet.com)
2. **RPC URL** - Get from [Infura](https://infura.io) or [Alchemy](https://alchemy.com)
3. **Foundry** - Install via `curl -L https://foundry.paradigm.xyz | bash`

## Quick Start

### 1. Configure Environment

```bash
cd contracts
cp .env.sepolia.example .env

# Edit .env with your values:
# - SEPOLIA_RPC_URL
# - DEPLOYER_PRIVATE_KEY
# - RELAYER_ADDRESS
```

### 2. Deploy Contracts

```bash
# Option A: Use the deploy script
./scripts/deploy-sepolia.sh

# Option B: Manual deployment
forge script script/DeploySepolia.s.sol:DeploySepolia \
  --rpc-url $SEPOLIA_RPC_URL \
  --broadcast \
  --verify \
  --etherscan-api-key $ETHERSCAN_API_KEY
```

### 3. Update Configuration

After deployment, copy the contract addresses to all config files:

**server/.env**
```
TESTNET_MODE=true
RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
CHAIN_ID=11155111
CONTRACT_ADDRESS=<from deploy output>
MNEE_TOKEN_ADDRESS=<from deploy output>
RELAYER_PRIVATE_KEY=<your relayer private key>
```

**frontend/.env.local**
```
NEXT_PUBLIC_TESTNET_MODE=true
NEXT_PUBLIC_COMMIT_CONTRACT_ADDRESS=<from deploy output>
NEXT_PUBLIC_MNEE_TOKEN_ADDRESS=<from deploy output>
```

**bot/.env**
```
TESTNET_MODE=true
CONTRACT_ADDRESS=<from deploy output>
MNEE_TOKEN_ADDRESS=<from deploy output>
RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY
```

### 4. Start Services

```bash
# Terminal 1: Server
cd server && npm run dev

# Terminal 2: Frontend  
cd frontend && npm run dev

# Terminal 3: Bot
cd bot && node index.js
```

### 5. Get Test Tokens

**Via API:**
```bash
curl -X POST http://localhost:3001/faucet \
  -H "Content-Type: application/json" \
  -d '{"address": "0xYOUR_WALLET", "amount": 1000}'
```

**Via Frontend:**
- Go to `/register` page
- Connect wallet
- Use the faucet button that appears

## Testing with Discord Bot

### Register Server
```
/register-server
```

### Deposit MNEE
```
/deposit 100
```

### Create Commitment
```
/commit @user 10 "Build a landing page" 7d
```

### Submit Work
```
/submit 1 https://ipfs.io/ipfs/YOUR_EVIDENCE_CID
```

### Check Status
```
/status 1
```

## Contract Addresses

After deployment, contracts will be at:

| Contract | Address |
|----------|---------|
| MockMNEE | `<deployed address>` |
| Commit   | `<deployed address>` |

## Troubleshooting

### "Insufficient funds" on deployment
Get more Sepolia ETH from the faucet.

### "Invalid RPC URL"
Make sure your Infura/Alchemy project is on Sepolia network.

### "Faucet not working"
Check that `TESTNET_MODE=true` in server/.env and server is running.

### "Transaction failed"
Check that the relayer (bot wallet) has Sepolia ETH for gas.

## Network Details

| Parameter | Value |
|-----------|-------|
| Network | Sepolia |
| Chain ID | 11155111 |
| RPC | `https://sepolia.infura.io/v3/...` |
| Block Explorer | https://sepolia.etherscan.io |
