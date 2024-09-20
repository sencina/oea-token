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

  async deploy(metadataHash: string) {
    const tx = await this.contract.mint('0x9bfcd93Cf0490F82427a4bFD911002438C728D19', BUCKET_URL(metadataHash));
    const receipt = await tx.wait();
    const event = receipt.logs
      .map((log: { topics: ReadonlyArray<string>; data: string }) => {
        return this.contract.interface.parseLog(log);
      })
      .find((parsedLog: { name: string }) => parsedLog && parsedLog.name === 'NFTCreated');
    console.log(receipt.logs);
    console.log(event);
    if (event) {
      const deployedAddress = event.args?.tokenId;
      return deployedAddress;
    } else {
      throw new NotFoundException('Event not found');
    }
  }
}
