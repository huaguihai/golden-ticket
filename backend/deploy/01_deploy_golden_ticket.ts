import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";

const deployGoldenTicketContracts: DeployFunction = async function (
  hre: HardhatRuntimeEnvironment
) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;
  const [deployerSigner] = await ethers.getSigners(); // Get deployer signer

  console.log("Deploying Golden Ticket contracts with deployer:", deployer);

  // Step 1: Deploy GoldenTicketNFT
  const goldenTicketNFT = await deploy("GoldenTicketNFT", {
    from: deployer,
    args: ["GoldenTicket", "GT", deployer], // Name, Symbol, initialOwner
    log: true,
    waitConfirmations: 1,
  });
  console.log(`✅ GoldenTicketNFT deployed at: ${goldenTicketNFT.address}`);

  // Step 2: Deploy EventManager
  const eventManager = await deploy("EventManager", {
    from: deployer,
    args: [deployer], // initialOwner
    log: true,
    waitConfirmations: 1,
  });
  console.log(`✅ EventManager deployed at: ${eventManager.address}`);

  // Step 3: Deploy GoldenTicketVerification with EventManager address
  const goldenTicketVerification = await deploy("GoldenTicketVerification", {
    from: deployer,
    args: [goldenTicketNFT.address, eventManager.address], // NFT Address, EventManager Address
    log: true,
    waitConfirmations: 1,
  });
  console.log(`✅ GoldenTicketVerification deployed at: ${goldenTicketVerification.address}`);

  // Step 4: Transfer NFT ownership to Verification contract
  const nftContract = await ethers.getContractAt("GoldenTicketNFT", goldenTicketNFT.address);
  const currentOwner = await nftContract.owner();

  if (currentOwner.toLowerCase() !== goldenTicketVerification.address.toLowerCase()) {
    console.log(`Transferring NFT ownership from ${currentOwner} to ${goldenTicketVerification.address}`);
    const tx = await nftContract.connect(deployerSigner).transferOwnership(goldenTicketVerification.address);
    await tx.wait();
    console.log(`✅ NFT ownership transferred to Verification contract`);
  } else {
    console.log(`ℹ️  NFT ownership already belongs to Verification contract`);
  }

  console.log("\n📋 Deployment Summary:");
  console.log(`GoldenTicketNFT:          ${goldenTicketNFT.address}`);
  console.log(`EventManager:             ${eventManager.address}`);
  console.log(`GoldenTicketVerification: ${goldenTicketVerification.address}`);
};

export default deployGoldenTicketContracts;
deployGoldenTicketContracts.tags = ["GoldenTicket"];
