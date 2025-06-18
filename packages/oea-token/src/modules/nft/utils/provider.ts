import { PROVIDER_URL } from '@env';
import { JsonRpcProvider } from 'ethers';
import { Logger } from '@utils/logger';

const logger = new Logger('Provider');

/**
 * Creates the appropriate provider based on the network configuration
 */
function createProvider() {
  // For Amoy network, use the provided RPC URL
  const providerUrl = PROVIDER_URL || 'https://polygon-amoy.infura.io/v3';
  logger.debug('Using JSON-RPC provider for Amoy', { url: providerUrl });
  return new JsonRpcProvider(providerUrl);
}

export const PROVIDER = createProvider();
