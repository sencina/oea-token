import { ContractTransactionError } from '../utils/errors';

/**
 * Interface for the NFT deployment service
 * This service handles the interaction with the upgradeable NFT contract
 */
export interface Deployer {
  /**
   * Deploys a new NFT with the given metadata
   * @param hash - The IPFS hash of the NFT metadata
   * @param address - The address that will receive the NFT
   * @returns The ID of the newly minted token
   * @throws {ContractTransactionError} If the minting transaction fails
   */
  deploy(hash: string, address: string): Promise<string>;

  /**
   * Authenticates whether an address owns a specific token
   * @param address - The address to check
   * @param tokenId - The ID of the token to verify
   * @returns True if the address owns the token, false otherwise
   */
  authenticate(address: string, tokenId: string): Promise<boolean>;

  /**
   * Gets the current token ID counter from the contract
   * @returns The current token ID as a string
   * @throws {ContractTransactionError} If the query fails
   */
  getCurrentId(): Promise<string>;
}
