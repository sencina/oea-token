import { ethers } from 'hardhat';

const main = async () => {
  const MyContract = await ethers.getContractFactory('OEANFTs');
  const metadataHash = 'bafkreiccparztqw5li6osq6ikcvllijutaoaiih6lmthiabnwnkgy66mnq';
  const myContract = await MyContract.deploy("OEANFTs", "OEA");
  await myContract.waitForDeployment();
  const address = await myContract.getAddress();
  console.log('MyContract deployed to:', address);
  await myContract.mint('0x9bfcd93Cf0490F82427a4bFD911002438C728D19', metadataHash);
  console.log('Minted NFT with metadata hash:', metadataHash);
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
