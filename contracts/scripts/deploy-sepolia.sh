#!/bin/bash
# =============================================================================
# SEPOLIA TESTNET DEPLOYMENT SCRIPT
# =============================================================================
#
# This script deploys MockMNEE + Commit contracts to Sepolia testnet
#
# Prerequisites:
#   1. Get Sepolia ETH from faucet: https://sepoliafaucet.com
#   2. Set up environment variables in contracts/.env file
#   3. Run this script from contracts/ or contracts/scripts/
#
# Usage:
#   ./scripts/deploy-sepolia.sh   (from contracts/)
#   ./deploy-sepolia.sh           (from contracts/scripts/)
#
# =============================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

echo -e "${CYAN}"
echo "============================================="
echo "   SEPOLIA TESTNET DEPLOYMENT"
echo "============================================="
echo -e "${NC}"

# Determine the contracts directory (script might be run from contracts/ or contracts/scripts/)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [[ "$SCRIPT_DIR" == */scripts ]]; then
    CONTRACTS_DIR="$(dirname "$SCRIPT_DIR")"
else
    CONTRACTS_DIR="$SCRIPT_DIR"
fi

cd "$CONTRACTS_DIR"
echo -e "Working directory: ${CYAN}$CONTRACTS_DIR${NC}"
echo ""

# Check for .env file
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}No .env file found. Creating template...${NC}"
    cat > .env << 'EOF'
# Sepolia RPC URL (get from Infura/Alchemy)
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID

# Deployer private key (with Sepolia ETH)
DEPLOYER_PRIVATE_KEY=0x...

# Relayer address (bot wallet that signs transactions)
# Can be same as deployer, or a different address
RELAYER_ADDRESS=0x...

# Arbitrator address (for dispute resolution)
ARBITRATOR_ADDRESS=0x...

# Etherscan API key (for contract verification)
ETHERSCAN_API_KEY=...
EOF
    echo -e "${RED}Please fill in .env file and run again!${NC}"
    exit 1
fi

# Load environment
source .env

# Validate required variables
if [[ -z "$SEPOLIA_RPC_URL" || "$SEPOLIA_RPC_URL" == *"YOUR_PROJECT_ID"* ]]; then
    echo -e "${RED}Error: SEPOLIA_RPC_URL not configured in .env${NC}"
    exit 1
fi

if [[ -z "$DEPLOYER_PRIVATE_KEY" || "$DEPLOYER_PRIVATE_KEY" == "0x..." ]]; then
    echo -e "${RED}Error: DEPLOYER_PRIVATE_KEY not configured in .env${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Environment loaded${NC}"
echo ""

# Check deployer balance
DEPLOYER_ADDRESS=$(cast wallet address $DEPLOYER_PRIVATE_KEY)
echo -e "Deployer address: ${CYAN}$DEPLOYER_ADDRESS${NC}"

BALANCE=$(cast balance $DEPLOYER_ADDRESS --rpc-url $SEPOLIA_RPC_URL)
echo -e "Deployer balance: ${CYAN}$BALANCE${NC} wei"
echo ""

if [ "$BALANCE" == "0" ]; then
    echo -e "${RED}Error: Deployer has no Sepolia ETH!${NC}"
    echo -e "Get some from: ${CYAN}https://sepoliafaucet.com${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Deployer has funds${NC}"
echo ""

# Deploy
echo -e "${YELLOW}Deploying contracts...${NC}"
echo ""

forge script script/DeploySepolia.s.sol:DeploySepolia \
    --rpc-url $SEPOLIA_RPC_URL \
    --broadcast \
    ${ETHERSCAN_API_KEY:+--verify --etherscan-api-key $ETHERSCAN_API_KEY}

echo ""
echo -e "${GREEN}============================================="
echo "   DEPLOYMENT SUCCESSFUL!"
echo "=============================================${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Copy the contract addresses from above"
echo "2. Update server/.env with the addresses"
echo "3. Update frontend/.env.local with the addresses"
echo "4. Update bot/.env with the addresses"
echo "5. Restart all services"
echo ""
echo -e "${CYAN}Faucet URL (after server is running):${NC}"
echo "POST http://localhost:3001/faucet"
echo ""
