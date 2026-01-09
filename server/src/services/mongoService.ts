/**
 * MongoDB Service - Database Connection and Management
 */

import mongoose from 'mongoose';
import { MONGODB_URI } from '../config/index.js';

let isConnected = false;

/**
 * Connect to MongoDB
 */
export async function connectToMongoDB(): Promise<void> {
    if (isConnected) {
        return;
    }

    if (!MONGODB_URI) {
        console.warn('[MongoDB] No MONGODB_URI configured - database features disabled');
        return;
    }

    try {
        await mongoose.connect(MONGODB_URI);
        isConnected = true;
        console.log('[MongoDB] Connected successfully');
    } catch (error) {
        console.error('[MongoDB] Connection failed:', error);
        throw error;
    }
}

/**
 * Disconnect from MongoDB
 */
export async function disconnectFromMongoDB(): Promise<void> {
    if (!isConnected) {
        return;
    }

    try {
        await mongoose.disconnect();
        isConnected = false;
        console.log('[MongoDB] Disconnected');
    } catch (error) {
        console.error('[MongoDB] Disconnect failed:', error);
    }
}

/**
 * Check if MongoDB is connected
 */
export function isMongoDBConnected(): boolean {
    return isConnected && mongoose.connection.readyState === 1;
}
