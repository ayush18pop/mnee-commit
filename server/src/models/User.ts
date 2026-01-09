/**
 * User Model - Username to Wallet Address Mapping
 */

import mongoose, { Schema, type Document } from 'mongoose';

export interface IUser extends Document {
    username: string;
    walletAddress: string;
    discordId?: string;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        walletAddress: {
            type: String,
            required: true,
            trim: true,
            validate: {
                validator: function (v: string) {
                    // Basic Ethereum address validation
                    return /^0x[a-fA-F0-9]{40}$/.test(v);
                },
                message: 'Invalid wallet address format',
            },
        },
        discordId: {
            type: String,
            trim: true,
            sparse: true,
        },
    },
    {
        timestamps: true,
    }
);

// Create compound index for wallet address lookups
UserSchema.index({ walletAddress: 1 });

export const User = mongoose.model<IUser>('User', UserSchema);
