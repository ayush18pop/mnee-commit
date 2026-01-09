/**
 * Settlement Routes
 * POST /settlement/batch   - Batch settle (cron job)
 * GET  /settlement/pending - Get pending settlements
 */

import { Router } from 'express';
import type { Request, Response } from 'express';
import {
    batchSettle,
    getPendingSettlements,
    getMaxBatchSize,
} from '../services/contractService.js';
import type {
    ApiResponse,
    BatchSettleRequest,
    BatchSettleResponse,
    PendingSettlement,
    CommitmentState,
} from '../types/index.js';

export const settlementRouter = Router();

/**
 * POST /settlement/batch
 * Batch settle multiple commitments
 */
settlementRouter.post('/batch', async (req: Request, res: Response) => {
    try {
        const input = req.body as BatchSettleRequest;

        if (!input.commitIds || !Array.isArray(input.commitIds) || input.commitIds.length === 0) {
            res.status(400).json({
                success: false,
                error: 'commitIds array is required and must not be empty',
            } satisfies ApiResponse<never>);
            return;
        }

        // Check max batch size
        const maxBatchSize = await getMaxBatchSize();
        if (input.commitIds.length > maxBatchSize) {
            res.status(400).json({
                success: false,
                error: `Batch size exceeds maximum (${maxBatchSize})`,
            } satisfies ApiResponse<never>);
            return;
        }

        const txHash = await batchSettle(input.commitIds);

        res.status(200).json({
            success: true,
            data: {
                settledCount: input.commitIds.length,
                txHash,
                commitIds: input.commitIds,
            },
        } satisfies ApiResponse<BatchSettleResponse>);
    } catch (error) {
        console.error('Error batch settling:', error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'Failed to batch settle',
        } satisfies ApiResponse<never>);
    }
});

/**
 * GET /settlement/pending
 * Get pending settlements (commitments that can be settled)
 */
settlementRouter.get('/pending', async (req: Request, res: Response) => {
    try {
        const pending = await getPendingSettlements();

        const settlements: PendingSettlement[] = pending.map(({ commitId, commitment }) => ({
            commitId,
            contributor: commitment.contributor,
            amount: commitment.amount,
            deadline: commitment.deadline,
            disputeWindow: commitment.disputeWindow,
        }));

        res.status(200).json({
            success: true,
            data: {
                count: settlements.length,
                settlements,
            },
        } satisfies ApiResponse<{ count: number; settlements: PendingSettlement[] }>);
    } catch (error) {
        console.error('Error getting pending settlements:', error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'Failed to get pending settlements',
        } satisfies ApiResponse<never>);
    }
});
