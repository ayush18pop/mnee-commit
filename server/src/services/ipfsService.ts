/**
 * IPFS Service - Upload evidence to IPFS via Pinata
 */

import axios from 'axios';
import FormData from 'form-data';
import { PINATA_API_KEY, PINATA_SECRET_KEY, PINATA_GATEWAY } from '../config/index.js';

const PINATA_API_URL = 'https://api.pinata.cloud';

/**
 * Check if IPFS service is configured
 */
export function isIpfsConfigured(): boolean {
    return Boolean(PINATA_API_KEY && PINATA_SECRET_KEY);
}

/**
 * Upload JSON data to IPFS
 * @param data - JSON object to upload
 * @param name - Optional name for the pin
 * @returns IPFS CID
 */
export async function uploadJSON(data: object, name?: string): Promise<string> {
    if (!isIpfsConfigured()) {
        throw new Error('IPFS not configured - missing Pinata credentials');
    }

    const response = await axios.post(
        `${PINATA_API_URL}/pinning/pinJSONToIPFS`,
        {
            pinataContent: data,
            pinataMetadata: {
                name: name || `evidence-${Date.now()}`,
            },
        },
        {
            headers: {
                'Content-Type': 'application/json',
                pinata_api_key: PINATA_API_KEY,
                pinata_secret_api_key: PINATA_SECRET_KEY,
            },
        }
    );

    return response.data.IpfsHash;
}

/**
 * Upload a file buffer to IPFS
 * @param buffer - File buffer
 * @param filename - Filename
 * @returns IPFS CID
 */
export async function uploadFile(buffer: Buffer, filename: string): Promise<string> {
    if (!isIpfsConfigured()) {
        throw new Error('IPFS not configured - missing Pinata credentials');
    }

    const formData = new FormData();
    formData.append('file', buffer, { filename });
    formData.append('pinataMetadata', JSON.stringify({ name: filename }));

    const response = await axios.post(
        `${PINATA_API_URL}/pinning/pinFileToIPFS`,
        formData,
        {
            headers: {
                ...formData.getHeaders(),
                pinata_api_key: PINATA_API_KEY,
                pinata_secret_api_key: PINATA_SECRET_KEY,
            },
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
        }
    );

    return response.data.IpfsHash;
}

/**
 * Get gateway URL for a CID
 * @param cid - IPFS CID
 * @returns Full gateway URL
 */
export function getGatewayUrl(cid: string): string {
    return `${PINATA_GATEWAY}/${cid}`;
}

/**
 * Fetch content from IPFS
 * @param cid - IPFS CID
 * @returns Content as JSON or string
 */
export async function fetchFromIpfs(cid: string): Promise<unknown> {
    const url = getGatewayUrl(cid);
    const response = await axios.get(url);
    return response.data;
}
