import { NETWORK_NAME, NFT_ADDRESS, NFT_ADMIN_ADDRESS, NFT_IMPLEMENTATION_ADDRESS } from '@env';
import { ContractAddressNotFoundError, ContractConfigurationError } from './errors';
import { Logger } from '@utils/logger';

const logger = new Logger('ContractConfig');

/**
 * Interface representing contract addresses for a specific deployment
 * @interface ContractAddresses
 */
interface ContractAddresses {
  /** Address of the proxy contract that users interact with */
  proxy: string;
  /** Address of the proxy admin contract that controls upgrades */
  proxyAdmin: string;
  /** Address of the current implementation contract */
  implementation: string;
  /** Network where the contracts are deployed */
  network: string;
}

/**
 * Gets the proxy contract address from environment variables
 * @throws {ContractConfigurationError} If the NFT_ADDRESS is not configured
 * @returns {string} The proxy contract address
 */
export function getProxyAddress(): string {
  try {
    logger.debug('Getting proxy address from environment');

    if (!NFT_ADDRESS) {
      logger.error('NFT address is not configured in environment');
      throw new ContractConfigurationError('NFT_ADDRESS is not configured in environment');
    }

    logger.info('Proxy address retrieved successfully', { 
      address: NFT_ADDRESS 
    });

    return NFT_ADDRESS;
  } catch (error) {
    logger.error('Failed to get proxy address', error as Error);
    throw new ContractConfigurationError('Failed to get proxy address', error);
  }
}

/**
 * Gets all contract addresses for the current network from environment variables
 * @throws {ContractAddressNotFoundError} If required environment variables are not set
 * @throws {ContractConfigurationError} If there's an error reading the configuration
 * @returns {ContractAddresses} The contract addresses for the current network
 */
export function getCurrentNetworkAddresses(): ContractAddresses {
  logger.debug('Getting network addresses from environment');

  if (!NETWORK_NAME) {
    logger.error('Network name is not configured');
    throw new ContractConfigurationError('NETWORK_NAME is not configured in environment');
  }

  if (!NFT_ADDRESS || !NFT_ADMIN_ADDRESS || !NFT_IMPLEMENTATION_ADDRESS) {
    logger.error('Required contract addresses not found in environment');
    throw new ContractAddressNotFoundError(
      'One or more required contract addresses are not configured in environment. ' +
      'Required: NFT_ADDRESS, NFT_ADMIN_ADDRESS, NFT_IMPLEMENTATION_ADDRESS'
    );
  }

  const addresses: ContractAddresses = {
    proxy: NFT_ADDRESS,
    proxyAdmin: NFT_ADMIN_ADDRESS,
    implementation: NFT_IMPLEMENTATION_ADDRESS,
    network: NETWORK_NAME
  };

  logger.info('Network addresses retrieved successfully', { 
    network: NETWORK_NAME,
    addresses
  });

  return addresses;
} 