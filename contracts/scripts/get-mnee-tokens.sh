#!/bin/bash

# Get MNEE tokens for testing on local Anvil fork
# This script impersonates a MNEE holder and transfers tokens to test accounts

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# MNEE Token Contract
MNEE_TOKEN="0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF"

# Default test account (first account from Anvil)
RECIPIENT="${1:-0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266}"

# Amount to transfer (default: 1000 MNEE = 1000 * 10^18)
AMOUNT="${2:-1000000000000000000000}"

# RPC URL (default: local Anvil)
RPC_URL="${3:-http://127.0.0.1:8545}"

echo -e "${YELLOW}=== Getting MNEE Tokens for Testing ===${NC}"
echo ""
echo "MNEE Token: $MNEE_TOKEN"
echo "Recipient: $RECIPIENT"
echo "Amount: $AMOUNT (wei)"
echo "RPC: $RPC_URL"
echo ""

# Find a MNEE holder with significant balance
# These are known MNEE holders on mainnet (you can verify on Etherscan)
# Using the top holder or a known liquidity pool
MNEE_HOLDER="0x1234567890123456789012345678901234567890"  # Placeholder - will find actual holder

echo "Step 1: Finding MNEE token holder..."

# Try to find the top holder by checking a few known addresses
# You can get these from Etherscan's token holders page
# For now, we'll use a generic approach to find any holder

# Alternative: Use a known large holder address
# Check Etherscan for MNEE token holders: https://etherscan.io/token/0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF#balances

# Let's try some common holder addresses (update these with actual MNEE holders)
POTENTIAL_HOLDERS=(
    "0x1111111254EEB25477B68fb85Ed929f73A960582"  # 1inch router (often holds tokens)
    "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"  # Uniswap V2 Router
    "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45"  # Uniswap V3 Router
)

MNEE_HOLDER=""
for holder in "${POTENTIAL_HOLDERS[@]}"; do
    balance=$(cast call $MNEE_TOKEN "balanceOf(address)(uint256)" $holder --rpc-url $RPC_URL 2>/dev/null || echo "0")
    if [ "$balance" != "0" ] && [ "$balance" != "" ]; then
        echo -e "${GREEN}Found holder with balance: $holder${NC}"
        MNEE_HOLDER=$holder
        break
    fi
done

if [ -z "$MNEE_HOLDER" ]; then
    echo ""
    echo "Could not find a MNEE holder automatically."
    echo "Please find a MNEE holder address from Etherscan:"
    echo "https://etherscan.io/token/0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF#balances"
    echo ""
    read -p "Enter MNEE holder address: " MNEE_HOLDER
fi

echo ""
echo "Step 2: Checking holder balance..."
HOLDER_BALANCE=$(cast call $MNEE_TOKEN "balanceOf(address)(uint256)" $MNEE_HOLDER --rpc-url $RPC_URL)
echo "Holder balance: $HOLDER_BALANCE wei"

if [ "$HOLDER_BALANCE" = "0" ]; then
    echo "Error: Holder has no MNEE tokens"
    exit 1
fi

echo ""
echo "Step 3: Impersonating holder and transferring tokens..."

# Impersonate the holder and transfer tokens
cast rpc anvil_impersonateAccount $MNEE_HOLDER --rpc-url $RPC_URL

# Transfer tokens
cast send $MNEE_TOKEN \
    "transfer(address,uint256)(bool)" \
    $RECIPIENT \
    $AMOUNT \
    --from $MNEE_HOLDER \
    --rpc-url $RPC_URL \
    --unlocked

# Stop impersonating
cast rpc anvil_stopImpersonatingAccount $MNEE_HOLDER --rpc-url $RPC_URL

echo ""
echo "Step 4: Verifying transfer..."
NEW_BALANCE=$(cast call $MNEE_TOKEN "balanceOf(address)(uint256)" $RECIPIENT --rpc-url $RPC_URL)
echo -e "${GREEN}New balance of $RECIPIENT: $NEW_BALANCE wei${NC}"

# Convert to human-readable format (MNEE has 18 decimals)
HUMAN_BALANCE=$(echo "scale=4; $NEW_BALANCE / 1000000000000000000" | bc)
echo -e "${GREEN}That's approximately $HUMAN_BALANCE MNEE${NC}"

echo ""
echo -e "${GREEN}=== Success! ===${NC}"
echo "You can now use MNEE tokens with address: $RECIPIENT"
