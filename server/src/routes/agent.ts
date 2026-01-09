/**
 * Agent Routes
 * POST /agent/github   - GitHub Code Diff verification
 * POST /agent/design   - Visual Design Diff verification
 * POST /agent/document - Document/Research Diff verification
 * GET  /agent/:cid     - Retrieve evidence by CID
 */

import { Router } from 'express';
import type { Request, Response } from 'express';
import { runGitHubAgent } from '../services/agents/githubAgent.js';
import { runDesignAgent } from '../services/agents/designAgent.js';
import { runDocumentAgent } from '../services/agents/documentAgent.js';
import { fetchFromIpfs, getGatewayUrl, isIpfsConfigured } from '../services/ipfsService.js';
import type {
    GitHubAgentInput,
    DesignAgentInput,
    DocumentAgentInput,
    AgentApiResponse,
    GitHubAgentResult,
    DesignAgentResult,
    DocumentAgentResult,
} from '../types/agents.js';

export const agentRouter = Router();

/**
 * POST /agent/github
 * GitHub Code Diff verification
 */
agentRouter.post('/github', async (req: Request, res: Response) => {
    try {
        const input = req.body as GitHubAgentInput;

        // Validate required fields
        if (!input.taskSpec) {
            res.status(400).json({
                success: false,
                error: 'taskSpec is required',
            } satisfies AgentApiResponse<GitHubAgentResult>);
            return;
        }

        if (!input.prUrl && !input.repoUrl) {
            res.status(400).json({
                success: false,
                error: 'Either prUrl or repoUrl is required',
            } satisfies AgentApiResponse<GitHubAgentResult>);
            return;
        }

        console.log(`[Agent:GitHub] Starting analysis for: ${input.prUrl || input.repoUrl}`);

        const result = await runGitHubAgent(input);

        console.log(`[Agent:GitHub] Completed with confidence: ${result.confidenceScore}%`);

        res.status(200).json({
            success: true,
            data: result,
        } satisfies AgentApiResponse<GitHubAgentResult>);
    } catch (error) {
        console.error('Error in GitHub agent:', error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'GitHub verification failed',
        } satisfies AgentApiResponse<GitHubAgentResult>);
    }
});

/**
 * POST /agent/design
 * Visual Design Diff verification
 */
agentRouter.post('/design', async (req: Request, res: Response) => {
    try {
        const input = req.body as DesignAgentInput;

        // Validate required fields
        if (!input.designSpec) {
            res.status(400).json({
                success: false,
                error: 'designSpec is required',
            } satisfies AgentApiResponse<DesignAgentResult>);
            return;
        }

        if (!input.submittedImages || input.submittedImages.length === 0) {
            res.status(400).json({
                success: false,
                error: 'submittedImages array is required and must not be empty',
            } satisfies AgentApiResponse<DesignAgentResult>);
            return;
        }

        console.log(`[Agent:Design] Starting analysis for ${input.submittedImages.length} image(s)`);

        const result = await runDesignAgent(input);

        console.log(`[Agent:Design] Completed with confidence: ${result.confidenceScore}%`);

        res.status(200).json({
            success: true,
            data: result,
        } satisfies AgentApiResponse<DesignAgentResult>);
    } catch (error) {
        console.error('Error in Design agent:', error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'Design verification failed',
        } satisfies AgentApiResponse<DesignAgentResult>);
    }
});

/**
 * POST /agent/document
 * Document/Research Diff verification
 */
agentRouter.post('/document', async (req: Request, res: Response) => {
    try {
        const input = req.body as DocumentAgentInput;

        // Validate required fields
        if (!input.documentSpec) {
            res.status(400).json({
                success: false,
                error: 'documentSpec is required',
            } satisfies AgentApiResponse<DocumentAgentResult>);
            return;
        }

        if (!input.submittedDocUrl && !input.submittedContent) {
            res.status(400).json({
                success: false,
                error: 'Either submittedDocUrl or submittedContent is required',
            } satisfies AgentApiResponse<DocumentAgentResult>);
            return;
        }

        console.log(`[Agent:Document] Starting analysis`);

        const result = await runDocumentAgent(input);

        console.log(`[Agent:Document] Completed with confidence: ${result.confidenceScore}%`);

        res.status(200).json({
            success: true,
            data: result,
        } satisfies AgentApiResponse<DocumentAgentResult>);
    } catch (error) {
        console.error('Error in Document agent:', error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'Document verification failed',
        } satisfies AgentApiResponse<DocumentAgentResult>);
    }
});

/**
 * GET /agent/:cid
 * Retrieve evidence by IPFS CID
 */
agentRouter.get('/:cid', async (req: Request, res: Response) => {
    try {
        const { cid } = req.params;

        if (!cid) {
            res.status(400).json({
                success: false,
                error: 'CID is required',
            });
            return;
        }

        // Check if IPFS is configured
        if (!isIpfsConfigured()) {
            // Return gateway URL for client-side fetch
            res.status(200).json({
                success: true,
                data: {
                    cid,
                    gatewayUrl: getGatewayUrl(cid),
                    message: 'IPFS not configured server-side. Use gatewayUrl to fetch directly.',
                },
            });
            return;
        }

        const evidence = await fetchFromIpfs(cid);

        res.status(200).json({
            success: true,
            data: {
                cid,
                gatewayUrl: getGatewayUrl(cid),
                evidence,
            },
        });
    } catch (error) {
        console.error('Error fetching evidence:', error);
        res.status(500).json({
            success: false,
            error: error instanceof Error ? error.message : 'Failed to fetch evidence',
        });
    }
});

/**
 * GET /agent/status
 * Check agent service status
 */
agentRouter.get('/', async (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        data: {
            agents: ['github', 'design', 'document'],
            ipfsConfigured: isIpfsConfigured(),
            endpoints: {
                github: 'POST /agent/github',
                design: 'POST /agent/design',
                document: 'POST /agent/document',
                evidence: 'GET /agent/:cid',
            },
        },
    });
});
