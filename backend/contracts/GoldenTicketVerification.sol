// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint32, eaddress, ebool, externalEuint32} from "@fhevm/solidity/lib/FHE.sol";
import {SepoliaConfig} from "@fhevm/solidity/config/ZamaConfig.sol";
import "./GoldenTicketNFT.sol"; // Import the NFT contract
import "./EventManager.sol"; // Import the EventManager contract

contract GoldenTicketVerification is SepoliaConfig {
    GoldenTicketNFT public goldenTicketNFT;
    EventManager public eventManager;
    uint32 public assetThreshold; // Kept for backward compatibility, but will use EventManager for multi-event support

    // Store request IDs to prevent replay attacks and track pending decryptions
    // Now we also store the eventId for each request
    mapping(bytes32 => address) public pendingDecryptions;
    mapping(bytes32 => uint256) public pendingEventIds;

    // Event to log decryption requests
    event DecryptionRequested(bytes32 indexed requestId, address indexed sender, uint256 indexed eventId);

    constructor(address _goldenTicketNFTAddress, address _eventManagerAddress)
    {
        goldenTicketNFT = GoldenTicketNFT(_goldenTicketNFTAddress);
        eventManager = EventManager(_eventManagerAddress);
        assetThreshold = 0; // Default value, not used when eventId is provided
    }

    function verifyAndRequestMint(uint256 _eventId, externalEuint32 _encryptedBalance, bytes calldata inputProof) public {
        // 1. Get event details from EventManager
        EventManager.Event memory eventData = eventManager.getEvent(_eventId);
        require(eventData.isActive, "Event is not active");
        require(eventData.expiryTime > block.timestamp, "Event has expired");

        // 2. Use FHE.fromExternal() to verify input proof and get encrypted user balance
        euint32 encryptedUserBalance = FHE.fromExternal(_encryptedBalance, inputProof);

        // 3. Convert event's asset threshold to euint32
        euint32 encryptedThreshold = FHE.asEuint32(eventData.assetThreshold);

        // 4. Compare encrypted user balance with encrypted threshold
        ebool isQualified = FHE.ge(encryptedUserBalance, encryptedThreshold);

        eaddress selectedRecipient = FHE.select(isQualified, FHE.asEaddress(msg.sender), FHE.asEaddress(address(0)));

        bytes32 recipientHandle = FHE.toBytes32(selectedRecipient);
        bytes32[] memory ctsHandles = new bytes32[](1);
        ctsHandles[0] = recipientHandle;

        uint256 newRequestId = FHE.requestDecryption(
            ctsHandles,
            this.oracleCallback.selector
        );

        bytes32 requestIdBytes32 = bytes32(newRequestId);
        pendingDecryptions[requestIdBytes32] = msg.sender; // Store sender for callback verification
        pendingEventIds[requestIdBytes32] = _eventId; // Store eventId for reference
        emit DecryptionRequested(requestIdBytes32, msg.sender, _eventId);
    }

    // FHE.oracleCallback() function to receive decryption results
    // Signature must match the expected callback from the DecryptionOracle
    function oracleCallback(uint256 requestID, bytes memory cleartexts, bytes memory decryptionProof) public {
        // IMPORTANT: Verify the signatures from the KMS
        FHE.checkSignatures(requestID, cleartexts, decryptionProof);

        bytes32 requestIdBytes32 = bytes32(requestID); // Convert uint256 to bytes32 for mapping lookup

        require(pendingDecryptions[requestIdBytes32] != address(0), "Invalid or expired request ID");
        address originalSender = pendingDecryptions[requestIdBytes32];
        delete pendingDecryptions[requestIdBytes32]; // Prevent replay

        // Decode the decrypted address from cleartexts
        address recipientAddress = abi.decode(cleartexts, (address));

        if (recipientAddress != address(0)) {
            // If qualified, mint the NFT to the recipient
            goldenTicketNFT.mint(recipientAddress);
        }
    }

    // Function to set the GoldenTicketNFT contract address (can be called by owner if needed)
    function setGoldenTicketNFTAddress(address _newAddress) public {
        goldenTicketNFT = GoldenTicketNFT(_newAddress);
    }

    // Function to set the asset threshold (can be called by owner if needed)
    function setAssetThreshold(uint32 _newThreshold) public {
        assetThreshold = _newThreshold;
    }
}