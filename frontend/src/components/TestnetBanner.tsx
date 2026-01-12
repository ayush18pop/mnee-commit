'use client';

import { IS_TESTNET } from '@/lib/contracts';

/**
 * TestnetBanner - Shows a warning banner when in testnet mode
 * Follows design guide: Gold accents on dark void background
 */
export function TestnetBanner() {
  if (!IS_TESTNET) return null;

  return (
    <div className="w-full bg-[#0a0a0a] border-b border-[rgba(201,162,39,0.3)] py-2 px-4 text-center">
      <span className="text-sm font-medium">
        <span className="text-[#c9a227] mr-2">◆</span>
        <span className="text-[#c9a227] font-semibold tracking-wide">TESTNET</span>
        <span className="text-[#666666] mx-3">|</span>
        <span className="text-[#888888]">Using MockMNEE tokens — not real value</span>
        <span className="text-[#c9a227] ml-2">◆</span>
      </span>
    </div>
  );
}
