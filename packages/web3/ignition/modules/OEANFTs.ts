import { ethers } from 'hardhat';
import { updateEnvFile } from './envManager';

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

  // Attach the OEANFTs contract to the proxy address
  const proxyContract = OEANFTs.attach(await proxy.getAddress());

  // Verify the contract is properly initialized
  try {
    const currentId = await proxyContract.currentId();
    console.log('Current token counter:', currentId.toString());

    // Try to mint a test token
    const tx = await proxyContract.mint(deployer.address, 'test-uri');
    await tx.wait();

    const newCurrentId = await proxyContract.currentId();
    console.log('New token counter after mint:', newCurrentId.toString());

    // Get the contract owner
    const owner = await proxyContract.owner();
    console.log('Contract owner:', owner);

    console.log('Contract verification successful!');
  } catch (error) {
    console.error('Contract verification failed:', error);
    throw error;
  }

  // Save addresses to environment variables
  const addresses = {
    implementation: await implementation.getAddress(),
    proxyAdmin: await proxyAdmin.getAddress(),
    proxy: await proxy.getAddress(),
    network: (await ethers.provider.getNetwork()).name,
  };

  updateEnvFile(addresses);

  console.log('\nDeployment Summary:');
  console.log('-------------------');
  console.log('Implementation:', addresses.implementation);
  console.log('Proxy Admin:', addresses.proxyAdmin);
  console.log('Proxy:', addresses.proxy);
  console.log('Network:', addresses.network);
  console.log('\nTo interact with your contract, use the Implementation ABI with the Proxy address');
  console.log('Contract addresses have been saved to environment variables');
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
