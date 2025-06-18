import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

interface ContractAddresses {
  proxy: string;
  proxyAdmin: string;
  implementation: string;
  network: string;
}

/**
 * Default environment variables configuration
 */
const DEFAULT_ENV_CONFIG = {
  PORT: '10000',
  TATUM_API_KEY: '', // Required for Tatum API
  INFURA_API_KEY: '', // Required for Infura provider
  WALLET_PRIVATE_KEY: '', // Required for contract interactions
  DEPLOYER_ADDRESS: '', // Required for contract deployment
  PROVIDER_URL: 'https://polygon-amoy.infura.io/v3', // Default to Amoy network
  NETWORK_NAME: 'matic-amoy', // Default to Amoy network
  NFT_ADDRESS: '',
  NFT_ADMIN_ADDRESS: '',
  NFT_IMPLEMENTATION_ADDRESS: '',
};

/**
 * Updates the .env file with new contract addresses while preserving other variables
 * @param addresses Contract addresses to save
 */
export function updateEnvFile(addresses: ContractAddresses): void {
  // Get the absolute path to the project root
  const projectRoot = path.resolve(__dirname, '../../../..');
  const envPath = path.join(projectRoot, 'packages', 'oea-token', '.env');

  try {
    // Create the directory if it doesn't exist
    const envDir = path.dirname(envPath);
    if (!fs.existsSync(envDir)) {
      fs.mkdirSync(envDir, { recursive: true });
    }

    // Read existing .env file or use default config if it doesn't exist
    let envConfig = { ...DEFAULT_ENV_CONFIG };
    if (fs.existsSync(envPath)) {
      const existingConfig = dotenv.parse(fs.readFileSync(envPath));
      envConfig = { ...envConfig, ...existingConfig };
    }

    // Update only contract addresses
    envConfig['NFT_ADDRESS'] = addresses.proxy;
    envConfig['NFT_ADMIN_ADDRESS'] = addresses.proxyAdmin;
    envConfig['NFT_IMPLEMENTATION_ADDRESS'] = addresses.implementation;

    // Convert to .env file format with comments
    const envContent = [
      '# Server Configuration',
      `PORT=${envConfig.PORT}`,
      '',
      '# API Keys',
      `TATUM_API_KEY=${envConfig.TATUM_API_KEY}`,
      `INFURA_API_KEY=${envConfig.INFURA_API_KEY}`,
      '',
      '# Blockchain Configuration',
      `WALLET_PRIVATE_KEY=${envConfig.WALLET_PRIVATE_KEY}`,
      `DEPLOYER_ADDRESS=${envConfig.DEPLOYER_ADDRESS}`,
      `PROVIDER_URL=${envConfig.PROVIDER_URL}`,
      `NETWORK_NAME=${envConfig.NETWORK_NAME}`,
      '',
      '# NFT Contract Addresses',
      `NFT_ADDRESS=${envConfig.NFT_ADDRESS}`,
      `NFT_ADMIN_ADDRESS=${envConfig.NFT_ADMIN_ADDRESS}`,
      `NFT_IMPLEMENTATION_ADDRESS=${envConfig.NFT_IMPLEMENTATION_ADDRESS}`,
    ].join('\n');

    // Write back to .env file
    fs.writeFileSync(envPath, envContent);

    console.log('Environment variables updated successfully in:', envPath);
    console.log('\nIMPORTANT: Please set the following required environment variables:');
    console.log('- TATUM_API_KEY: Required for Tatum API integration');
    console.log('- WALLET_PRIVATE_KEY: Required for contract interactions');
    if (!envConfig.PROVIDER_URL || !envConfig.NETWORK_NAME) {
      console.log('WARNING: PROVIDER_URL and/or NETWORK_NAME are not set');
    }
  } catch (error) {
    console.error('Failed to update environment variables:', error);
    throw error;
  }
}
