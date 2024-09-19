import { Contract, Signer } from 'ethers';
import { deployerAbi } from '../utils/abi';
import { Deployer as IDeployer } from './deployer';
import { NotFoundException } from '@utils/errors';
import { BUCKET_URL } from '@modules/image/utils/constants';

export class Deployer implements IDeployer {
  private contract: Contract;
  private signer: Signer;

  constructor(address: string, signer: Signer) {
    this.signer = signer;
    this.contract = new Contract(address, deployerAbi, this.signer);
  }

  async deploy(metadataHash: string) {
    const tx = await this.contract.deploy(BUCKET_URL(metadataHash));
    const receipt = await tx.wait();
    const event = receipt.logs
      .map((log: { topics: ReadonlyArray<string>; data: string }) => {
        return this.contract.interface.parseLog(log);
      })
      .find((parsedLog: { name: string }) => parsedLog && parsedLog.name === 'ContractDeployed');

    if (event) {
      const deployedAddress = event.args?.contractAddress;
      return deployedAddress;
    } else {
      throw new NotFoundException('Address not found');
    }
  }
}
