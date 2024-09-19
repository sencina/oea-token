export interface Deployer {
  deploy(hash: string): Promise<string>;
}
