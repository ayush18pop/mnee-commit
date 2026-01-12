// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/Commit.sol";
import "../src/MockMNEE.sol";

/**
 * @title DeploySepolia
 * @notice Deploy MockMNEE token and Commit contract to Sepolia testnet
 * @dev Uses environment variables for private keys - no hardcoded values!
 * 
 * Usage:
 *   forge script script/DeploySepolia.s.sol:DeploySepolia \
 *     --rpc-url $SEPOLIA_RPC_URL \
 *     --broadcast \
 *     --verify \
 *     --etherscan-api-key $ETHERSCAN_API_KEY
 * 
 * Note: DEPLOYER_PRIVATE_KEY can be with or without "0x" prefix
 */
contract DeploySepolia is Script {
    function run() external {
        // Load private key from environment (handles with or without 0x prefix)
        string memory pkString = vm.envString("DEPLOYER_PRIVATE_KEY");
        uint256 deployerPrivateKey = vm.parseUint(
            bytes(pkString).length == 64 
                ? string(abi.encodePacked("0x", pkString))
                : pkString
        );
        address deployer = vm.addr(deployerPrivateKey);
        
        // Relayer wallet (bot wallet) - can be same as deployer or different
        address relayer = vm.envOr("RELAYER_ADDRESS", deployer);
        
        // Arbitrator address (for dispute resolution)
        address arbitrator = vm.envOr("ARBITRATOR_ADDRESS", deployer);
        
        console.log("===========================================");
        console.log("   SEPOLIA TESTNET DEPLOYMENT");
        console.log("===========================================");
        console.log("");
        console.log("Deployer:", deployer);
        console.log("Relayer:", relayer);
        console.log("Arbitrator:", arbitrator);
        console.log("");
        
        vm.startBroadcast(deployerPrivateKey);
        
        // 1. Deploy MockMNEE token
        MockMNEE mockMnee = new MockMNEE();
        console.log("[1/4] MockMNEE deployed:", address(mockMnee));
        
        // 2. Deploy Commit contract with MockMNEE
        Commit commit = new Commit(arbitrator, address(mockMnee));
        console.log("[2/4] Commit deployed:", address(commit));
        
        // 3. Set relayer address
        commit.setRelayer(relayer);
        console.log("[3/4] Relayer set:", relayer);
        
        // 4. Set base stake for testing (0.01 ETH equivalent)
        commit.setBaseStake(0.01 ether);
        console.log("[4/4] Base stake set: 0.01 ETH");
        
        // Fund deployer with MockMNEE for initial testing
        uint256 initialFunding = 100_000 * 10**18; // 100k mMNEE
        mockMnee.mint(deployer, initialFunding);
        console.log("");
        console.log("Funded deployer with 100,000 mMNEE");
        
        vm.stopBroadcast();
        
        console.log("");
        console.log("===========================================");
        console.log("   DEPLOYMENT COMPLETE!");
        console.log("===========================================");
        console.log("");
        console.log("CONTRACT ADDRESSES (save these!):");
        console.log("  MockMNEE:      ", address(mockMnee));
        console.log("  Commit:        ", address(commit));
        console.log("");
        console.log("===========================================");
        console.log("   CONFIGURATION FOR .env FILES");
        console.log("===========================================");
        console.log("");
        console.log("# server/.env");
        console.log("TESTNET_MODE=true");
        console.log("RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY");
        console.log("CHAIN_ID=11155111");
        _logAddress("CONTRACT_ADDRESS=", address(commit));
        _logAddress("MNEE_TOKEN_ADDRESS=", address(mockMnee));
        console.log("");
        console.log("# frontend/.env.local");
        console.log("NEXT_PUBLIC_TESTNET_MODE=true");
        _logAddress("NEXT_PUBLIC_COMMIT_CONTRACT_ADDRESS=", address(commit));
        _logAddress("NEXT_PUBLIC_MNEE_TOKEN_ADDRESS=", address(mockMnee));
        console.log("");
        console.log("# bot/.env");
        _logAddress("CONTRACT_ADDRESS=", address(commit));
        _logAddress("MNEE_TOKEN_ADDRESS=", address(mockMnee));
        console.log("RPC_URL=https://sepolia.infura.io/v3/YOUR_KEY");
        console.log("");
        console.log("===========================================");
        console.log("   FAUCET USAGE");
        console.log("===========================================");
        console.log("");
        console.log("Anyone can request tokens via the faucet:");
        console.log("  curl -X POST http://YOUR_SERVER/faucet \\");
        console.log("    -H 'Content-Type: application/json' \\");
        console.log("    -d '{\"address\": \"0x...\", \"amount\": 1000}'");
        console.log("");
    }
    
    function _logAddress(string memory prefix, address addr) internal pure {
        console.log(string(abi.encodePacked(prefix, vm.toString(addr))));
    }
}

/**
 * @title FundTestWallets
 * @notice Fund test wallets with MockMNEE tokens on Sepolia
 * 
 * Usage:
 *   WALLETS="0x123...,0x456..." forge script script/DeploySepolia.s.sol:FundTestWallets \
 *     --rpc-url $SEPOLIA_RPC_URL \
 *     --broadcast
 */
contract FundTestWallets is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("DEPLOYER_PRIVATE_KEY");
        address mockMneeAddress = vm.envAddress("MNEE_TOKEN_ADDRESS");
        string memory walletsStr = vm.envString("WALLETS");
        
        MockMNEE mockMnee = MockMNEE(mockMneeAddress);
        
        vm.startBroadcast(deployerPrivateKey);
        
        // Parse comma-separated wallet addresses
        // For simplicity, we'll fund a fixed amount
        uint256 amount = 10_000 * 10**18; // 10k mMNEE each
        
        console.log("Funding wallets with 10,000 mMNEE each...");
        console.log("Wallets:", walletsStr);
        
        // Note: In practice, you'd parse the WALLETS string
        // For now, this is a template - modify addresses as needed
        
        vm.stopBroadcast();
    }
}
