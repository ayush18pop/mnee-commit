/**
 * Admin Routes
 * GET /admin/stats - Protocol statistics
 */

import { Router } from 'express';
import type { Request, Response } from 'express';
import {
    getCommitmentCount,
    getRegistrationFee,
    getBaseStake,
    getArbitrator,
    getMneeToken,
    isContractConfigured,
} from '../services/contractService.js';
import { CONTRACT_ADDRESS, MNEE_TOKEN_ADDRESS } from '../config/index.js';
import type { ApiResponse, ProtocolStats } from '../types/index.js';

export const adminRouter = Router();

/**
 * GET /admin/stats
 * Get protocol statistics
 */
adminRouter.get('/stats', async (req: Request, res: Response) => {
    try {
        if (!isContractConfigured()) {
            res.status(503).json({
                success: false,
                error: 'Contract not configured',
            } satisfies ApiResponse<never>);
            return;
        }

        const [
            totalCommitments,
            registrationFee,
            baseStake,
            arbitrator,
            mneeToken,
        ] = await Promise.all([
            getCommitmentCount(),
            getRegistrationFee(),
            getBaseStake(),
            getArbitrator(),
            getMneeToken(),
        ]);

        res.status(200).json({
            success: true,
            data: {
                totalCommitments,
                contractAddress: CONTRACT_ADDRESS,
                mneeTokenAddress: mneeToken || MNEE_TOKEN_ADDRESS,
                registrationFee,
                baseStake,
                arbitrator,
            },
        } satisfies ApiResponse<ProtocolStats>);
    } catch (error) {
        console.error('Error getting protocol stats:', error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'Failed to get protocol stats',
        } satisfies ApiResponse<never>);
    }
});
