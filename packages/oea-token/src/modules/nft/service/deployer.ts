export interface Deployer {
  deploy(hash: string, address: string): Promise<string>;
  authenticate(address: string, tokenId: string): Promise<boolean>;
  getCurrentId(): Promise<string>;
}
