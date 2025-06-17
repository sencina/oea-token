import fs from 'fs';
import path from 'path';

interface ContractAddresses {
  proxy: string;
  proxyAdmin: string;
  implementation: string;
  network: string;
}

const ADDRESSES_FILE = path.join(__dirname, '../contract-addresses.json');

export function saveAddresses(addresses: ContractAddresses): void {
  let allAddresses: Record<string, ContractAddresses> = {};

  // Load existing addresses if file exists
  if (fs.existsSync(ADDRESSES_FILE)) {
    const content = fs.readFileSync(ADDRESSES_FILE, 'utf8');
    allAddresses = JSON.parse(content);
  }

  // Update addresses for the network
  allAddresses[addresses.network] = addresses;

  // Save back to file
  fs.writeFileSync(ADDRESSES_FILE, JSON.stringify(allAddresses, null, 2));
}

export function getAddresses(network: string): ContractAddresses | null {
  if (!fs.existsSync(ADDRESSES_FILE)) {
    return null;
  }

  const content = fs.readFileSync(ADDRESSES_FILE, 'utf8');
  const allAddresses: Record<string, ContractAddresses> = JSON.parse(content);
  return allAddresses[network] || null;
}
