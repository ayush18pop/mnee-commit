# Commit Protocol - Scripts

Scripts for local development and comprehensive testing of the Commit Protocol.

## Quick Start

```bash
cd contracts/scripts

# Option A: All-in-one setup
./setup-local.sh

# Option B: Manual step-by-step
./start-anvil.sh
./deploy.sh
./fund-wallets.sh
```

## Scripts

| Script | Purpose |
|--------|---------|
| `setup-local.sh` | **All-in-one**: Starts Anvil, deploys contracts, updates .env files, funds wallets |
| `start-anvil.sh` | Starts Anvil with Ethereum mainnet fork |
| `deploy.sh` | Deploys Commit Protocol contracts |
| `fund-wallets.sh` | Funds test wallets with 10,000 MNEE each |
| `test-full.sh` | **Comprehensive test suite** - Tests all contract functions |

## Comprehensive Testing

Run the full test suite to verify all contract functions:

```bash
./test-full.sh
```

This script tests:
- **Phase 1**: Setup (Anvil, deployment, wallet funding)
- **Phase 2**: Server registration (`registerServer`, `depositToServer`, `getServerBalance`)
- **Phase 3**: Commitment lifecycle (`createCommitment`, `submitWork`, `settle`, `batchSettle`)
- **Phase 4**: Dispute flow (`openDispute`, `resolveDispute` for both outcomes)
- **Phase 5**: Admin functions (`setBaseStake`, `setArbitrator`, `setRelayer`, etc.)
- **Phase 6**: View functions (all getters and state queries)

Output includes a test report with pass/fail counts.

## Test Accounts

| Role | Address | Private Key |
|------|---------|-------------|
| Deployer | `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266` | `0xac0974...` |
| Arbitrator | `0x70997970C51812dc3A010C7d01b50e0d17dc79C8` | `0x59c699...` |
| Relayer | `0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC` | `0x5de411...` |
| Contributor | `0x90F79bf6EB2c4f870365E785982E1f101E93b906` | `0x7c8521...` |

**⚠️ FOR DEVELOPMENT ONLY - DO NOT USE IN PRODUCTION**

## Stopping Anvil

```bash
# Using saved PID
kill $(cat .anvil.pid)

# Or kill all
pkill -f anvil
```

## Troubleshooting

```bash
# Port 8545 in use
lsof -ti:8545 | xargs kill -9
./start-anvil.sh

# Check MNEE balance
cast call 0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF \
  "balanceOf(address)(uint256)" \
  0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 \
  --rpc-url http://localhost:8545
```
