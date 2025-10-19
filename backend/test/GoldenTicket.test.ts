import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { ethers, fhevm } from "hardhat";
import { expect } from "chai";
import { FhevmType } from "@fhevm/hardhat-plugin";
import type {
  EventManager,
  GoldenTicketVerification,
  GoldenTicketNFT
} from "../types";

type Signers = {
  deployer: HardhatEthersSigner;
  organizer: HardhatEthersSigner;
  alice: HardhatEthersSigner;
  bob: HardhatEthersSigner;
};

describe("Golden Ticket System", function () {
  let signers: Signers;
  let eventManager: EventManager;
  let verification: GoldenTicketVerification;
  let nft: GoldenTicketNFT;
  let eventManagerAddress: string;
  let verificationAddress: string;
  let nftAddress: string;

  before(async function () {
    const ethSigners: HardhatEthersSigner[] = await ethers.getSigners();
    signers = {
      deployer: ethSigners[0],
      organizer: ethSigners[1],
      alice: ethSigners[2],
      bob: ethSigners[3],
    };
  });

  beforeEach(async function () {
    // Check whether the tests are running against an FHEVM mock environment
    if (!fhevm.isMock) {
      console.warn(`This hardhat test suite can only run on FHEVM mock environment`);
      this.skip();
    }

    // 1. Deploy GoldenTicketNFT
    const NFTFactory = await ethers.getContractFactory("GoldenTicketNFT");
    nft = await NFTFactory.deploy();
    nftAddress = await nft.getAddress();

    // 2. Deploy EventManager
    const EventManagerFactory = await ethers.getContractFactory("EventManager");
    eventManager = await EventManagerFactory.deploy(signers.deployer.address);
    eventManagerAddress = await eventManager.getAddress();

    // 3. Deploy GoldenTicketVerification
    const VerificationFactory = await ethers.getContractFactory("GoldenTicketVerification");
    verification = await VerificationFactory.deploy(nftAddress, eventManagerAddress);
    verificationAddress = await verification.getAddress();

    // 4. Set verification contract as authorized minter in NFT contract
    await nft.setVerificationContract(verificationAddress);
  });

  describe("EventManager", function () {
    it("should deploy with correct initial state", async function () {
      expect(await eventManager.nextEventId()).to.equal(1);
    });

    it("should allow creating an event", async function () {
      const assetThreshold = 1000; // 1 ETH in milli-ETH
      const eventName = "Bronze Member Event";
      const expiryTime = Math.floor(Date.now() / 1000) + 86400; // 1 day from now

      const tx = await eventManager
        .connect(signers.organizer)
        .createEvent(assetThreshold, eventName, expiryTime);

      await tx.wait();

      const event = await eventManager.getEvent(1);
      expect(event.organizer).to.equal(signers.organizer.address);
      expect(event.assetThreshold).to.equal(assetThreshold);
      expect(event.eventName).to.equal(eventName);
      expect(event.isActive).to.equal(true);
    });

    it("should reject event with expiry time in the past", async function () {
      const assetThreshold = 1000;
      const eventName = "Test Event";
      const pastTime = Math.floor(Date.now() / 1000) - 3600; // 1 hour ago

      await expect(
        eventManager.createEvent(assetThreshold, eventName, pastTime)
      ).to.be.revertedWith("EventManager: Expiry time must be in the future");
    });

    it("should reject event with empty name", async function () {
      const assetThreshold = 1000;
      const eventName = "";
      const expiryTime = Math.floor(Date.now() / 1000) + 86400;

      await expect(
        eventManager.createEvent(assetThreshold, eventName, expiryTime)
      ).to.be.revertedWith("EventManager: Event name cannot be empty");
    });

    it("should allow organizer to update event", async function () {
      // Create event
      const assetThreshold = 1000;
      const eventName = "Bronze Member Event";
      const expiryTime = Math.floor(Date.now() / 1000) + 86400;

      await eventManager
        .connect(signers.organizer)
        .createEvent(assetThreshold, eventName, expiryTime);

      // Update event
      const newThreshold = 2000;
      const newName = "Silver Member Event";
      const newExpiry = Math.floor(Date.now() / 1000) + 172800; // 2 days

      await eventManager
        .connect(signers.organizer)
        .updateEvent(1, newThreshold, newName, newExpiry, true);

      const updatedEvent = await eventManager.getEvent(1);
      expect(updatedEvent.assetThreshold).to.equal(newThreshold);
      expect(updatedEvent.eventName).to.equal(newName);
    });

    it("should not allow non-organizer to update event", async function () {
      // Create event
      const assetThreshold = 1000;
      const eventName = "Bronze Member Event";
      const expiryTime = Math.floor(Date.now() / 1000) + 86400;

      await eventManager
        .connect(signers.organizer)
        .createEvent(assetThreshold, eventName, expiryTime);

      // Try to update as non-organizer
      await expect(
        eventManager
          .connect(signers.alice)
          .updateEvent(1, 2000, "Hacked Event", expiryTime, true)
      ).to.be.revertedWith("EventManager: Only organizer can update this event");
    });
  });

  describe("GoldenTicketNFT", function () {
    it("should deploy with correct initial state", async function () {
      expect(await nft.name()).to.equal("Golden Ticket");
      expect(await nft.symbol()).to.equal("TICKET");
    });

    it("should set verification contract", async function () {
      expect(await nft.verificationContract()).to.equal(verificationAddress);
    });

    it("should not allow minting from unauthorized address", async function () {
      await expect(
        nft.connect(signers.alice).mintTicket(signers.alice.address, 1)
      ).to.be.revertedWith("Only verification contract can mint");
    });

    it("should allow minting from verification contract", async function () {
      await nft.setVerificationContract(signers.deployer.address);

      const tx = await nft
        .connect(signers.deployer)
        .mintTicket(signers.alice.address, 1);

      await tx.wait();

      expect(await nft.balanceOf(signers.alice.address)).to.equal(1);
      expect(await nft.ownerOf(1)).to.equal(signers.alice.address);
    });
  });

  describe("GoldenTicketVerification (FHE)", function () {
    let eventId: number;

    beforeEach(async function () {
      // Create a test event
      const assetThreshold = 1000; // 1 ETH in milli-ETH
      const eventName = "Bronze Member Event";
      const expiryTime = Math.floor(Date.now() / 1000) + 86400;

      const tx = await eventManager
        .connect(signers.organizer)
        .createEvent(assetThreshold, eventName, expiryTime);

      await tx.wait();
      eventId = 1;
    });

    it("should reject verification for inactive event", async function () {
      // Deactivate event
      const event = await eventManager.getEvent(eventId);
      await eventManager
        .connect(signers.organizer)
        .updateEvent(
          eventId,
          event.assetThreshold,
          event.eventName,
          event.expiryTime,
          false // set inactive
        );

      // Try to verify
      const encryptedBalance = await fhevm
        .createEncryptedInput(verificationAddress, signers.alice.address)
        .add32(2000) // 2 ETH, above threshold
        .encrypt();

      await expect(
        verification
          .connect(signers.alice)
          .verifyAndRequestMint(
            eventId,
            encryptedBalance.handles[0],
            encryptedBalance.inputProof
          )
      ).to.be.revertedWith("Event is not active");
    });

    it("should accept encrypted balance above threshold", async function () {
      // User has 2 ETH (2000 milli-ETH), threshold is 1 ETH (1000 milli-ETH)
      const userBalance = 2000;

      const encryptedBalance = await fhevm
        .createEncryptedInput(verificationAddress, signers.alice.address)
        .add32(userBalance)
        .encrypt();

      const tx = await verification
        .connect(signers.alice)
        .verifyAndRequestMint(
          eventId,
          encryptedBalance.handles[0],
          encryptedBalance.inputProof
        );

      await expect(tx).to.emit(verification, "DecryptionRequested");
    });

    it("should process encrypted balance below threshold", async function () {
      // User has 0.5 ETH (500 milli-ETH), threshold is 1 ETH (1000 milli-ETH)
      const userBalance = 500;

      const encryptedBalance = await fhevm
        .createEncryptedInput(verificationAddress, signers.alice.address)
        .add32(userBalance)
        .encrypt();

      const tx = await verification
        .connect(signers.alice)
        .verifyAndRequestMint(
          eventId,
          encryptedBalance.handles[0],
          encryptedBalance.inputProof
        );

      // Should still emit event (but NFT won't be minted in callback)
      await expect(tx).to.emit(verification, "DecryptionRequested");
    });

    it("should handle edge case: balance exactly equals threshold", async function () {
      // User has exactly 1 ETH (1000 milli-ETH), threshold is 1 ETH
      const userBalance = 1000;

      const encryptedBalance = await fhevm
        .createEncryptedInput(verificationAddress, signers.alice.address)
        .add32(userBalance)
        .encrypt();

      const tx = await verification
        .connect(signers.alice)
        .verifyAndRequestMint(
          eventId,
          encryptedBalance.handles[0],
          encryptedBalance.inputProof
        );

      await expect(tx).to.emit(verification, "DecryptionRequested");
    });
  });

  describe("Integration Test", function () {
    it("should complete full flow: create event -> verify -> mint NFT", async function () {
      // 1. Create event
      const assetThreshold = 1000;
      const eventName = "VIP Event";
      const expiryTime = Math.floor(Date.now() / 1000) + 86400;

      await eventManager
        .connect(signers.organizer)
        .createEvent(assetThreshold, eventName, expiryTime);

      // 2. Alice verifies with sufficient balance
      const aliceBalance = 2000; // 2 ETH
      const encryptedBalance = await fhevm
        .createEncryptedInput(verificationAddress, signers.alice.address)
        .add32(aliceBalance)
        .encrypt();

      const tx = await verification
        .connect(signers.alice)
        .verifyAndRequestMint(
          1,
          encryptedBalance.handles[0],
          encryptedBalance.inputProof
        );

      await expect(tx).to.emit(verification, "DecryptionRequested");

      // Note: In mock environment, oracle callback won't happen automatically
      // In real environment, oracle would call fulfilDecryptionRequest
      // which would then mint the NFT if user qualified
    });
  });
});
