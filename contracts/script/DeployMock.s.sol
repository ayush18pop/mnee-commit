// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/Commit.sol";
import "../src/MockMNEE.sol";

/**
 * @title DeployMock
 * @notice Deploy MockMNEE token and Commit contract for local testnet
 * @dev Use this instead of DeployLocal when you want a mock token (no mainnet fork needed)
 */
contract DeployMock is Script {
    function run() external {
        // Use first Anvil account as deployer
        uint256 deployerPrivateKey = 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80;
        address deployer = vm.addr(deployerPrivateKey);
        
        // Use second Anvil account as arbitrator
        address arbitrator = 0x70997970C51812dc3A010C7d01b50e0d17dc79C8;
        
        // Use last Anvil account as relayer (bot wallet)
        address relayer = 0xa0Ee7A142d267C1f36714E4a8F75612F20a79720;
        
        console.log("=== Deploying MockMNEE Testnet ===");
        console.log("Deployer:", deployer);
        console.log("Arbitrator:", arbitrator);
        console.log("Relayer (Bot):", relayer);
        
        vm.startBroadcast(deployerPrivateKey);
        
        // 1. Deploy MockMNEE token
        MockMNEE mockMnee = new MockMNEE();
        console.log("");
        console.log("MockMNEE Token:", address(mockMnee));
        
        // 2. Deploy Commit contract with MockMNEE
        Commit commit = new Commit(arbitrator, address(mockMnee));
        console.log("Commit Protocol:", address(commit));
        
        // 3. Set relayer address (bot wallet)
        commit.setRelayer(relayer);
        
        // 4. Set lower base stake for testing (0.01 ETH)
        commit.setBaseStake(0.01 ether);
        
        // 5. Fund test accounts with MockMNEE via faucet
        address creator = 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266;
        address contributor = 0x70997970C51812dc3A010C7d01b50e0d17dc79C8;
        
        uint256 testAmount = 10000 * 10**18; // 10,000 mMNEE each
        mockMnee.mint(creator, testAmount);
        mockMnee.mint(contributor, testAmount);
        mockMnee.mint(relayer, testAmount);
        
        vm.stopBroadcast();
        
        console.log("");
        console.log("=== Deployment Complete ===");
        console.log("");
        console.log("Contract Addresses:");
        console.log("  MockMNEE:  ", address(mockMnee));
        console.log("  Commit:    ", address(commit));
        console.log("");
        console.log("Test Accounts Funded (10,000 mMNEE each):");
        console.log("  Creator:    ", creator);
        console.log("  Contributor:", contributor);
        console.log("  Relayer:    ", relayer);
        console.log("");
        console.log("=== Environment Variables ===");
        console.log("");
        console.log("Add to server/.env:");
        console.log("  TESTNET_MODE=true");
        console.log("  CONTRACT_ADDRESS=", address(commit));
        console.log("  MNEE_TOKEN_ADDRESS=", address(mockMnee));
        console.log("  RELAYER_PRIVATE_KEY=0x2a871d0798f97d79848a013d4936a73bf4cc922c825d33c1cf7073dff6d409c6");
        console.log("");
        console.log("Add to frontend/.env.local:");
        console.log("  NEXT_PUBLIC_TESTNET_MODE=true");
        console.log("  NEXT_PUBLIC_COMMIT_CONTRACT_ADDRESS=", address(commit));
        console.log("  NEXT_PUBLIC_MNEE_TOKEN_ADDRESS=", address(mockMnee));
    }
}
