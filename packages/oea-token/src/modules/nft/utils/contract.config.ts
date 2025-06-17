import { NETWORK_NAME, NFT_ADDRESS } from '@env';
import { readFileSync } from 'fs';
import { join } from 'path';
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
 * Interface representing contract addresses for multiple networks
 * @interface NetworkAddresses
 */
interface NetworkAddresses {
  [network: string]: ContractAddresses;
}

/**
 * Path to the contract addresses file
 * Tries multiple possible locations to support both Docker and local environments
 * @constant
 */
function getContractAddressesPath(): string {
  const possiblePaths = [
    // Docker path
    join('/app/web3/ignition/contract-addresses.json'),
    // Local development path
    join(__dirname, '../../../../../../../packages/web3/ignition/contract-addresses.json'),
  ];

  for (const path of possiblePaths) {
    try {
      readFileSync(path, 'utf8');
      return path;
    } catch (error) {
      logger.debug('Contract addresses file not found at path', { path });
    }
  }

  return possiblePaths[0]; // Default to Docker path
}

const CONTRACT_ADDRESSES_PATH = getContractAddressesPath();

/**
 * Reads and parses the contract addresses from the deployment file
 * @throws {ContractConfigurationError} If the file cannot be read or parsed
 * @returns {NetworkAddresses} The contract addresses for all networks
 */
function getContractAddresses(): NetworkAddresses {
  try {
    logger.debug('Reading contract addresses', { path: CONTRACT_ADDRESSES_PATH });
    const addresses = JSON.parse(readFileSync(CONTRACT_ADDRESSES_PATH, 'utf8'));
    logger.debug('Contract addresses loaded successfully', { networks: Object.keys(addresses) });
    return addresses;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      logger.error('Contract addresses file not found', error as Error, { path: CONTRACT_ADDRESSES_PATH });
      throw new ContractConfigurationError(
        'Contract addresses file not found. Please deploy the contracts first.',
        error
      );
    }
    logger.error('Failed to read contract addresses', error as Error, { path: CONTRACT_ADDRESSES_PATH });
    throw new ContractConfigurationError(
      'Failed to read contract addresses configuration',
      error
    );
  }
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
      throw new ContractConfigurationError('NFT address is not configured in environment');
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
 * Gets all contract addresses for the current network
 * @throws {ContractAddressNotFoundError} If no addresses are found for the current network
 * @throws {ContractConfigurationError} If there's an error reading the configuration
 * @returns {ContractAddresses} The contract addresses for the current network
 */
export function getCurrentNetworkAddresses(): ContractAddresses {
  const addresses = getContractAddresses();
  const network = NETWORK_NAME;

  logger.debug('Getting network addresses', { network });

  if (!network) {
    logger.error('Network name is not configured');
    throw new ContractConfigurationError('Network name is not configured');
  }

  const networkAddresses = addresses[network];
  
  if (!networkAddresses) {
    logger.error('Network addresses not found', undefined, { network });
    throw new ContractAddressNotFoundError(network);
  }

  logger.info('Network addresses retrieved successfully', { 
    network,
    addresses: networkAddresses
  });

  return networkAddresses;
} 