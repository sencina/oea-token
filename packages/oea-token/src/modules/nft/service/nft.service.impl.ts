import { Contract, Signer } from 'ethers';
import { NFT_ABI } from '../utils/abi';
import { NFTService } from './nft.service';
import { NotFoundException } from '@utils/errors';
import { BUCKET_URL } from '@modules/image/utils/constants';
import { getProxyAddress } from '../utils/contract.config';
import { ContractInitializationError, ContractTransactionError } from '../utils/errors';
import { Logger } from '@utils/logger';

const logger = new Logger('NFTService');

/**
 * Implementation of the NFT service that interacts with the upgradeable NFT contract
 * through its proxy.
 *
 * This class handles:
 * - NFT minting with metadata
 * - Token authentication
 * - Token ID tracking
 *
 * @implements {NFTService}
 */
export class NFTServiceImpl implements NFTService {
  private contract: Contract;
  private signer: Signer;

  /**
   * Creates a new instance of the NFT service
   * @param signer - The signer that will be used for transactions
   * @throws {ContractInitializationError} If the contract cannot be initialized
   */
  constructor(signer: Signer) {
    try {
      logger.debug('Initializing NFT service');
      this.signer = signer;
      const proxyAddress = getProxyAddress();
      this.contract = new Contract(proxyAddress, NFT_ABI, this.signer);
      logger.info('NFT service initialized successfully', {
        proxyAddress,
        signerAddress: this.signer.getAddress(),
      });
    } catch (error) {
      logger.error('Failed to initialize NFT contract', error as Error);
      throw new ContractInitializationError('Failed to initialize NFT contract', error);
    }
  }

  /**
   * Mints a new NFT with the given metadata
   * @param metadataHash - The IPFS hash of the NFT metadata
   * @param to - The address that will receive the NFT
   * @returns The ID of the newly minted token
   * @throws {ContractTransactionError} If the minting transaction fails
   */
  async mint(metadataHash: string, to: string): Promise<string> {
    try {
      logger.debug('Starting NFT minting', {
        metadataHash,
        to,
        tokenUri: BUCKET_URL(metadataHash),
      });

      const tx = await this.contract.mint(to, BUCKET_URL(metadataHash));
      logger.debug('Mint transaction submitted', {
        transactionHash: tx.hash,
      });

      const receipt = await tx.wait();
      logger.debug('Mint transaction confirmed', {
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString(),
      });

      const event = this.getEventArgs(receipt.logs, 'NFTCreated');
      const tokenId = event.tokenId.toString();

      logger.info('NFT minted successfully', {
        tokenId,
        owner: to,
        transactionHash: receipt.transactionHash,
      });

      return tokenId;
    } catch (error) {
      logger.error('NFT minting failed', error as Error, {
        metadataHash,
        to,
      });
      throw new ContractTransactionError('NFT minting', error);
    }
  }

  /**
   * Authenticates whether an address owns a specific token
   * @param address - The address to check
   * @param tokenId - The ID of the token
   * @returns True if the address owns the token, false otherwise
   */
  async authenticate(address: string, tokenId: string): Promise<boolean> {
    try {
      logger.debug('Authenticating token ownership', {
        address,
        tokenId,
      });

      const isAuthentic = await this.contract.authenticate(address, tokenId);

      logger.debug('Token authentication completed', {
        address,
        tokenId,
        isAuthentic,
      });

      return isAuthentic;
    } catch (error) {
      const context = {
        address,
        tokenId,
        error: error as Error,
      };
      logger.warn('Token authentication failed', context);
      // Authentication failures are expected and should return false
      return false;
    }
  }

  /**
   * Gets the current token ID counter
   * @returns The current token ID as a string
   * @throws {ContractTransactionError} If the query fails
   */
  async getCurrentId(): Promise<string> {
    try {
      logger.debug('Getting current token ID');
      const currentId = (await this.contract.currentId()).toString();
      logger.debug('Current token ID retrieved', { currentId });
      return currentId;
    } catch (error) {
      logger.error('Failed to get current token ID', error as Error);
      throw new ContractTransactionError('getting current token ID', error);
    }
  }

  /**
   * Helper function to extract event arguments from transaction logs
   * @param logs - The transaction logs to parse
   * @param eventName - The name of the event to look for
   * @returns The event arguments
   * @throws {NotFoundException} If the event is not found in the logs
   * @private
   */
  private getEventArgs(logs: Array<{ topics: ReadonlyArray<string>; data: string }>, eventName: string) {
    logger.debug('Parsing transaction logs for event', {
      eventName,
      logsCount: logs.length,
    });

    const event = logs
      .map((log) => {
        try {
          return this.contract.interface.parseLog(log);
        } catch (error) {
          logger.debug('Failed to parse log entry', { error });
          return null;
        }
      })
      .find((parsedLog) => parsedLog && parsedLog.name === eventName);

    if (event) {
      // Convert BigInt values to strings in event args for logging
      const serializedArgs = Object.fromEntries(
        Object.entries(event.args).map(([key, value]) => [key, typeof value === 'bigint' ? value.toString() : value])
      );

      logger.debug('Event found in logs', {
        eventName,
        args: serializedArgs,
      });
      return event.args;
    } else {
      const context = {
        eventName,
        availableEvents: logs
          .map((log) => {
            try {
              return this.contract.interface.parseLog(log)?.name;
            } catch {
              return null;
            }
          })
          .filter(Boolean),
      };
      logger.error('Event not found in transaction logs', undefined, context);
      throw new NotFoundException(`Event ${eventName} not found in transaction logs`);
    }
  }
}
