import fs from 'fs';
import path from 'path';

interface ContractAddresses {
  implementation: string;
  proxyAdmin: string;
  proxy: string;
  network: string;
}

interface AddressesFile {
  [network: string]: ContractAddresses;
}

const ADDRESSES_FILE = path.join(__dirname, '../contract-addresses.json');

export function getAddresses(network: string): ContractAddresses | null {
  try {
    if (!fs.existsSync(ADDRESSES_FILE)) {
      return null;
    }
    const addresses: AddressesFile = JSON.parse(fs.readFileSync(ADDRESSES_FILE, 'utf8'));
    return addresses[network] || null;
  } catch (error) {
    console.error('Error reading addresses:', error);
    return null;
  }
}

export function saveAddresses(addresses: ContractAddresses, network: string): void {
  try {
    let allAddresses: AddressesFile = {};
    if (fs.existsSync(ADDRESSES_FILE)) {
      allAddresses = JSON.parse(fs.readFileSync(ADDRESSES_FILE, 'utf8'));
    }

    allAddresses[network] = {
      ...addresses,
      network,
    };

    fs.writeFileSync(ADDRESSES_FILE, JSON.stringify(allAddresses, null, 2));
  } catch (error) {
    console.error('Error saving addresses:', error);
    throw error;
  }
}
