import dotenv from 'dotenv';

dotenv.config();

/**
 * Server Configuration
 */
export const PORT = parseInt(process.env['PORT'] ?? '3000', 10);
export const SERVER_BASE_URL = process.env['SERVER_BASE_URL'] ?? 'http://localhost:3000';

/**
 * Smart Contract Configuration
 */
export const CHAIN_ID = parseInt(process.env['CHAIN_ID'] ?? '84532', 10); // Base Sepolia
export const RPC_URL = process.env['RPC_URL'] ?? 'https://sepolia.base.org';
export const CONTRACT_ADDRESS = process.env['CONTRACT_ADDRESS'] ?? '';
export const MNEE_TOKEN_ADDRESS = process.env['MNEE_TOKEN_ADDRESS'] ?? '';

/**
 * Relayer Wallet (for settlement and other write operations)
 * This wallet calls settle(), batchSettle(), and other relayer functions
 */
export const RELAYER_PRIVATE_KEY = process.env['RELAYER_PRIVATE_KEY'] ?? '';

/**
 * Admin Configuration
 */
export const ADMIN_SECRET = process.env['ADMIN_SECRET'] ?? '';

/**
 * Agent Configuration
 */
export const GEMINI_API_KEY = process.env['GEMINI_API_KEY'] ?? '';
export const GITHUB_TOKEN = process.env['GITHUB_TOKEN'] ?? '';

/**
 * IPFS Configuration (Pinata)
 */
export const PINATA_API_KEY = process.env['PINATA_API_KEY'] ?? '';
export const PINATA_SECRET_KEY = process.env['PINATA_SECRET_KEY'] ?? '';
export const PINATA_GATEWAY = process.env['PINATA_GATEWAY'] ?? 'https://gateway.pinata.cloud/ipfs';

/**
 * MongoDB Configuration
 */
export const MONGODB_URI = process.env['MONGODB_URI'] ?? '';

/**
 * Protocol Constants
 */
export const REGISTRATION_FEE = '15000000000000000000'; // 15 MNEE (18 decimals)

/**
 * Validate required environment variables
 */
export function validateConfig(): void {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!CONTRACT_ADDRESS) {
    errors.push('CONTRACT_ADDRESS is required');
  }
  if (!RPC_URL) {
    errors.push('RPC_URL is required');
  }

  if (!RELAYER_PRIVATE_KEY) {
    warnings.push('RELAYER_PRIVATE_KEY not configured - write operations are DISABLED');
    warnings.push('Only read-only endpoints will function');
  }

  if (!MNEE_TOKEN_ADDRESS) {
    warnings.push('MNEE_TOKEN_ADDRESS not configured - token operations may fail');
  }

  if (errors.length > 0) {
    console.error('Configuration Errors:');
    errors.forEach((err) => console.error(`  ❌ ${err}`));
    console.error('Server may not function correctly.');
  }

  if (warnings.length > 0) {
    console.warn('Configuration Warnings:');
    warnings.forEach((warn) => console.warn(`  ⚠️  ${warn}`));
  }

  if (errors.length === 0 && warnings.length === 0) {
    console.log('✅ Configuration validated successfully');
  }
}
