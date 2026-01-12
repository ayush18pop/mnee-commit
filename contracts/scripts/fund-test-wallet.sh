#!/bin/bash

# Quick script to fund test wallet with MNEE tokens
# Usage: ./fund-test-wallet.sh [amount_in_mnee] [recipient_address]

set -e

# MNEE Token Contract
MNEE_TOKEN="0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF"

# Known MNEE holder (AscendEX 7 with ~162k MNEE)
MNEE_HOLDER="0x4240781A9ebDB2EB14a183466E8820978b7DA4e2"

# Default recipient (first Anvil test account)
RECIPIENT="${2:-0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266}"

# Amount in MNEE (default: 1000 MNEE)
AMOUNT_MNEE="${1:-1000}"

# Convert to wei using cast
AMOUNT_WEI=$(cast to-wei $AMOUNT_MNEE ether)

# RPC URL
RPC_URL="http://127.0.0.1:8545"

echo "=== Funding Test Wallet with MNEE ==="
echo ""
echo "MNEE Token: $MNEE_TOKEN"
echo "From: $MNEE_HOLDER (AscendEX 7)"
echo "To: $RECIPIENT"
echo "Amount: $AMOUNT_MNEE MNEE"
echo ""

# Impersonate holder
echo "Impersonating MNEE holder..."
cast rpc anvil_impersonateAccount $MNEE_HOLDER --rpc-url $RPC_URL > /dev/null

# Transfer tokens
echo "Transferring $AMOUNT_MNEE MNEE..."
TX=$(cast send $MNEE_TOKEN \
    "transfer(address,uint256)(bool)" \
    $RECIPIENT \
    $AMOUNT_WEI \
    --from $MNEE_HOLDER \
    --rpc-url $RPC_URL \
    --unlocked 2>&1)

# Stop impersonating
cast rpc anvil_stopImpersonatingAccount $MNEE_HOLDER --rpc-url $RPC_URL > /dev/null

# Check new balance
echo ""
echo "Verifying transfer..."
NEW_BALANCE=$(cast call $MNEE_TOKEN "balanceOf(address)(uint256)" $RECIPIENT --rpc-url $RPC_URL)

echo ""
echo "✅ Success!"
echo "New balance: $NEW_BALANCE wei"
echo "That's $AMOUNT_MNEE MNEE tokens"
echo ""
echo "You can now use MNEE tokens with wallet: $RECIPIENT"