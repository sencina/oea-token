import { ethers } from 'hardhat';

const main = async () => {
  // const MyContract = await ethers.getContractFactory('My1155');
  // const metadataHash = 'bafkreict6kqmy5jlhg6zekrwfpweore44k2qhvxtdvo7nlhpiqccbimaba';
  // // const myContract = await MyContract.deploy(`ipfs://${metadataHash}`);
  // await myContract.waitForDeployment();
  // const address = await myContract.getAddress();
  // console.log('MyContract deployed to:', address);
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
