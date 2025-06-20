import { ethers } from 'ethers';
import { WalletBalance, WalletService as IWalletService } from './wallet.service';

export class WalletService implements IWalletService {
  private provider: ethers.Provider;

  constructor(provider: ethers.Provider) {
    this.provider = provider;
  }

  async getWalletBalance(address: string): Promise<WalletBalance> {
    try {
      // Validate address format
      if (!ethers.isAddress(address)) {
        throw new Error(`Invalid wallet address format: ${address}`);
      }

      // Add retry logic for network issues
      let retries = 3;
      let lastError: any;

      while (retries > 0) {
        try {
          const balance = await this.provider.getBalance(address);
          const balanceInEth = parseFloat(ethers.formatEther(balance));

          return {
            address,
            balance: balanceInEth,
            balanceInWei: balance.toString(),
          };
        } catch (error: any) {
          lastError = error;
          retries--;

          if (retries > 0) {
            console.log(`Retrying balance check for ${address}, attempts left: ${retries}`);
            // Wait 2 seconds before retry
            await new Promise((resolve) => setTimeout(resolve, 2000));
          }
        }
      }

      throw lastError;
    } catch (error: any) {
      console.error('Error getting wallet balance:', error);

      // More specific error handling
      if (error.code === 'UNKNOWN_ERROR' && error.error?.message === 'header not found') {
        throw new Error(
          `Network sync issue: Cannot get balance for wallet ${address}. The network might be experiencing issues or the wallet might not exist on this network.`
        );
      }

      throw new Error(`Failed to get balance for wallet ${address}: ${error.message}`);
    }
  }

  isBalanceBelowThreshold(balance: number, threshold: number): boolean {
    return balance < threshold;
  }
}
