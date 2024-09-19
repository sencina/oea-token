import { TatumSDK, Network, Polygon } from '@tatumio/tatum';
import { readFileSync } from 'fs';
import { TATUM_API_KEY } from '../../env';
import path from 'path';

const main = async () => {
  const tatumClient = await TatumSDK.init<Polygon>({
    network: Network.POLYGON,
    verbose: true,
    apiKey: {
      v4: TATUM_API_KEY,
    },
  });

  const filePath = path.resolve(__dirname, '../../assets/ms.jpg');

  const buffer = readFileSync(filePath);

  const result = await tatumClient.ipfs.uploadFile({ file: buffer });
  const imageHash = result.data.ipfsHash;

  await tatumClient.ipfs.uploadFile({ file: buffer });
  await tatumClient.destroy();
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
