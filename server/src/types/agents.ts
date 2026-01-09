// ============================================================================
// Agent Types - Verification Agent Input/Output Types
// ============================================================================

/**
 * Common agent result structure
 */
export interface AgentResult<T = Record<string, unknown>> {
    confidenceScore: number;  // 0-100
    evidenceCid: string;      // IPFS CID of evidence
    summary: string;          // Human-readable summary
    details: T;
}

// ============================================================================
// GitHub Code Diff Agent
// ============================================================================

export interface GitHubAgentInput {
    /** Task specification/description */
    taskSpec: string;
    /** GitHub PR URL (e.g., https://github.com/owner/repo/pull/123) */
    prUrl?: string;
    /** Repository URL (e.g., https://github.com/owner/repo) */
    repoUrl?: string;
    /** Specific commit SHA to analyze */
    commitSha?: string;
}

export interface GitHubAgentDetails {
    prNumber?: number;
    prTitle?: string;
    prStatus?: 'open' | 'merged' | 'closed';
    ciStatus?: 'passed' | 'failed' | 'pending' | 'unknown';
    filesChanged: number;
    additions: number;
    deletions: number;
    testsAdded?: number;
    codeDiffSummary: string;
    aiAnalysis: string;
    files: Array<{
        filename: string;
        status: string;
        additions: number;
        deletions: number;
    }>;
    [key: string]: unknown; // Index signature for compatibility
}

export type GitHubAgentResult = AgentResult<GitHubAgentDetails>;

// ============================================================================
// Visual Design Diff Agent
// ============================================================================

export interface DesignAgentInput {
    /** Design specification/requirements */
    designSpec: string;
    /** Baseline/reference image URLs */
    baselineImages?: string[];
    /** Submitted design image URLs */
    submittedImages: string[];
    /** Figma file URL (optional) */
    figmaUrl?: string;
}

export interface DesignAgentDetails {
    structuralSimilarity: number | undefined;  // 0-1 score
    colorConsistency: number | undefined;      // 0-1 score
    layoutMatch: boolean | undefined;
    comparedImages: number;
    aiAnalysis: string;
    differences: Array<{
        area: string;
        severity: 'minor' | 'moderate' | 'major';
        description: string;
    }>;
    [key: string]: unknown; // Index signature for compatibility
}

export type DesignAgentResult = AgentResult<DesignAgentDetails>;

// ============================================================================
// Document/Research Diff Agent
// ============================================================================

export interface DocumentAgentInput {
    /** Document specification/outline */
    documentSpec: string;
    /** URL to submitted document (PDF, markdown, etc.) */
    submittedDocUrl?: string;
    /** Direct text content (alternative to URL) */
    submittedContent?: string;
}

export interface DocumentAgentDetails {
    documentType: 'pdf' | 'markdown' | 'text' | 'unknown';
    wordCount: number;
    sectionsFound: string[];
    sectionsMissing: string[];
    structureScore: number;  // 0-100
    relevanceScore: number;  // 0-100
    aiAnalysis: string;
    sectionDetails: Array<{
        name: string;
        found: boolean;
        wordCount?: number;
        summary?: string;
    }>;
    [key: string]: unknown; // Index signature for compatibility
}

export type DocumentAgentResult = AgentResult<DocumentAgentDetails>;

// ============================================================================
// API Request/Response Types
// ============================================================================

export interface AgentApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}
