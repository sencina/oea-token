import { ethers } from 'hardhat';
import { saveAddresses } from './contractAddresses';

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log('Deploying contracts with the account:', deployer.address);

  // Deploy Implementation
  const OEANFTs = await ethers.getContractFactory('OEANFTs');
  const implementation = await OEANFTs.deploy();
  await implementation.waitForDeployment();
  console.log('Implementation deployed to:', await implementation.getAddress());

  // Deploy Proxy Admin
  const OEANFTsProxyAdmin = await ethers.getContractFactory('OEANFTsProxyAdmin');
  const proxyAdmin = await OEANFTsProxyAdmin.deploy(deployer.address);
  await proxyAdmin.waitForDeployment();
  console.log('Proxy Admin deployed to:', await proxyAdmin.getAddress());

  // Prepare initialization data
  const initData = OEANFTs.interface.encodeFunctionData('initialize', ['OEANFTs', 'OEA']);

  // Deploy Transparent Proxy
  const OEANFTsProxy = await ethers.getContractFactory('OEANFTsProxy');
  const proxy = await OEANFTsProxy.deploy(await implementation.getAddress(), await proxyAdmin.getAddress(), initData);
  await proxy.waitForDeployment();
  console.log('Proxy deployed to:', await proxy.getAddress());

  // For interacting with the proxy, use this ABI and address
  const proxyContract = OEANFTs.attach(await proxy.getAddress());
  console.log('Proxy contract owner:', await proxyContract.owner());
  console.log('Current token counter:', await proxyContract.currentId());

  // Save addresses
  saveAddresses({
    implementation: await implementation.getAddress(),
    proxyAdmin: await proxyAdmin.getAddress(),
    proxy: await proxy.getAddress(),
    network: (await ethers.provider.getNetwork()).name,
  });

  console.log('\nDeployment Summary:');
  console.log('-------------------');
  console.log('Implementation:', await implementation.getAddress());
  console.log('Proxy Admin:', await proxyAdmin.getAddress());
  console.log('Proxy:', await proxy.getAddress());
  console.log('\nTo interact with your contract, use the Implementation ABI with the Proxy address');
  console.log('Contract addresses have been saved to contract-addresses.json');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
