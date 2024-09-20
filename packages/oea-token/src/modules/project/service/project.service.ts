import { NFT_ADDRESS, WALLET_PRIVATE_KEY } from '@env';
import { generateImage } from '@modules/image/image.generator';
import { uplaodMetadata } from '@modules/image/ipfs';
import { Deployer } from '@modules/nft/service/deployer.impl';
import { PROVIDER } from '@modules/nft/utils/provider';
import { Wallet } from 'ethers';
import { CreateProjectDto } from '../dto';

export class ProjectService {
  deployer = new Deployer(NFT_ADDRESS!, new Wallet(WALLET_PRIVATE_KEY!, PROVIDER));

  async create(project: CreateProjectDto) {
    const image = await generateImage(project.name, 'Type', '1', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    const imageMetadata = await uplaodMetadata(
      {
        name: project.name,
      },
      image
    );

    const tokenId = await this.deployer.deploy(imageMetadata, project.address);

    return tokenId;
  }
}
