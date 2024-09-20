import { ethers } from 'hardhat';

const main = async () => {
  const MyContract = await ethers.getContractFactory('OEANFTs');
  const myContract = await MyContract.deploy("OEANFTs", "OEA");
  await myContract.waitForDeployment();
  const address = await myContract.getAddress();
  console.log('MyContract deployed to:', address);
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
