// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MockMNEE
 * @notice Mock MNEE token for testnet usage with public faucet
 * @dev Anyone can mint tokens via faucet() for testing purposes
 */
contract MockMNEE is ERC20, Ownable {
    /// @notice Maximum tokens per faucet request (1000 mMNEE)
    uint256 public constant MAX_FAUCET_AMOUNT = 1000 * 10**18;
    
    /// @notice Cooldown between faucet requests per address (1 hour)
    uint256 public constant FAUCET_COOLDOWN = 1 hours;
    
    /// @notice Track last faucet request time per address
    mapping(address => uint256) public lastFaucetRequest;
    
    /// @notice Emitted when tokens are minted via faucet
    event Faucet(address indexed to, uint256 amount);
    
    constructor() ERC20("Mock MNEE Token", "mMNEE") Ownable(msg.sender) {
        // Mint initial supply to deployer (1 million tokens)
        _mint(msg.sender, 1_000_000 * 10**18);
    }
    
    /**
     * @notice Request tokens from faucet
     * @param to Address to receive tokens
     * @param amount Amount of tokens to mint (max 1000 mMNEE per request)
     */
    function faucet(address to, uint256 amount) external {
        require(to != address(0), "Invalid address");
        require(amount > 0, "Amount must be positive");
        require(amount <= MAX_FAUCET_AMOUNT, "Exceeds max faucet amount");
        
        // Check cooldown (skip for owner)
        if (msg.sender != owner()) {
            require(
                block.timestamp >= lastFaucetRequest[to] + FAUCET_COOLDOWN,
                "Faucet cooldown active"
            );
            lastFaucetRequest[to] = block.timestamp;
        }
        
        _mint(to, amount);
        emit Faucet(to, amount);
    }
    
    /**
     * @notice Mint tokens without restrictions (owner only)
     * @param to Address to receive tokens
     * @param amount Amount of tokens to mint
     */
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
    
    /**
     * @notice Get remaining cooldown time for an address
     * @param account Address to check
     * @return Remaining cooldown in seconds (0 if ready)
     */
    function faucetCooldownRemaining(address account) external view returns (uint256) {
        uint256 nextAvailable = lastFaucetRequest[account] + FAUCET_COOLDOWN;
        if (block.timestamp >= nextAvailable) {
            return 0;
        }
        return nextAvailable - block.timestamp;
    }
}
