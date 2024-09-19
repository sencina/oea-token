import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT || 8080;
export const TATUM_API_KEY = process.env.TATUM_API_KEY;
export const INFURA_API_KEY = process.env.INFURA_API_KEY;
export const WALLET_PRIVATE_KEY = process.env.WALLET_PRIVATE_KEY;
export const DEPLOYER_ADDRESS = process.env.DEPLOYER_ADDRESS;
export const PROVIDER_URL = process.env.PROVIDER_URL;
export const NETWORK_NAME = process.env.NETWORK_NAME;
