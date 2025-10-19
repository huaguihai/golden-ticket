import { ethers } from "hardhat";
import * as hre from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Creating events with account:", deployer.address);

  // Get deployed contract address from deployments
  const eventManagerDeployment = await hre.deployments.get("EventManager");
  const EventManager = await ethers.getContractAt("EventManager", eventManagerDeployment.address);

  console.log("EventManager address:", eventManagerDeployment.address);

  // Define preset events
  const events = [
    {
      name: "Bronze Member Event",
      threshold: ethers.parseEther("0.001"), // 0.001 ETH
      expiryDays: 365, // 1 year from now
    },
    {
      name: "Silver Member Event",
      threshold: ethers.parseEther("0.01"), // 0.01 ETH
      expiryDays: 365,
    },
    {
      name: "Gold Member Event",
      threshold: ethers.parseEther("0.05"), // 0.05 ETH
      expiryDays: 365,
    },
    {
      name: "Platinum Member Event",
      threshold: ethers.parseEther("0.1"), // 0.1 ETH
      expiryDays: 365,
    },
  ];

  // Create events
  for (const event of events) {
    const expiryTime = Math.floor(Date.now() / 1000) + event.expiryDays * 24 * 60 * 60;

    // Convert threshold from wei to uint32 (assuming threshold in wei can fit in uint32)
    // For small ETH amounts like 0.001-0.1 ETH, we'll use a scaled down version
    // Let's use the amount in "milli-ETH" units (1000 = 1 ETH)
    const thresholdInMilliEth = Number(event.threshold) / (10 ** 15); // Convert wei to milli-ETH
    const threshold32 = Math.floor(thresholdInMilliEth);

    console.log(`\nCreating event: ${event.name}`);
    console.log(`  Threshold: ${ethers.formatEther(event.threshold)} ETH (${threshold32} as uint32)`);
    console.log(`  Expiry: ${new Date(expiryTime * 1000).toLocaleDateString()}`);

    const tx = await EventManager.createEvent(
      threshold32,
      event.name,
      expiryTime
    );
    const receipt = await tx.wait();

    // Get event ID from logs
    const eventCreatedLog = receipt?.logs.find(
      (log: any) => log.fragment?.name === "EventCreated"
    );
    const eventId = eventCreatedLog ? eventCreatedLog.args[0] : "Unknown";

    console.log(`  ✅ Event created with ID: ${eventId}`);
  }

  console.log("\n🎉 All preset events created successfully!");

  // Display all events
  console.log("\n📋 Event Summary:");
  const nextEventId = await EventManager.nextEventId();
  for (let i = 1; i < nextEventId; i++) {
    const event = await EventManager.getEvent(i);
    console.log(`\nEvent ${i}:`);
    console.log(`  Name: ${event.eventName}`);
    console.log(`  Threshold: ${event.assetThreshold} (milli-ETH units)`);
    console.log(`  Active: ${event.isActive}`);
    console.log(`  Expiry: ${new Date(Number(event.expiryTime) * 1000).toLocaleDateString()}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
