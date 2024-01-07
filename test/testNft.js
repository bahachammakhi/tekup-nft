// testMyNFT.js
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MyNFT", function () {
  let MyNFT;
  let myNFT;
  let owner;
  let user1;
  let user2;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();

    MyNFT = await ethers.getContractFactory("MyNFT");
    myNFT = await MyNFT.deploy();
    await myNFT.waitForDeployment();
  });

  it("should mint tokens and handle transfers correctly", async function () {
    // Mint 5 tokens from Deployer
    for (let i = 0; i < 5; i++) {
      await myNFT.connect(owner).mint({ value: ethers.parseEther("0.1") });
    }

    // Mint 3 tokens from User1
    for (let i = 0; i < 3; i++) {
      await myNFT.connect(user1).mint({ value: ethers.parseEther("0.1") });
    }

    // Test that every account has the right amount of tokens
    expect(await myNFT.balanceOf(owner.address)).to.equal(5);
    expect(await myNFT.balanceOf(user1.address)).to.equal(3);
    expect(await myNFT.balanceOf(user2.address)).to.equal(0);

    // Ensure User1 is the owner of Token ID 6 before the transfer
    expect(await myNFT.ownerOf(6)).to.equal(user1.address);

    // From Deployer: approve User1 to spend Token ID 6
    await myNFT.connect(user1).approve(user2.address, 6);

    // Test that User1 has the right approval granted by the Deployer
    expect(await myNFT.getApproved(6)).to.equal(user2.address);

    // Transfer 1 token from User1 to User2 (Token ID 6)
    await myNFT.connect(user1).transferFrom(user1.address, user2.address, 6);

    // Make sure that the transferred token is now owned by User2
    expect(await myNFT.ownerOf(6)).to.equal(user2.address);

    // Test that every user has the right amount of tokens
    expect(await myNFT.balanceOf(owner.address)).to.equal(5);
    expect(await myNFT.balanceOf(user1.address)).to.equal(2);
    expect(await myNFT.balanceOf(user2.address)).to.equal(1);
  });
});
