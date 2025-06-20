import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT || 8080;
export const TATUM_API_KEY = process.env.TATUM_API_KEY;
export const INFURA_API_KEY = process.env.INFURA_API_KEY;
export const WALLET_PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY;
export const DEPLOYER_ADDRESS = process.env.DEPLOYER_ADDRESS;
export const PROVIDER_URL = process.env.PROVIDER_URL;
export const NETWORK_NAME = process.env.NETWORK_NAME;

// NFT Contract Addresses
export const NFT_ADDRESS = process.env.NFT_ADDRESS;
export const NFT_ADMIN_ADDRESS = process.env.NFT_ADMIN_ADDRESS;
export const NFT_IMPLEMENTATION_ADDRESS = process.env.NFT_IMPLEMENTATION_ADDRESS;

// Wallet Addresses
export const WALLET_ADDRESS = process.env.WALLET_ADDRESS;
export const BALANCE_TRESHOLD = process.env.BALANCE_TRESHOLD;
export const ALERT_EMAIL = process.env.ALERT_EMAIL;
export const RESEND_API_KEY = process.env.RESEND_API_KEY;
export const REDIS_URL = process.env.REDIS_URL;
