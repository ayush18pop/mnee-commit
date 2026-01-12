'use client';

import { useState } from 'react';
import { IS_TESTNET, MNEE_TOKEN_ADDRESS } from '@/lib/contracts';

interface FaucetResponse {
  success: boolean;
  data?: {
    txHash: string;
    address: string;
    amount: number;
    newBalance: string;
    message: string;
  };
  error?: string;
}

/**
 * FaucetButton - Request MockMNEE tokens for testing
 * Follows design guide: Monochrome luxury with gold accents
 */
export function FaucetButton({ 
  address,
  onSuccess,
  className = '' 
}: { 
  address?: string;
  onSuccess?: (balance: string) => void;
  className?: string;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [inputAddress, setInputAddress] = useState(address || '');
  const [amount, setAmount] = useState(100);
  const [result, setResult] = useState<FaucetResponse | null>(null);

  if (!IS_TESTNET) return null;

  const handleFaucet = async () => {
    const targetAddress = inputAddress.trim();
    
    if (!targetAddress || !/^0x[a-fA-F0-9]{40}$/.test(targetAddress)) {
      setResult({ success: false, error: 'Please enter a valid Ethereum address' });
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://mnee-commit.onrender.com';
      const response = await fetch(`${apiUrl}/faucet`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: targetAddress, amount }),
      });

      const data: FaucetResponse = await response.json();
      setResult(data);

      if (data.success && data.data?.newBalance && onSuccess) {
        onSuccess(data.data.newBalance);
      }
    } catch (error) {
      setResult({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Faucet request failed' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`bg-[#0a0a0a] border border-[rgba(201,162,39,0.2)] rounded-sm p-5 ${className}`}
         style={{ boxShadow: '0 0 40px rgba(201, 162, 39, 0.05)' }}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-full bg-[rgba(201,162,39,0.15)] flex items-center justify-center">
          <span className="text-[#c9a227]">◆</span>
        </div>
        <h3 className="font-[family-name:var(--font-display)] text-lg text-[#e8e8e8]">
          Testnet <span className="italic text-[#c9a227]">Faucet</span>
        </h3>
      </div>
      
      <p className="text-sm text-[#888888] mb-5">
        Get free MockMNEE tokens for testing. Maximum 1000 per request.
      </p>

      <div className="space-y-4">
        {/* Address Input */}
        {!address && (
          <div>
            <label className="block text-xs text-[#666666] mb-2 uppercase tracking-wider">
              Wallet Address
            </label>
            <input
              type="text"
              value={inputAddress}
              onChange={(e) => setInputAddress(e.target.value)}
              placeholder="0x..."
              className="w-full px-4 py-3 bg-[#020202] border border-[rgba(255,255,255,0.08)] rounded-sm text-[#e8e8e8] placeholder-[#444444] focus:outline-none focus:border-[rgba(201,162,39,0.3)] font-mono text-sm transition-colors duration-300"
            />
          </div>
        )}

        {/* Amount Selector */}
        <div>
          <label className="block text-xs text-[#666666] mb-2 uppercase tracking-wider">
            Amount
          </label>
          <select
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full px-4 py-3 bg-[#020202] border border-[rgba(255,255,255,0.08)] rounded-sm text-[#e8e8e8] focus:outline-none focus:border-[rgba(201,162,39,0.3)] transition-colors duration-300"
          >
            <option value={100}>100 mMNEE</option>
            <option value={500}>500 mMNEE</option>
            <option value={1000}>1000 mMNEE</option>
          </select>
        </div>

        {/* Request Button */}
        <button
          onClick={handleFaucet}
          disabled={isLoading}
          className="w-full py-3 px-4 bg-[rgba(201,162,39,0.1)] hover:bg-[rgba(201,162,39,0.2)] border border-[rgba(201,162,39,0.3)] text-[#c9a227] font-medium rounded-sm transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-pulse">◆</span>
              Requesting...
            </span>
          ) : (
            'Request Tokens'
          )}
        </button>

        {/* Result Message */}
        {result && (
          <div className={`text-sm p-3 rounded-sm border ${
            result.success 
              ? 'bg-[rgba(34,197,94,0.05)] border-[rgba(34,197,94,0.2)] text-[#22c55e]' 
              : 'bg-[rgba(239,68,68,0.05)] border-[rgba(239,68,68,0.2)] text-[#ef4444]'
          }`}>
            {result.success 
              ? `✓ ${result.data?.message}` 
              : `✗ ${result.error}`
            }
          </div>
        )}
      </div>

      {/* Footer */}
      <p className="text-xs text-[#444444] mt-4 font-mono">
        Token: {MNEE_TOKEN_ADDRESS.slice(0, 10)}...{MNEE_TOKEN_ADDRESS.slice(-6)}
      </p>
    </div>
  );
}
