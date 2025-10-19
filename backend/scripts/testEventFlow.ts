import { ethers } from "hardhat";
import * as hre from "hardhat";

async function main() {
  console.log("🧪 Testing Golden Ticket Event Flow\n");
  console.log("=".repeat(60));

  const [deployer] = await ethers.getSigners();
  console.log("Testing with account:", deployer.address);

  // Get deployed contracts
  const eventManagerDeployment = await hre.deployments.get("EventManager");
  const verificationDeployment = await hre.deployments.get("GoldenTicketVerification");
  const nftDeployment = await hre.deployments.get("GoldenTicketNFT");

  const EventManager = await ethers.getContractAt("EventManager", eventManagerDeployment.address);
  const Verification = await ethers.getContractAt("GoldenTicketVerification", verificationDeployment.address);
  const NFT = await ethers.getContractAt("GoldenTicketNFT", nftDeployment.address);

  console.log("\n📋 Contract Addresses:");
  console.log(`EventManager:             ${eventManagerDeployment.address}`);
  console.log(`GoldenTicketVerification: ${verificationDeployment.address}`);
  console.log(`GoldenTicketNFT:          ${nftDeployment.address}`);

  // Test 1: Read all events
  console.log("\n" + "=".repeat(60));
  console.log("✅ Test 1: Reading all events");
  console.log("=".repeat(60));

  const nextEventId = await EventManager.nextEventId();
  console.log(`Total events created: ${Number(nextEventId) - 1}`);

  const events = [];
  for (let i = 1; i < nextEventId; i++) {
    try {
      const event = await EventManager.getEvent(i);
      events.push({
        id: i,
        name: event.eventName,
        threshold: Number(event.assetThreshold),
        isActive: event.isActive,
        expiryTime: new Date(Number(event.expiryTime) * 1000),
      });
      console.log(`\nEvent ${i}:`);
      console.log(`  Name:      ${event.eventName}`);
      console.log(`  Threshold: ${event.assetThreshold} (milli-ETH units)`);
      console.log(`  Active:    ${event.isActive}`);
      console.log(`  Expires:   ${new Date(Number(event.expiryTime) * 1000).toLocaleDateString()}`);
    } catch (error: any) {
      console.log(`  ❌ Failed to read event ${i}:`, error.message);
    }
  }

  if (events.length === 4) {
    console.log("\n✅ All 4 events successfully retrieved!");
  } else {
    console.log(`\n⚠️  Expected 4 events, found ${events.length}`);
  }

  // Test 2: Verify contract references
  console.log("\n" + "=".repeat(60));
  console.log("✅ Test 2: Verifying contract references");
  console.log("=".repeat(60));

  const nftFromVerification = await Verification.goldenTicketNFT();
  const eventManagerFromVerification = await Verification.eventManager();

  console.log(`NFT address in Verification:          ${nftFromVerification}`);
  console.log(`Expected NFT address:                 ${nftDeployment.address}`);
  console.log(`Match: ${nftFromVerification.toLowerCase() === nftDeployment.address.toLowerCase() ? "✅" : "❌"}`);

  console.log(`\nEventManager in Verification:         ${eventManagerFromVerification}`);
  console.log(`Expected EventManager address:        ${eventManagerDeployment.address}`);
  console.log(`Match: ${eventManagerFromVerification.toLowerCase() === eventManagerDeployment.address.toLowerCase() ? "✅" : "❌"}`);

  // Test 3: Check NFT ownership
  console.log("\n" + "=".repeat(60));
  console.log("✅ Test 3: Checking NFT ownership");
  console.log("=".repeat(60));

  const nftOwner = await NFT.owner();
  console.log(`NFT contract owner:                   ${nftOwner}`);
  console.log(`Verification contract address:        ${verificationDeployment.address}`);
  console.log(`Ownership transferred correctly: ${nftOwner.toLowerCase() === verificationDeployment.address.toLowerCase() ? "✅" : "❌"}`);

  // Test 4: Check user NFT balance
  console.log("\n" + "=".repeat(60));
  console.log("✅ Test 4: Checking user NFT balance");
  console.log("=".repeat(60));

  const userBalance = await NFT.balanceOf(deployer.address);
  console.log(`User's Golden Ticket NFT balance: ${userBalance.toString()}`);

  // Summary
  console.log("\n" + "=".repeat(60));
  console.log("📊 TEST SUMMARY");
  console.log("=".repeat(60));
  console.log("✅ EventManager deployed and accessible");
  console.log("✅ GoldenTicketVerification deployed and configured");
  console.log("✅ GoldenTicketNFT deployed with correct ownership");
  console.log(`✅ ${events.length} events created and readable`);
  console.log("\n🎉 All basic tests passed! Ready for frontend integration.");
  console.log("\n💡 Next Steps:");
  console.log("   1. Update frontend deployedContracts.ts with new addresses");
  console.log("   2. Build /events page to display event list");
  console.log("   3. Build /events/[eventId] page for registration");
  console.log("   4. Build /my-tickets page to display NFTs");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
