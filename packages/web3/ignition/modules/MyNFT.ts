import { ethers } from 'hardhat';

const main = async () => {
  const MyContract = await ethers.getContractFactory('MyNFT');
  const metadataHash = 'bafkreiccparztqw5li6osq6ikcvllijutaoaiih6lmthiabnwnkgy66mnq';
  const myContract = await MyContract.deploy(`ipfs://${metadataHash}`);
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
