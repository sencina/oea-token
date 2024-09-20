import { NFT_ADDRESS, WALLET_PRIVATE_KEY } from '@env';
import { generateImage } from '@modules/image/image.generator';
import { uplaodMetadata } from '@modules/image/ipfs';
import { Deployer } from '@modules/nft/service/deployer.impl';
import { PROVIDER } from '@modules/nft/utils/provider';
import { Wallet } from 'ethers';
import { CreateProjectDto, TokenDTO } from '../dto';

export class ProjectService {
  deployer = new Deployer(NFT_ADDRESS!, new Wallet(WALLET_PRIVATE_KEY!, PROVIDER));

  async create(project: CreateProjectDto, host: string, protocol: string) {
    const currentId = await this.deployer.getCurrentId();
    const image = await generateImage(
      project.name,
      'Type',
      '1',
      this.getUrl(host, protocol, project.address, currentId)
    );
    const imageMetadata = await uplaodMetadata(
      {
        name: project.name,
      },
      image
    );

    const tokenId = await this.deployer.deploy(imageMetadata, project.address);

    return new TokenDTO(tokenId, NFT_ADDRESS!);
  }

  async authenticate(address: string, tokenId: string) {
    const isAuthenticated = await this.deployer.authenticate(address, tokenId);

    return { isAuthenticated };
  }

  private getUrl(host: string, protocol: string, address: string, tokenId: string) {
    return `${protocol}://${host}/api/project/${address}/${tokenId}`;
  }
}
