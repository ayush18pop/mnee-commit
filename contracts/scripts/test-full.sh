#!/bin/bash

# ============================================================================
# COMMIT PROTOCOL - COMPREHENSIVE TEST SCRIPT
# ============================================================================
# This script performs full end-to-end testing of all Commit Protocol functions
# with proper time pauses between operations.
#
# Usage: ./test-full.sh
# ============================================================================

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color

# Change to the contracts directory
cd "$(dirname "$0")/.."

# Test counters
TESTS_PASSED=0
TESTS_FAILED=0
START_TIME=$(date +%s)

# ============================================================================
# Helper Functions
# ============================================================================

log_section() {
    echo ""
    echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║  $1${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

log_test() {
    echo -e "${YELLOW}[TEST]${NC} $1"
}

log_success() {
    echo -e "${GREEN}✓ PASS${NC}: $1"
    ((TESTS_PASSED++))
}

log_fail() {
    echo -e "${RED}✗ FAIL${NC}: $1"
    ((TESTS_FAILED++))
}

log_info() {
    echo -e "${CYAN}[INFO]${NC} $1"
}

pause() {
    local seconds=${1:-2}
    log_info "Waiting ${seconds}s for state propagation..."
    sleep $seconds
}

# ============================================================================
# Configuration
# ============================================================================

RPC_URL="http://127.0.0.1:8545"
MNEE_TOKEN="0x8ccedbAe4916b79da7F3F612EfB2EB93A2bFD6cF"
MNEE_HOLDER="0x4240781A9ebDB2EB14a183466E8820978b7DA4e2"

# Anvil default accounts
DEPLOYER="0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
DEPLOYER_KEY="0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"

ARBITRATOR="0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
ARBITRATOR_KEY="0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d"

RELAYER="0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"
RELAYER_KEY="0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a"

CONTRIBUTOR="0x90F79bf6EB2c4f870365E785982E1f101E93b906"
CONTRIBUTOR_KEY="0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6"

# Test parameters
GUILD_ID="1234567890123456789"
ADMIN_DISCORD_ID="987654321098765432"

# Contract address (will be set during deployment)
CONTRACT_ADDRESS=""

# ============================================================================
# Test Report Generation
# ============================================================================

generate_report() {
    local END_TIME=$(date +%s)
    local DURATION=$((END_TIME - START_TIME))
    local TOTAL_TESTS=$((TESTS_PASSED + TESTS_FAILED))
    
    echo ""
    echo -e "${MAGENTA}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${MAGENTA}║                    TEST REPORT                              ║${NC}"
    echo -e "${MAGENTA}╠════════════════════════════════════════════════════════════╣${NC}"
    echo -e "${MAGENTA}║${NC}  Contract Address:    ${CONTRACT_ADDRESS}${MAGENTA}  ║${NC}"
    echo -e "${MAGENTA}║${NC}  MNEE Token:          ${MNEE_TOKEN}${MAGENTA}  ║${NC}"
    echo -e "${MAGENTA}╠════════════════════════════════════════════════════════════╣${NC}"
    echo -e "${MAGENTA}║${NC}  Tests Passed:        ${GREEN}${TESTS_PASSED}${NC}${MAGENTA}                                        ║${NC}"
    echo -e "${MAGENTA}║${NC}  Tests Failed:        ${RED}${TESTS_FAILED}${NC}${MAGENTA}                                        ║${NC}"
    echo -e "${MAGENTA}║${NC}  Total Tests:         ${TOTAL_TESTS}${MAGENTA}                                        ║${NC}"
    echo -e "${MAGENTA}║${NC}  Duration:            ${DURATION}s${MAGENTA}                                       ║${NC}"
    echo -e "${MAGENTA}╠════════════════════════════════════════════════════════════╣${NC}"
    
    if [ $TESTS_FAILED -eq 0 ]; then
        echo -e "${MAGENTA}║${NC}               ${GREEN}ALL TESTS PASSED! 🎉${NC}${MAGENTA}                        ║${NC}"
    else
        echo -e "${MAGENTA}║${NC}          ${RED}SOME TESTS FAILED - CHECK LOGS${NC}${MAGENTA}                  ║${NC}"
    fi
    
    echo -e "${MAGENTA}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

# ============================================================================
# PHASE 1: SETUP
# ============================================================================

setup_phase() {
    log_section "PHASE 1: SETUP"
    
    # ------------------------------------------------------
    # 1.1 Check/Start Anvil
    # ------------------------------------------------------
    log_test "Checking if Anvil is running..."
    
    if curl -s -X POST -H "Content-Type: application/json" \
        --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
        $RPC_URL > /dev/null 2>&1; then
        log_success "Anvil is already running"
    else
        log_info "Starting Anvil with mainnet fork..."
        
        # Load .env
        if [ -f .env ]; then
            export $(cat .env | grep -v '^#' | xargs)
        fi
        
        if [ -z "$ETH_MAINNET_RPC_URL" ]; then
            log_fail "ETH_MAINNET_RPC_URL not set in .env"
            return 1
        fi
        
        # Kill existing and start new
        pkill -f "anvil" || true
        sleep 2
        
        anvil \
            --fork-url "$ETH_MAINNET_RPC_URL" \
            --chain-id 1 \
            --accounts 10 \
            --balance 10000 \
            --port 8545 \
            --host 0.0.0.0 \
            > anvil.log 2>&1 &
        
        echo $! > .anvil.pid
        
        # Wait for Anvil
        for i in {1..30}; do
            if curl -s -X POST -H "Content-Type: application/json" \
                --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
                $RPC_URL > /dev/null 2>&1; then
                break
            fi
            sleep 1
        done
        
        log_success "Anvil started (PID: $(cat .anvil.pid))"
    fi
    
    pause 2
    
    # ------------------------------------------------------
    # 1.2 Deploy Contracts
    # ------------------------------------------------------
    log_test "Deploying Commit Protocol contracts..."
    
    DEPLOY_OUTPUT=$(forge script script/DeployLocal.s.sol:DeployLocal \
        --rpc-url $RPC_URL \
        --broadcast \
        -vvv 2>&1)
    
    # Extract contract address
    CONTRACT_ADDRESS=$(echo "$DEPLOY_OUTPUT" | grep -oP 'Commit Protocol: \K0x[a-fA-F0-9]{40}' | head -1)
    
    if [ -z "$CONTRACT_ADDRESS" ]; then
        # Try alternative patterns
        CONTRACT_ADDRESS=$(echo "$DEPLOY_OUTPUT" | grep -oP '0x[a-fA-F0-9]{40}' | tail -1)
    fi
    
    if [ -n "$CONTRACT_ADDRESS" ]; then
        log_success "Contract deployed at: $CONTRACT_ADDRESS"
    else
        log_fail "Could not extract contract address"
        echo "$DEPLOY_OUTPUT"
        return 1
    fi
    
    pause 3
    
    # ------------------------------------------------------
    # 1.3 Fund Test Wallets with MNEE
    # ------------------------------------------------------
    log_test "Funding test wallets with MNEE..."
    
    AMOUNT="100000000000000000000000"  # 100,000 MNEE
    
    fund_wallet() {
        local RECIPIENT=$1
        local NAME=$2
        
        cast rpc anvil_impersonateAccount $MNEE_HOLDER --rpc-url $RPC_URL > /dev/null 2>&1
        
        cast send $MNEE_TOKEN \
            "transfer(address,uint256)(bool)" \
            $RECIPIENT \
            $AMOUNT \
            --from $MNEE_HOLDER \
            --rpc-url $RPC_URL \
            --unlocked > /dev/null 2>&1
        
        cast rpc anvil_stopImpersonatingAccount $MNEE_HOLDER --rpc-url $RPC_URL > /dev/null 2>&1
        
        echo "  Funded $NAME"
    }
    
    fund_wallet $DEPLOYER "Deployer"
    fund_wallet $ARBITRATOR "Arbitrator"
    fund_wallet $RELAYER "Relayer"
    fund_wallet $CONTRIBUTOR "Contributor"
    
    log_success "All wallets funded with 100,000 MNEE each"
    
    pause 2
}

# ============================================================================
# PHASE 2: SERVER REGISTRATION TESTS
# ============================================================================

server_registration_tests() {
    log_section "PHASE 2: SERVER REGISTRATION TESTS"
    
    # ------------------------------------------------------
    # 2.1 Test registerServer()
    # ------------------------------------------------------
    log_test "registerServer() - Register Discord server..."
    
    # Approve MNEE for registration fee (15 MNEE)
    cast send $MNEE_TOKEN "approve(address,uint256)" $CONTRACT_ADDRESS 15000000000000000000 \
        --private-key $DEPLOYER_KEY \
        --rpc-url $RPC_URL > /dev/null 2>&1
    
    # Register server
    REGISTER_RESULT=$(cast send $CONTRACT_ADDRESS \
        "registerServer(uint256,uint256)" \
        $GUILD_ID \
        $ADMIN_DISCORD_ID \
        --private-key $DEPLOYER_KEY \
        --rpc-url $RPC_URL 2>&1)
    
    if echo "$REGISTER_RESULT" | grep -q "transactionHash"; then
        log_success "registerServer() - Server registered successfully"
    else
        log_fail "registerServer() - $REGISTER_RESULT"
    fi
    
    pause 2
    
    # ------------------------------------------------------
    # 2.2 Test depositToServer()
    # ------------------------------------------------------
    log_test "depositToServer() - Deposit 1000 MNEE to server..."
    
    DEPOSIT_AMOUNT="1000000000000000000000"  # 1000 MNEE
    
    cast send $MNEE_TOKEN "approve(address,uint256)" $CONTRACT_ADDRESS $DEPOSIT_AMOUNT \
        --private-key $DEPLOYER_KEY \
        --rpc-url $RPC_URL > /dev/null 2>&1
    
    DEPOSIT_RESULT=$(cast send $CONTRACT_ADDRESS \
        "depositToServer(uint256,uint256)" \
        $GUILD_ID \
        $DEPOSIT_AMOUNT \
        --private-key $DEPLOYER_KEY \
        --rpc-url $RPC_URL 2>&1)
    
    if echo "$DEPOSIT_RESULT" | grep -q "transactionHash"; then
        log_success "depositToServer() - 1000 MNEE deposited"
    else
        log_fail "depositToServer() - $DEPOSIT_RESULT"
    fi
    
    pause 2
    
    # ------------------------------------------------------
    # 2.3 Test getServerBalance()
    # ------------------------------------------------------
    log_test "getServerBalance() - Check server balance..."
    
    BALANCE_RESULT=$(cast call $CONTRACT_ADDRESS \
        "getServerBalance(uint256)(uint256,uint256,uint256)" \
        $GUILD_ID \
        --rpc-url $RPC_URL 2>&1)
    
    if echo "$BALANCE_RESULT" | grep -q "[0-9]"; then
        log_success "getServerBalance() - Balance: $BALANCE_RESULT"
    else
        log_fail "getServerBalance() - $BALANCE_RESULT"
    fi
    
    pause 1
}

# ============================================================================
# PHASE 3: COMMITMENT LIFECYCLE TESTS
# ============================================================================

commitment_lifecycle_tests() {
    log_section "PHASE 3: COMMITMENT LIFECYCLE TESTS"
    
    # ------------------------------------------------------
    # 3.1 Test createCommitment()
    # ------------------------------------------------------
    log_test "createCommitment() - Create a new commitment..."
    
    local DEADLINE=$(($(date +%s) + 3600))  # 1 hour from now
    local DISPUTE_WINDOW=10  # 10 seconds for testing
    local AMOUNT="100000000000000000000"  # 100 MNEE
    
    CREATE_RESULT=$(cast send $CONTRACT_ADDRESS \
        "createCommitment(uint256,address,address,uint256,uint256,uint256,string)" \
        $GUILD_ID \
        $CONTRIBUTOR \
        $MNEE_TOKEN \
        $AMOUNT \
        $DEADLINE \
        $DISPUTE_WINDOW \
        "QmTestSpecification" \
        --private-key $RELAYER_KEY \
        --rpc-url $RPC_URL 2>&1)
    
    if echo "$CREATE_RESULT" | grep -q "transactionHash"; then
        log_success "createCommitment() - Commitment #1 created"
    else
        log_fail "createCommitment() - $CREATE_RESULT"
    fi
    
    pause 2
    
    # ------------------------------------------------------
    # 3.2 Test getCommitment()
    # ------------------------------------------------------
    log_test "getCommitment() - Get commitment details..."
    
    COMMIT_RESULT=$(cast call $CONTRACT_ADDRESS \
        "getCommitment(uint256)" \
        1 \
        --rpc-url $RPC_URL 2>&1)
    
    if echo "$COMMIT_RESULT" | grep -q "0x"; then
        log_success "getCommitment() - Data retrieved successfully"
    else
        log_fail "getCommitment() - $COMMIT_RESULT"
    fi
    
    pause 1
    
    # ------------------------------------------------------
    # 3.3 Test submitWork()
    # ------------------------------------------------------
    log_test "submitWork() - Submit work for commitment..."
    
    SUBMIT_RESULT=$(cast send $CONTRACT_ADDRESS \
        "submitWork(uint256,uint256,string)" \
        $GUILD_ID \
        1 \
        "QmTestEvidence123" \
        --private-key $RELAYER_KEY \
        --rpc-url $RPC_URL 2>&1)
    
    if echo "$SUBMIT_RESULT" | grep -q "transactionHash"; then
        log_success "submitWork() - Work submitted for commitment #1"
    else
        log_fail "submitWork() - $SUBMIT_RESULT"
    fi
    
    pause 2
    
    # ------------------------------------------------------
    # 3.4 Test canSettle() - Should be false (window not closed)
    # ------------------------------------------------------
    log_test "canSettle() - Check if settleable (should be false)..."
    
    CAN_SETTLE=$(cast call $CONTRACT_ADDRESS \
        "canSettle(uint256)(bool)" \
        1 \
        --rpc-url $RPC_URL 2>&1)
    
    if echo "$CAN_SETTLE" | grep -q "false"; then
        log_success "canSettle() - Returns false (dispute window active)"
    else
        log_fail "canSettle() - Expected false, got: $CAN_SETTLE"
    fi
    
    # Wait for dispute window to close
    log_info "Waiting 12s for dispute window to close..."
    sleep 12
    
    # ------------------------------------------------------
    # 3.5 Test canSettle() - Should be true now
    # ------------------------------------------------------
    log_test "canSettle() - Check if settleable (should be true)..."
    
    CAN_SETTLE2=$(cast call $CONTRACT_ADDRESS \
        "canSettle(uint256)(bool)" \
        1 \
        --rpc-url $RPC_URL 2>&1)
    
    if echo "$CAN_SETTLE2" | grep -q "true"; then
        log_success "canSettle() - Returns true (ready to settle)"
    else
        log_fail "canSettle() - Expected true, got: $CAN_SETTLE2"
    fi
    
    # ------------------------------------------------------
    # 3.6 Test settle() - Owner settles commitment
    # ------------------------------------------------------
    log_test "settle() - Owner settles commitment #1..."
    
    SETTLE_RESULT=$(cast send $CONTRACT_ADDRESS \
        "settle(uint256)" \
        1 \
        --private-key $DEPLOYER_KEY \
        --rpc-url $RPC_URL 2>&1)
    
    if echo "$SETTLE_RESULT" | grep -q "transactionHash"; then
        log_success "settle() - Commitment #1 settled"
    else
        log_fail "settle() - $SETTLE_RESULT"
    fi
    
    pause 2
    
    # ------------------------------------------------------
    # 3.7 Test batchSettle() - Create and settle multiple
    # ------------------------------------------------------
    log_test "batchSettle() - Create and batch settle commitments..."
    
    # Create commitments 2 and 3
    local DEADLINE2=$(($(date +%s) + 3600))
    local AMOUNT2="50000000000000000000"  # 50 MNEE each
    
    for i in 2 3; do
        cast send $CONTRACT_ADDRESS \
            "createCommitment(uint256,address,address,uint256,uint256,uint256,string)" \
            $GUILD_ID $CONTRIBUTOR $MNEE_TOKEN $AMOUNT2 $DEADLINE2 5 "QmSpec$i" \
            --private-key $RELAYER_KEY \
            --rpc-url $RPC_URL > /dev/null 2>&1
        
        cast send $CONTRACT_ADDRESS \
            "submitWork(uint256,uint256,string)" \
            $GUILD_ID $i "QmEvidence$i" \
            --private-key $RELAYER_KEY \
            --rpc-url $RPC_URL > /dev/null 2>&1
    done
    
    log_info "Created and submitted commitments #2 and #3"
    log_info "Waiting 8s for dispute window..."
    sleep 8
    
    BATCH_RESULT=$(cast send $CONTRACT_ADDRESS \
        "batchSettle(uint256[])" \
        "[2,3]" \
        --private-key $RELAYER_KEY \
        --rpc-url $RPC_URL 2>&1)
    
    if echo "$BATCH_RESULT" | grep -q "transactionHash"; then
        log_success "batchSettle() - Commitments #2 and #3 settled"
    else
        log_fail "batchSettle() - $BATCH_RESULT"
    fi
    
    pause 2
}

# ============================================================================
# PHASE 4: DISPUTE FLOW TESTS
# ============================================================================

dispute_flow_tests() {
    log_section "PHASE 4: DISPUTE FLOW TESTS"
    
    # Create commitment #4 for dispute testing
    log_test "Creating commitment #4 for dispute testing..."
    
    local DEADLINE=$(($(date +%s) + 3600))
    local DISPUTE_WINDOW=60  # Longer window for dispute test
    local AMOUNT="100000000000000000000"  # 100 MNEE
    
    cast send $CONTRACT_ADDRESS \
        "createCommitment(uint256,address,address,uint256,uint256,uint256,string)" \
        $GUILD_ID $CONTRIBUTOR $MNEE_TOKEN $AMOUNT $DEADLINE $DISPUTE_WINDOW "QmSpec4" \
        --private-key $RELAYER_KEY \
        --rpc-url $RPC_URL > /dev/null 2>&1
    
    cast send $CONTRACT_ADDRESS \
        "submitWork(uint256,uint256,string)" \
        $GUILD_ID 4 "QmEvidence4" \
        --private-key $RELAYER_KEY \
        --rpc-url $RPC_URL > /dev/null 2>&1
    
    log_success "Commitment #4 created and submitted"
    
    pause 2
    
    # Deposit more to server for dispute stake
    cast send $MNEE_TOKEN "approve(address,uint256)" $CONTRACT_ADDRESS $AMOUNT \
        --private-key $DEPLOYER_KEY \
        --rpc-url $RPC_URL > /dev/null 2>&1
    
    cast send $CONTRACT_ADDRESS \
        "depositToServer(uint256,uint256)" \
        $GUILD_ID \
        $AMOUNT \
        --private-key $DEPLOYER_KEY \
        --rpc-url $RPC_URL > /dev/null 2>&1
    
    log_info "Deposited additional 100 MNEE for dispute stake"
    
    pause 2
    
    # ------------------------------------------------------
    # 4.1 Test openDispute()
    # ------------------------------------------------------
    log_test "openDispute() - Open dispute on commitment #4..."
    
    DISPUTE_RESULT=$(cast send $CONTRACT_ADDRESS \
        "openDispute(uint256,uint256)" \
        $GUILD_ID \
        4 \
        --private-key $RELAYER_KEY \
        --rpc-url $RPC_URL 2>&1)
    
    if echo "$DISPUTE_RESULT" | grep -q "transactionHash"; then
        log_success "openDispute() - Dispute opened on commitment #4"
    else
        log_fail "openDispute() - $DISPUTE_RESULT"
    fi
    
    pause 2
    
    # ------------------------------------------------------
    # 4.2 Test getDispute()
    # ------------------------------------------------------
    log_test "getDispute() - Get dispute details..."
    
    DISPUTE_DATA=$(cast call $CONTRACT_ADDRESS \
        "getDispute(uint256)" \
        4 \
        --rpc-url $RPC_URL 2>&1)
    
    if echo "$DISPUTE_DATA" | grep -q "0x"; then
        log_success "getDispute() - Dispute data retrieved"
    else
        log_fail "getDispute() - $DISPUTE_DATA"
    fi
    
    pause 1
    
    # ------------------------------------------------------
    # 4.3 Test resolveDispute() - Favor Contributor
    # ------------------------------------------------------
    log_test "resolveDispute() - Resolve favoring contributor..."
    
    RESOLVE_RESULT=$(cast send $CONTRACT_ADDRESS \
        "resolveDispute(uint256,bool)" \
        4 \
        true \
        --private-key $ARBITRATOR_KEY \
        --rpc-url $RPC_URL 2>&1)
    
    if echo "$RESOLVE_RESULT" | grep -q "transactionHash"; then
        log_success "resolveDispute() - Resolved in favor of contributor"
    else
        log_fail "resolveDispute() - $RESOLVE_RESULT"
    fi
    
    pause 2
    
    # ------------------------------------------------------
    # 4.4 Test resolveDispute() - Favor Creator (Refund)
    # ------------------------------------------------------
    log_test "Creating commitment #5 for refund test..."
    
    cast send $CONTRACT_ADDRESS \
        "createCommitment(uint256,address,address,uint256,uint256,uint256,string)" \
        $GUILD_ID $CONTRIBUTOR $MNEE_TOKEN $AMOUNT $DEADLINE $DISPUTE_WINDOW "QmSpec5" \
        --private-key $RELAYER_KEY \
        --rpc-url $RPC_URL > /dev/null 2>&1
    
    cast send $CONTRACT_ADDRESS \
        "submitWork(uint256,uint256,string)" \
        $GUILD_ID 5 "QmEvidence5" \
        --private-key $RELAYER_KEY \
        --rpc-url $RPC_URL > /dev/null 2>&1
    
    # Deposit more for dispute stake
    cast send $MNEE_TOKEN "approve(address,uint256)" $CONTRACT_ADDRESS $AMOUNT \
        --private-key $DEPLOYER_KEY \
        --rpc-url $RPC_URL > /dev/null 2>&1
    
    cast send $CONTRACT_ADDRESS \
        "depositToServer(uint256,uint256)" \
        $GUILD_ID \
        $AMOUNT \
        --private-key $DEPLOYER_KEY \
        --rpc-url $RPC_URL > /dev/null 2>&1
    
    cast send $CONTRACT_ADDRESS \
        "openDispute(uint256,uint256)" \
        $GUILD_ID \
        5 \
        --private-key $RELAYER_KEY \
        --rpc-url $RPC_URL > /dev/null 2>&1
    
    log_test "resolveDispute() - Resolve favoring creator (refund)..."
    
    REFUND_RESULT=$(cast send $CONTRACT_ADDRESS \
        "resolveDispute(uint256,bool)" \
        5 \
        false \
        --private-key $ARBITRATOR_KEY \
        --rpc-url $RPC_URL 2>&1)
    
    if echo "$REFUND_RESULT" | grep -q "transactionHash"; then
        log_success "resolveDispute() - Resolved in favor of creator (refunded)"
    else
        log_fail "resolveDispute() - $REFUND_RESULT"
    fi
    
    pause 2
}

# ============================================================================
# PHASE 5: ADMIN FUNCTION TESTS
# ============================================================================

admin_function_tests() {
    log_section "PHASE 5: ADMIN FUNCTION TESTS"
    
    # ------------------------------------------------------
    # 5.1 Test setBaseStake()
    # ------------------------------------------------------
    log_test "setBaseStake() - Update base stake amount..."
    
    STAKE_RESULT=$(cast send $CONTRACT_ADDRESS \
        "setBaseStake(uint256)" \
        2000000000000000000 \
        --private-key $DEPLOYER_KEY \
        --rpc-url $RPC_URL 2>&1)
    
    if echo "$STAKE_RESULT" | grep -q "transactionHash"; then
        log_success "setBaseStake() - Base stake updated to 2 ETH"
    else
        log_fail "setBaseStake() - $STAKE_RESULT"
    fi
    
    pause 1
    
    # ------------------------------------------------------
    # 5.2 Test setArbitrator()
    # ------------------------------------------------------
    log_test "setArbitrator() - Update arbitrator address..."
    
    NEW_ARBITRATOR="0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65"
    
    ARB_RESULT=$(cast send $CONTRACT_ADDRESS \
        "setArbitrator(address)" \
        $NEW_ARBITRATOR \
        --private-key $DEPLOYER_KEY \
        --rpc-url $RPC_URL 2>&1)
    
    if echo "$ARB_RESULT" | grep -q "transactionHash"; then
        log_success "setArbitrator() - Arbitrator updated"
        
        # Reset back to original
        cast send $CONTRACT_ADDRESS \
            "setArbitrator(address)" \
            $ARBITRATOR \
            --private-key $DEPLOYER_KEY \
            --rpc-url $RPC_URL > /dev/null 2>&1
    else
        log_fail "setArbitrator() - $ARB_RESULT"
    fi
    
    pause 1
    
    # ------------------------------------------------------
    # 5.3 Test setRelayer()
    # ------------------------------------------------------
    log_test "setRelayer() - Update relayer address..."
    
    NEW_RELAYER="0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc"
    
    RELAY_RESULT=$(cast send $CONTRACT_ADDRESS \
        "setRelayer(address)" \
        $NEW_RELAYER \
        --private-key $DEPLOYER_KEY \
        --rpc-url $RPC_URL 2>&1)
    
    if echo "$RELAY_RESULT" | grep -q "transactionHash"; then
        log_success "setRelayer() - Relayer updated"
        
        # Reset back to original
        cast send $CONTRACT_ADDRESS \
            "setRelayer(address)" \
            $RELAYER \
            --private-key $DEPLOYER_KEY \
            --rpc-url $RPC_URL > /dev/null 2>&1
    else
        log_fail "setRelayer() - $RELAY_RESULT"
    fi
    
    pause 1
    
    # ------------------------------------------------------
    # 5.4 Test setRegistrationFee()
    # ------------------------------------------------------
    log_test "setRegistrationFee() - Update registration fee..."
    
    FEE_RESULT=$(cast send $CONTRACT_ADDRESS \
        "setRegistrationFee(uint256)" \
        20000000000000000000 \
        --private-key $DEPLOYER_KEY \
        --rpc-url $RPC_URL 2>&1)
    
    if echo "$FEE_RESULT" | grep -q "transactionHash"; then
        log_success "setRegistrationFee() - Fee updated to 20 MNEE"
    else
        log_fail "setRegistrationFee() - $FEE_RESULT"
    fi
    
    pause 1
    
    # ------------------------------------------------------
    # 5.5 Test withdrawFromServer()
    # ------------------------------------------------------
    log_test "withdrawFromServer() - Withdraw 10 MNEE from server..."
    
    WITHDRAW_RESULT=$(cast send $CONTRACT_ADDRESS \
        "withdrawFromServer(uint256,address,uint256)" \
        $GUILD_ID \
        $DEPLOYER \
        10000000000000000000 \
        --private-key $RELAYER_KEY \
        --rpc-url $RPC_URL 2>&1)
    
    if echo "$WITHDRAW_RESULT" | grep -q "transactionHash"; then
        log_success "withdrawFromServer() - 10 MNEE withdrawn"
    else
        log_fail "withdrawFromServer() - $WITHDRAW_RESULT"
    fi
    
    pause 1
    
    # ------------------------------------------------------
    # 5.6 Test calculateStake()
    # ------------------------------------------------------
    log_test "calculateStake() - Calculate stake for commitment..."
    
    CALC_RESULT=$(cast call $CONTRACT_ADDRESS \
        "calculateStake(uint256)(uint256)" \
        1 \
        --rpc-url $RPC_URL 2>&1)
    
    if echo "$CALC_RESULT" | grep -q "[0-9]"; then
        log_success "calculateStake() - Stake: $CALC_RESULT"
    else
        log_fail "calculateStake() - $CALC_RESULT"
    fi
    
    pause 1
    
    # ------------------------------------------------------
    # 5.7 Test deactivateServer()
    # ------------------------------------------------------
    log_test "deactivateServer() - Deactivate server (testing)..."
    
    # Create a second server to deactivate
    GUILD_ID2="9876543210987654321"
    
    cast send $MNEE_TOKEN "approve(address,uint256)" $CONTRACT_ADDRESS 15000000000000000000 \
        --private-key $DEPLOYER_KEY \
        --rpc-url $RPC_URL > /dev/null 2>&1
    
    cast send $CONTRACT_ADDRESS \
        "registerServer(uint256,uint256)" \
        $GUILD_ID2 \
        $ADMIN_DISCORD_ID \
        --private-key $DEPLOYER_KEY \
        --rpc-url $RPC_URL > /dev/null 2>&1
    
    DEACTIVATE_RESULT=$(cast send $CONTRACT_ADDRESS \
        "deactivateServer(uint256)" \
        $GUILD_ID2 \
        --private-key $DEPLOYER_KEY \
        --rpc-url $RPC_URL 2>&1)
    
    if echo "$DEACTIVATE_RESULT" | grep -q "transactionHash"; then
        log_success "deactivateServer() - Server #2 deactivated"
    else
        log_fail "deactivateServer() - $DEACTIVATE_RESULT"
    fi
    
    pause 1
    
    # ------------------------------------------------------
    # 5.8 Test withdrawFees()
    # ------------------------------------------------------
    log_test "withdrawFees() - Withdraw registration fees..."
    
    # Registration fee is 15 MNEE (or 20 after update), we collected 2 registrations
    # But we only withdraw a small amount to test
    FEES_RESULT=$(cast send $CONTRACT_ADDRESS \
        "withdrawFees(address,uint256)" \
        $DEPLOYER \
        1000000000000000000 \
        --private-key $DEPLOYER_KEY \
        --rpc-url $RPC_URL 2>&1)
    
    if echo "$FEES_RESULT" | grep -q "transactionHash"; then
        log_success "withdrawFees() - 1 MNEE fee withdrawn"
    else
        log_fail "withdrawFees() - $FEES_RESULT"
    fi
    
    pause 1
}

# ============================================================================
# PHASE 6: VIEW FUNCTION TESTS
# ============================================================================

view_function_tests() {
    log_section "PHASE 6: VIEW FUNCTION TESTS"
    
    # ------------------------------------------------------
    # 6.1 Test commitmentCount
    # ------------------------------------------------------
    log_test "commitmentCount() - Get total commitments..."
    
    COUNT=$(cast call $CONTRACT_ADDRESS \
        "commitmentCount()(uint256)" \
        --rpc-url $RPC_URL 2>&1)
    
    if echo "$COUNT" | grep -q "[0-9]"; then
        log_success "commitmentCount() - Total: $COUNT commitments"
    else
        log_fail "commitmentCount() - $COUNT"
    fi
    
    # ------------------------------------------------------
    # 6.2 Test baseStake
    # ------------------------------------------------------
    log_test "baseStake() - Get base stake amount..."
    
    STAKE=$(cast call $CONTRACT_ADDRESS \
        "baseStake()(uint256)" \
        --rpc-url $RPC_URL 2>&1)
    
    if echo "$STAKE" | grep -q "[0-9]"; then
        log_success "baseStake() - Amount: $STAKE wei"
    else
        log_fail "baseStake() - $STAKE"
    fi
    
    # ------------------------------------------------------
    # 6.3 Test arbitrator
    # ------------------------------------------------------
    log_test "arbitrator() - Get arbitrator address..."
    
    ARB=$(cast call $CONTRACT_ADDRESS \
        "arbitrator()(address)" \
        --rpc-url $RPC_URL 2>&1)
    
    if echo "$ARB" | grep -q "0x"; then
        log_success "arbitrator() - Address: $ARB"
    else
        log_fail "arbitrator() - $ARB"
    fi
    
    # ------------------------------------------------------
    # 6.4 Test relayer
    # ------------------------------------------------------
    log_test "relayer() - Get relayer address..."
    
    REL=$(cast call $CONTRACT_ADDRESS \
        "relayer()(address)" \
        --rpc-url $RPC_URL 2>&1)
    
    if echo "$REL" | grep -q "0x"; then
        log_success "relayer() - Address: $REL"
    else
        log_fail "relayer() - $REL"
    fi
    
    # ------------------------------------------------------
    # 6.5 Test registrationFee
    # ------------------------------------------------------
    log_test "registrationFee() - Get registration fee..."
    
    FEE=$(cast call $CONTRACT_ADDRESS \
        "registrationFee()(uint256)" \
        --rpc-url $RPC_URL 2>&1)
    
    if echo "$FEE" | grep -q "[0-9]"; then
        log_success "registrationFee() - Fee: $FEE wei"
    else
        log_fail "registrationFee() - $FEE"
    fi
}

# ============================================================================
# MAIN EXECUTION
# ============================================================================

main() {
    echo ""
    echo -e "${MAGENTA}╔════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${MAGENTA}║  COMMIT PROTOCOL - COMPREHENSIVE TEST SUITE                    ║${NC}"
    echo -e "${MAGENTA}║  Testing all contract functions with proper pauses             ║${NC}"
    echo -e "${MAGENTA}╚════════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    
    # Run all test phases
    setup_phase
    server_registration_tests
    commitment_lifecycle_tests
    dispute_flow_tests
    admin_function_tests
    view_function_tests
    
    # Generate final report
    generate_report
    
    # Exit with appropriate code
    if [ $TESTS_FAILED -gt 0 ]; then
        exit 1
    else
        exit 0
    fi
}

# Run main
main "$@"
