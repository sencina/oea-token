import { Contract, Signer } from 'ethers';
import { NFT_ABI } from '../utils/abi';
import { Deployer as IDeployer } from './deployer';
import { NotFoundException } from '@utils/errors';
import { BUCKET_URL } from '@modules/image/utils/constants';

export class Deployer implements IDeployer {
  private contract: Contract;
  private signer: Signer;

  constructor(address: string, signer: Signer) {
    this.signer = signer;
    this.contract = new Contract(address, NFT_ABI, this.signer);
  }

  async deploy(metadataHash: string, to: string): Promise<string> {
    const tx = await this.contract.mint(to, BUCKET_URL(metadataHash));
    const receipt = await tx.wait();
    const event = this.getEventArgs(receipt.logs, 'NFTCreated');
    return event.tokenId.toString();
  }

  async authenticate(address: string, tokenId: string): Promise<boolean> {
    try {
      return (await this.contract.ownerOf(tokenId)) === address;
    } catch (error) {
      return false;
    }
  }

  async getCurrentId(): Promise<string> {
    return (await this.contract.currentId()).toString();
  }

  private getEventArgs(logs, eventName) {
    const event = logs
      .map((log: { topics: ReadonlyArray<string>; data: string }) => {
        return this.contract.interface.parseLog(log);
      })
      .find((parsedLog: { name: string }) => parsedLog && parsedLog.name === eventName);
    if (event) {
      return event.args;
    } else {
      throw new NotFoundException(`Event ${eventName}`);
    }
  }
}
