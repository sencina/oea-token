import { INFURA_API_KEY, NETWORK_NAME } from '@env';
import { InfuraProvider } from 'ethers';

export const PROVIDER = new InfuraProvider(NETWORK_NAME, INFURA_API_KEY);
