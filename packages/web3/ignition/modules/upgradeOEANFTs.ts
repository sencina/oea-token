import { ethers } from 'hardhat';
import { getAddresses, saveAddresses } from './contractAddresses';

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log('Upgrading contract with the account:', deployer.address);

  // Get the network
  const network = (await ethers.provider.getNetwork()).name;

  // Get existing addresses
  const addresses = getAddresses(network);
  if (!addresses) {
    throw new Error(`No deployment found for network ${network}. Please deploy the contracts first.`);
  }

  // Deploy new implementation
  const OEANFTs = await ethers.getContractFactory('OEANFTs');
  const newImplementation = await OEANFTs.deploy();
  await newImplementation.waitForDeployment();
  console.log('New implementation deployed to:', await newImplementation.getAddress());

  // Get the proxy admin contract
  const ProxyAdmin = await ethers.getContractFactory('OEANFTsProxyAdmin');
  const proxyAdmin = ProxyAdmin.attach(addresses.proxyAdmin);

  // Upgrade the implementation
  const upgradeTx = await proxyAdmin.upgradeAndCall(
    addresses.proxy,
    await newImplementation.getAddress(),
    '0x' // No need to call initialize again as it's already initialized
  );
  await upgradeTx.wait();
  console.log('Proxy upgraded to new implementation');

  // Save the new implementation address
  saveAddresses({
    ...addresses,
    implementation: await newImplementation.getAddress(),
  });

  // Verify the upgrade
  const upgradedContract = OEANFTs.attach(addresses.proxy);
  console.log('\nVerifying upgrade:');
  console.log('------------------');
  console.log('Proxy contract owner:', await upgradedContract.owner());
  console.log('Current token counter:', await upgradedContract.currentId());

  console.log('\nUpgrade Summary:');
  console.log('---------------');
  console.log('New Implementation:', await newImplementation.getAddress());
  console.log('Proxy Admin:', addresses.proxyAdmin);
  console.log('Proxy:', addresses.proxy);
  console.log(
    '\nYour contract has been upgraded. Continue using the same proxy address with the new implementation ABI.'
  );
  console.log('Updated contract addresses have been saved to contract-addresses.json');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
