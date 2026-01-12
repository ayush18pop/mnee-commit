'use client';

import { useEffect } from 'react';
import { IS_TESTNET } from '@/lib/contracts';

/**
 * LayoutEffects - Handles dynamic layout adjustments
 * Adds/removes body classes based on testnet mode
 */
export function LayoutEffects() {
  useEffect(() => {
    if (IS_TESTNET) {
      document.body.classList.add('has-testnet-banner');
    } else {
      document.body.classList.remove('has-testnet-banner');
    }
    
    return () => {
      document.body.classList.remove('has-testnet-banner');
    };
  }, []);

  return null;
}
