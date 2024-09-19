import dotenv from 'dotenv';
dotenv.config();

export const WALLET_ADDRESS = process.env.WALLET_ADDRESS;
export const WALLET_PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY;
export const NETWORK_URL = process.env.NETWORK_URL;
export const TATUM_API_KEY = process.env.TATUM_API_KEY;