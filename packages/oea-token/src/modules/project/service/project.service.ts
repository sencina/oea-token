import { NFT_ADDRESS, WALLET_PRIVATE_KEY } from '@env';
import { generateImage } from '@modules/image/image.generator';
import { uplaodMetadata } from '@modules/image/ipfs';
import { Deployer } from '@modules/nft/service/deployer.impl';
import { PROVIDER } from '@modules/nft/utils/provider';
import { Wallet } from 'ethers';

export class ProjectService {
  deployer = new Deployer(NFT_ADDRESS!, new Wallet(WALLET_PRIVATE_KEY!, PROVIDER));

  async create() {
    const image = await generateImage('Name', 'Type', '1', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    const imageMetadata = await uplaodMetadata(
      {
        name: 'Name',
        type: 'Type',
        id: '1',
        url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      },
      image
    );

    const tokenId = await this.deployer.deploy(imageMetadata);

    return tokenId;
  }
}
