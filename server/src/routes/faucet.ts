/**
 * Faucet Routes (Testnet Only)
 * POST /faucet - Request MockMNEE tokens for testing
 */

import { Router } from 'express';
import type { Request, Response } from 'express';
import { Contract, Wallet, JsonRpcProvider } from 'ethers';
import { TESTNET_MODE, RPC_URL, MNEE_TOKEN_ADDRESS, RELAYER_PRIVATE_KEY } from '../config/index.js';
import type { ApiResponse } from '../types/index.js';

export const faucetRouter = Router();

// MockMNEE ABI (only the faucet function)
const MOCK_MNEE_ABI = [
  'function faucet(address to, uint256 amount) external',
  'function faucetCooldownRemaining(address account) external view returns (uint256)',
  'function balanceOf(address account) external view returns (uint256)',
];

// Rate limiting map (in-memory, resets on server restart)
const rateLimitMap = new Map<string, number>();
const RATE_LIMIT_MS = 60 * 1000; // 1 minute cooldown between requests

/**
 * POST /faucet
 * Request MockMNEE tokens from the faucet
 */
faucetRouter.post('/', async (req: Request, res: Response) => {
  // Check if testnet mode is enabled
  if (!TESTNET_MODE) {
    res.status(403).json({
      success: false,
      error: 'Faucet is only available in testnet mode',
    } satisfies ApiResponse<never>);
    return;
  }

  try {
    const { address, amount = 100 } = req.body as { address?: string; amount?: number };

    // Validate address
    if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
      res.status(400).json({
        success: false,
        error: 'Valid Ethereum address is required',
      } satisfies ApiResponse<never>);
      return;
    }

    // Validate amount (max 1000)
    const tokenAmount = Math.min(Math.max(1, amount), 1000);

    // Check rate limit
    const lastRequest = rateLimitMap.get(address.toLowerCase());
    if (lastRequest && Date.now() - lastRequest < RATE_LIMIT_MS) {
      const remainingMs = RATE_LIMIT_MS - (Date.now() - lastRequest);
      res.status(429).json({
        success: false,
        error: `Rate limited. Try again in ${Math.ceil(remainingMs / 1000)} seconds`,
      } satisfies ApiResponse<never>);
      return;
    }

    // Connect to contract
    const provider = new JsonRpcProvider(RPC_URL);
    const signer = new Wallet(RELAYER_PRIVATE_KEY, provider);
    const mockMnee = new Contract(MNEE_TOKEN_ADDRESS, MOCK_MNEE_ABI, signer);

    // Convert amount to wei (18 decimals)
    const amountWei = BigInt(tokenAmount) * BigInt(10 ** 18);

    // Call faucet function
    const tx = await mockMnee.getFunction('faucet')(address, amountWei);
    const receipt = await tx.wait();

    // Update rate limit
    rateLimitMap.set(address.toLowerCase(), Date.now());

    // Get new balance
    const newBalance = await mockMnee.getFunction('balanceOf')(address);

    res.status(200).json({
      success: true,
      data: {
        txHash: receipt.hash,
        address,
        amount: tokenAmount,
        newBalance: (Number(newBalance) / 1e18).toFixed(2),
        message: `Successfully sent ${tokenAmount} mMNEE to ${address}`,
      },
    });
  } catch (error) {
    console.error('Faucet error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Faucet request failed',
    } satisfies ApiResponse<never>);
  }
});

/**
 * GET /faucet/status
 * Check faucet availability and balance
 */
faucetRouter.get('/status', async (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    data: {
      enabled: TESTNET_MODE,
      maxAmount: 1000,
      cooldownSeconds: 60,
      tokenAddress: MNEE_TOKEN_ADDRESS,
    },
  });
});
