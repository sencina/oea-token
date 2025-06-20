export interface WalletBalance {
  address: string;
  balance: number;
  balanceInWei: string;
}

export interface WalletService {
  getWalletBalance(address: string): Promise<WalletBalance>;
  isBalanceBelowThreshold(balance: number, threshold: number): boolean;
}
