/**
 * Commitment Routes
 * POST /commit/create               - Create commitment (deducts balance)
 * POST /commit/:id/submit          - Submit work evidence
 * GET  /commit/:id                  - Get commitment details
 * GET  /commit/server/:guildId     - List by server
 * GET  /commit/contributor/:address - List by contributor
 */

import { Router } from 'express';
import type { Request, Response } from 'express';
import {
  createCommitment,
  submitWork,
  getCommitment,
  getCommitmentsByServer,
  getCommitmentsByContributor,
} from '../services/contractService.js';
import type {
  ApiResponse,
  CreateCommitmentRequest,
  CreateCommitmentResponse,
  SubmitWorkRequest,
  SubmitWorkResponse,
  CommitmentData,
} from '../types/index.js';

export const commitRouter = Router();

/**
 * GET /commit/server/:guildId
 * List commitments by server
 * NOTE: This route must be defined BEFORE /:id to avoid conflict
 */
commitRouter.get('/server/:guildId', async (req: Request, res: Response) => {
  try {
    const { guildId } = req.params;

    if (!guildId) {
      res.status(400).json({
        success: false,
        error: 'guildId is required',
      } satisfies ApiResponse<never>);
      return;
    }

    const commitments = await getCommitmentsByServer(guildId);

    res.status(200).json({
      success: true,
      data: {
        guildId,
        count: commitments.length,
        commitments,
      },
    } satisfies ApiResponse<{ guildId: string; count: number; commitments: Array<CommitmentData & { commitId: number }> }>);
  } catch (error) {
    console.error('Error listing commitments by server:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to list commitments',
    } satisfies ApiResponse<never>);
  }
});

/**
 * GET /commit/contributor/:address
 * List commitments by contributor
 * NOTE: This route must be defined BEFORE /:id to avoid conflict
 */
commitRouter.get('/contributor/:address', async (req: Request, res: Response) => {
  try {
    const { address } = req.params;

    if (!address) {
      res.status(400).json({
        success: false,
        error: 'address is required',
      } satisfies ApiResponse<never>);
      return;
    }

    const commitments = await getCommitmentsByContributor(address);

    res.status(200).json({
      success: true,
      data: {
        address,
        count: commitments.length,
        commitments,
      },
    } satisfies ApiResponse<{ address: string; count: number; commitments: Array<CommitmentData & { commitId: number }> }>);
  } catch (error) {
    console.error('Error listing commitments by contributor:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to list commitments',
    } satisfies ApiResponse<never>);
  }
});

/**
 * POST /commit/create
 * Create a new commitment (deducts from server balance)
 */
commitRouter.post('/create', async (req: Request, res: Response) => {
  try {
    const input = req.body as CreateCommitmentRequest;

    // Validate required fields
    if (!input.guildId) {
      res.status(400).json({
        success: false,
        error: 'guildId is required',
      } satisfies ApiResponse<never>);
      return;
    }

    if (!input.contributor) {
      res.status(400).json({
        success: false,
        error: 'contributor address is required',
      } satisfies ApiResponse<never>);
      return;
    }

    if (!input.token) {
      res.status(400).json({
        success: false,
        error: 'token address is required',
      } satisfies ApiResponse<never>);
      return;
    }

    if (!input.amount) {
      res.status(400).json({
        success: false,
        error: 'amount is required',
      } satisfies ApiResponse<never>);
      return;
    }

    if (!input.deadline || input.deadline <= Math.floor(Date.now() / 1000)) {
      res.status(400).json({
        success: false,
        error: 'deadline must be a future timestamp',
      } satisfies ApiResponse<never>);
      return;
    }

    if (!input.disputeWindow || input.disputeWindow <= 0) {
      res.status(400).json({
        success: false,
        error: 'disputeWindow must be a positive number (seconds)',
      } satisfies ApiResponse<never>);
      return;
    }

    if (!input.specCid) {
      res.status(400).json({
        success: false,
        error: 'specCid (IPFS CID for spec) is required',
      } satisfies ApiResponse<never>);
      return;
    }

    const result = await createCommitment(
      input.guildId,
      input.contributor,
      input.token,
      input.amount,
      input.deadline,
      input.disputeWindow,
      input.specCid
    );

    res.status(201).json({
      success: true,
      data: {
        commitId: result.commitId,
        txHash: result.txHash,
        message: `Commitment #${result.commitId} created successfully`,
      },
    } satisfies ApiResponse<CreateCommitmentResponse>);
  } catch (error) {
    console.error('Error creating commitment:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create commitment',
    } satisfies ApiResponse<never>);
  }
});

/**
 * POST /commit/:id/submit
 * Submit work evidence for a commitment
 */
commitRouter.post('/:id/submit', async (req: Request, res: Response) => {
  try {
    const commitId = parseInt(req.params.id ?? '', 10);
    const input = req.body as SubmitWorkRequest;

    if (isNaN(commitId)) {
      res.status(400).json({
        success: false,
        error: 'Invalid commitment ID',
      } satisfies ApiResponse<never>);
      return;
    }

    if (!input.guildId) {
      res.status(400).json({
        success: false,
        error: 'guildId is required',
      } satisfies ApiResponse<never>);
      return;
    }

    if (!input.evidenceCid) {
      res.status(400).json({
        success: false,
        error: 'evidenceCid (IPFS CID for evidence) is required',
      } satisfies ApiResponse<never>);
      return;
    }

    const txHash = await submitWork(input.guildId, commitId, input.evidenceCid);

    res.status(200).json({
      success: true,
      data: {
        commitId,
        evidenceCid: input.evidenceCid,
        txHash,
        message: 'Work submitted successfully',
      },
    } satisfies ApiResponse<SubmitWorkResponse>);
  } catch (error) {
    console.error('Error submitting work:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to submit work',
    } satisfies ApiResponse<never>);
  }
});

/**
 * GET /commit/:id
 * Get commitment details
 */
commitRouter.get('/:id', async (req: Request, res: Response) => {
  try {
    const commitId = parseInt(req.params.id ?? '', 10);

    if (isNaN(commitId)) {
      res.status(400).json({
        success: false,
        error: 'Invalid commitment ID',
      } satisfies ApiResponse<never>);
      return;
    }

    const commitment = await getCommitment(commitId);

    // Check if commitment exists (creator address would be zero for non-existent)
    if (commitment.creator === '0x0000000000000000000000000000000000000000') {
      res.status(404).json({
        success: false,
        error: 'Commitment not found',
      } satisfies ApiResponse<never>);
      return;
    }

    res.status(200).json({
      success: true,
      data: { ...commitment, commitId },
    } satisfies ApiResponse<CommitmentData & { commitId: number }>);
  } catch (error) {
    console.error('Error getting commitment:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get commitment',
    } satisfies ApiResponse<never>);
  }
});
