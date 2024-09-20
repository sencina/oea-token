export interface Deployer {
  deploy(hash: string, address: string): Promise<string>;
}
