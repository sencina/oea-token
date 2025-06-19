import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { Contract } from "ethers";

describe("OEANFTs Upgrade", function () {
  async function deployContractFixture() {
    // Get signers
    const [owner, otherAccount] = await ethers.getSigners();

    // Deploy initial version
    const OEANFTs = await ethers.getContractFactory("OEANFTs");
    const nft = await upgrades.deployProxy(OEANFTs, ["OEANFTs", "OEA"], {
      initializer: "initialize",
    });

    return { nft, owner, otherAccount };
  }

  describe("Storage Persistence", function () {
    it("Should maintain counter and NFT data after upgrade", async function () {
      const { nft, owner, otherAccount } = await loadFixture(deployContractFixture);

      // Mint some NFTs before upgrade
      await nft.mint(otherAccount.address, "token-1");
      await nft.mint(otherAccount.address, "token-2");

      // Verify initial state
      expect(await nft.currentId()).to.equal(2n);
      expect(await nft.tokenURI(0)).to.equal("token-1");
      expect(await nft.tokenURI(1)).to.equal("token-2");
      expect(await nft.ownerOf(0)).to.equal(otherAccount.address);
      expect(await nft.ownerOf(1)).to.equal(otherAccount.address);

      // Deploy new implementation and upgrade
      const OEANFTsV2 = await ethers.getContractFactory("OEANFTs");
      const upgradedNft = await upgrades.upgradeProxy(nft, OEANFTsV2);

      // Verify state is maintained after upgrade
      expect(await upgradedNft.currentId()).to.equal(2n);
      expect(await upgradedNft.tokenURI(0)).to.equal("token-1");
      expect(await upgradedNft.tokenURI(1)).to.equal("token-2");
      expect(await upgradedNft.ownerOf(0)).to.equal(otherAccount.address);
      expect(await upgradedNft.ownerOf(1)).to.equal(otherAccount.address);

      // Verify we can still mint after upgrade
      await upgradedNft.mint(otherAccount.address, "token-3");
      expect(await upgradedNft.currentId()).to.equal(3n);
      expect(await upgradedNft.tokenURI(2)).to.equal("token-3");
      expect(await upgradedNft.ownerOf(2)).to.equal(otherAccount.address);
    });

    it("Should not allow reinitialization after upgrade", async function () {
      const { nft } = await loadFixture(deployContractFixture);

      // Upgrade to new implementation
      const OEANFTsV2 = await ethers.getContractFactory("OEANFTs");
      const upgradedNft = await upgrades.upgradeProxy(nft, OEANFTsV2);

      // Attempt to initialize again should fail
      await expect(
        upgradedNft.initialize("NewName", "NEW")
      ).to.be.reverted;
    });

    it("Should maintain name and symbol after upgrade", async function () {
      const { nft } = await loadFixture(deployContractFixture);

      // Store initial values
      const initialName = await nft.name();
      const initialSymbol = await nft.symbol();

      // Upgrade to new implementation
      const OEANFTsV2 = await ethers.getContractFactory("OEANFTs");
      const upgradedNft = await upgrades.upgradeProxy(nft, OEANFTsV2);

      // Verify name and symbol are maintained
      expect(await upgradedNft.name()).to.equal(initialName);
      expect(await upgradedNft.symbol()).to.equal(initialSymbol);
    });

    it("Should maintain owner authentication after upgrade", async function () {
      const { nft, otherAccount } = await loadFixture(deployContractFixture);

      // Mint an NFT and verify authentication
      await nft.mint(otherAccount.address, "token-1");
      expect(await nft.authenticate(otherAccount.address, 0)).to.be.true;

      // Upgrade to new implementation
      const OEANFTsV2 = await ethers.getContractFactory("OEANFTs");
      const upgradedNft = await upgrades.upgradeProxy(nft, OEANFTsV2);

      // Verify authentication still works after upgrade
      expect(await upgradedNft.authenticate(otherAccount.address, 0)).to.be.true;
    });
  });
}); 