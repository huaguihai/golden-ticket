/**
 * This file contains the deployed contract addresses and ABIs.
 * Updated: 2025-10-19T07:48:15.584Z
 */
import { GenericContractsDeclaration } from "~~/utils/helper/contract";

const deployedContracts = {
  11155111: {
    GoldenTicketNFT: {
        address: "0x56F581a07fFfEA6E8acD5357fDf0beCecB848EB2",
        abi: [
            {
                inputs: [
                    {
                        internalType: "string",
                        name: "name",
                        type: "string"
                    },
                    {
                        internalType: "string",
                        name: "symbol",
                        type: "string"
                    },
                    {
                        internalType: "address",
                        name: "initialOwner",
                        type: "address"
                    }
                ],
                stateMutability: "nonpayable",
                type: "constructor"
            },
            {
                inputs: [
                    {
                        internalType: "address",
                        name: "sender",
                        type: "address"
                    },
                    {
                        internalType: "uint256",
                        name: "tokenId",
                        type: "uint256"
                    },
                    {
                        internalType: "address",
                        name: "owner",
                        type: "address"
                    }
                ],
                name: "ERC721IncorrectOwner",
                type: "error"
            },
            {
                inputs: [
                    {
                        internalType: "address",
                        name: "operator",
                        type: "address"
                    },
                    {
                        internalType: "uint256",
                        name: "tokenId",
                        type: "uint256"
                    }
                ],
                name: "ERC721InsufficientApproval",
                type: "error"
            },
            {
                inputs: [
                    {
                        internalType: "address",
                        name: "approver",
                        type: "address"
                    }
                ],
                name: "ERC721InvalidApprover",
                type: "error"
            },
            {
                inputs: [
                    {
                        internalType: "address",
                        name: "operator",
                        type: "address"
                    }
                ],
                name: "ERC721InvalidOperator",
                type: "error"
            },
            {
                inputs: [
                    {
                        internalType: "address",
                        name: "owner",
                        type: "address"
                    }
                ],
                name: "ERC721InvalidOwner",
                type: "error"
            },
            {
                inputs: [
                    {
                        internalType: "address",
                        name: "receiver",
                        type: "address"
                    }
                ],
                name: "ERC721InvalidReceiver",
                type: "error"
            },
            {
                inputs: [
                    {
                        internalType: "address",
                        name: "sender",
                        type: "address"
                    }
                ],
                name: "ERC721InvalidSender",
                type: "error"
            },
            {
                inputs: [
                    {
                        internalType: "uint256",
                        name: "tokenId",
                        type: "uint256"
                    }
                ],
                name: "ERC721NonexistentToken",
                type: "error"
            },
            {
                inputs: [
                    {
                        internalType: "address",
                        name: "owner",
                        type: "address"
                    }
                ],
                name: "OwnableInvalidOwner",
                type: "error"
            },
            {
                inputs: [
                    {
                        internalType: "address",
                        name: "account",
                        type: "address"
                    }
                ],
                name: "OwnableUnauthorizedAccount",
                type: "error"
            },
            {
                anonymous: false,
                inputs: [
                    {
                        indexed: true,
                        internalType: "address",
                        name: "owner",
                        type: "address"
                    },
                    {
                        indexed: true,
                        internalType: "address",
                        name: "approved",
                        type: "address"
                    },
                    {
                        indexed: true,
                        internalType: "uint256",
                        name: "tokenId",
                        type: "uint256"
                    }
                ],
                name: "Approval",
                type: "event"
            },
            {
                anonymous: false,
                inputs: [
                    {
                        indexed: true,
                        internalType: "address",
                        name: "owner",
                        type: "address"
                    },
                    {
                        indexed: true,
                        internalType: "address",
                        name: "operator",
                        type: "address"
                    },
                    {
                        indexed: false,
                        internalType: "bool",
                        name: "approved",
                        type: "bool"
                    }
                ],
                name: "ApprovalForAll",
                type: "event"
            },
            {
                anonymous: false,
                inputs: [
                    {
                        indexed: true,
                        internalType: "address",
                        name: "previousOwner",
                        type: "address"
                    },
                    {
                        indexed: true,
                        internalType: "address",
                        name: "newOwner",
                        type: "address"
                    }
                ],
                name: "OwnershipTransferred",
                type: "event"
            },
            {
                anonymous: false,
                inputs: [
                    {
                        indexed: true,
                        internalType: "address",
                        name: "from",
                        type: "address"
                    },
                    {
                        indexed: true,
                        internalType: "address",
                        name: "to",
                        type: "address"
                    },
                    {
                        indexed: true,
                        internalType: "uint256",
                        name: "tokenId",
                        type: "uint256"
                    }
                ],
                name: "Transfer",
                type: "event"
            },
            {
                inputs: [
                    {
                        internalType: "address",
                        name: "to",
                        type: "address"
                    },
                    {
                        internalType: "uint256",
                        name: "tokenId",
                        type: "uint256"
                    }
                ],
                name: "approve",
                outputs: [],
                stateMutability: "nonpayable",
                type: "function"
            },
            {
                inputs: [
                    {
                        internalType: "address",
                        name: "owner",
                        type: "address"
                    }
                ],
                name: "balanceOf",
                outputs: [
                    {
                        internalType: "uint256",
                        name: "",
                        type: "uint256"
                    }
                ],
                stateMutability: "view",
                type: "function"
            },
            {
                inputs: [
                    {
                        internalType: "uint256",
                        name: "tokenId",
                        type: "uint256"
                    }
                ],
                name: "getApproved",
                outputs: [
                    {
                        internalType: "address",
                        name: "",
                        type: "address"
                    }
                ],
                stateMutability: "view",
                type: "function"
            },
            {
                inputs: [
                    {
                        internalType: "address",
                        name: "owner",
                        type: "address"
                    },
                    {
                        internalType: "address",
                        name: "operator",
                        type: "address"
                    }
                ],
                name: "isApprovedForAll",
                outputs: [
                    {
                        internalType: "bool",
                        name: "",
                        type: "bool"
                    }
                ],
                stateMutability: "view",
                type: "function"
            },
            {
                inputs: [
                    {
                        internalType: "address",
                        name: "to",
                        type: "address"
                    }
                ],
                name: "mint",
                outputs: [],
                stateMutability: "nonpayable",
                type: "function"
            },
            {
                inputs: [],
                name: "name",
                outputs: [
                    {
                        internalType: "string",
                        name: "",
                        type: "string"
                    }
                ],
                stateMutability: "view",
                type: "function"
            },
            {
                inputs: [],
                name: "owner",
                outputs: [
                    {
                        internalType: "address",
                        name: "",
                        type: "address"
                    }
                ],
                stateMutability: "view",
                type: "function"
            },
            {
                inputs: [
                    {
                        internalType: "uint256",
                        name: "tokenId",
                        type: "uint256"
                    }
                ],
                name: "ownerOf",
                outputs: [
                    {
                        internalType: "address",
                        name: "",
                        type: "address"
                    }
                ],
                stateMutability: "view",
                type: "function"
            },
            {
                inputs: [],
                name: "renounceOwnership",
                outputs: [],
                stateMutability: "nonpayable",
                type: "function"
            },
            {
                inputs: [
                    {
                        internalType: "address",
                        name: "from",
                        type: "address"
                    },
                    {
                        internalType: "address",
                        name: "to",
                        type: "address"
                    },
                    {
                        internalType: "uint256",
                        name: "tokenId",
                        type: "uint256"
                    }
                ],
                name: "safeTransferFrom",
                outputs: [],
                stateMutability: "nonpayable",
                type: "function"
            },
            {
                inputs: [
                    {
                        internalType: "address",
                        name: "from",
                        type: "address"
                    },
                    {
                        internalType: "address",
                        name: "to",
                        type: "address"
                    },
                    {
                        internalType: "uint256",
                        name: "tokenId",
                        type: "uint256"
                    },
                    {
                        internalType: "bytes",
                        name: "data",
                        type: "bytes"
                    }
                ],
                name: "safeTransferFrom",
                outputs: [],
                stateMutability: "nonpayable",
                type: "function"
            },
            {
                inputs: [
                    {
                        internalType: "address",
                        name: "operator",
                        type: "address"
                    },
                    {
                        internalType: "bool",
                        name: "approved",
                        type: "bool"
                    }
                ],
                name: "setApprovalForAll",
                outputs: [],
                stateMutability: "nonpayable",
                type: "function"
            },
            {
                inputs: [
                    {
                        internalType: "bytes4",
                        name: "interfaceId",
                        type: "bytes4"
                    }
                ],
                name: "supportsInterface",
                outputs: [
                    {
                        internalType: "bool",
                        name: "",
                        type: "bool"
                    }
                ],
                stateMutability: "view",
                type: "function"
            },
            {
                inputs: [],
                name: "symbol",
                outputs: [
                    {
                        internalType: "string",
                        name: "",
                        type: "string"
                    }
                ],
                stateMutability: "view",
                type: "function"
            },
            {
                inputs: [
                    {
                        internalType: "uint256",
                        name: "tokenId",
                        type: "uint256"
                    }
                ],
                name: "tokenURI",
                outputs: [
                    {
                        internalType: "string",
                        name: "",
                        type: "string"
                    }
                ],
                stateMutability: "view",
                type: "function"
            },
            {
                inputs: [],
                name: "totalSupply",
                outputs: [
                    {
                        internalType: "uint256",
                        name: "",
                        type: "uint256"
                    }
                ],
                stateMutability: "view",
                type: "function"
            },
            {
                inputs: [
                    {
                        internalType: "address",
                        name: "from",
                        type: "address"
                    },
                    {
                        internalType: "address",
                        name: "to",
                        type: "address"
                    },
                    {
                        internalType: "uint256",
                        name: "tokenId",
                        type: "uint256"
                    }
                ],
                name: "transferFrom",
                outputs: [],
                stateMutability: "nonpayable",
                type: "function"
            },
            {
                inputs: [
                    {
                        internalType: "address",
                        name: "newOwner",
                        type: "address"
                    }
                ],
                name: "transferOwnership",
                outputs: [],
                stateMutability: "nonpayable",
                type: "function"
            }
        ]
    },
    EventManager: {
        address: "0x7DE2ff3AEf56CE5a6cF3889Ed0173Bbd7C7a004B",
        abi: [
            {
                inputs: [
                    {
                        internalType: "address",
                        name: "initialOwner",
                        type: "address"
                    }
                ],
                stateMutability: "nonpayable",
                type: "constructor"
            },
            {
                inputs: [
                    {
                        internalType: "address",
                        name: "owner",
                        type: "address"
                    }
                ],
                name: "OwnableInvalidOwner",
                type: "error"
            },
            {
                inputs: [
                    {
                        internalType: "address",
                        name: "account",
                        type: "address"
                    }
                ],
                name: "OwnableUnauthorizedAccount",
                type: "error"
            },
            {
                anonymous: false,
                inputs: [
                    {
                        indexed: true,
                        internalType: "uint256",
                        name: "eventId",
                        type: "uint256"
                    },
                    {
                        indexed: true,
                        internalType: "address",
                        name: "organizer",
                        type: "address"
                    },
                    {
                        indexed: false,
                        internalType: "uint32",
                        name: "assetThreshold",
                        type: "uint32"
                    },
                    {
                        indexed: false,
                        internalType: "string",
                        name: "eventName",
                        type: "string"
                    },
                    {
                        indexed: false,
                        internalType: "uint256",
                        name: "expiryTime",
                        type: "uint256"
                    }
                ],
                name: "EventCreated",
                type: "event"
            },
            {
                anonymous: false,
                inputs: [
                    {
                        indexed: true,
                        internalType: "uint256",
                        name: "eventId",
                        type: "uint256"
                    },
                    {
                        indexed: false,
                        internalType: "uint32",
                        name: "newAssetThreshold",
                        type: "uint32"
                    },
                    {
                        indexed: false,
                        internalType: "string",
                        name: "newEventName",
                        type: "string"
                    },
                    {
                        indexed: false,
                        internalType: "uint256",
                        name: "newExpiryTime",
                        type: "uint256"
                    },
                    {
                        indexed: false,
                        internalType: "bool",
                        name: "newIsActive",
                        type: "bool"
                    }
                ],
                name: "EventUpdated",
                type: "event"
            },
            {
                anonymous: false,
                inputs: [
                    {
                        indexed: true,
                        internalType: "address",
                        name: "previousOwner",
                        type: "address"
                    },
                    {
                        indexed: true,
                        internalType: "address",
                        name: "newOwner",
                        type: "address"
                    }
                ],
                name: "OwnershipTransferred",
                type: "event"
            },
            {
                inputs: [
                    {
                        internalType: "uint32",
                        name: "_assetThreshold",
                        type: "uint32"
                    },
                    {
                        internalType: "string",
                        name: "_eventName",
                        type: "string"
                    },
                    {
                        internalType: "uint256",
                        name: "_expiryTime",
                        type: "uint256"
                    }
                ],
                name: "createEvent",
                outputs: [
                    {
                        internalType: "uint256",
                        name: "",
                        type: "uint256"
                    }
                ],
                stateMutability: "nonpayable",
                type: "function"
            },
            {
                inputs: [
                    {
                        internalType: "uint256",
                        name: "_eventId",
                        type: "uint256"
                    }
                ],
                name: "deactivateEvent",
                outputs: [],
                stateMutability: "nonpayable",
                type: "function"
            },
            {
                inputs: [
                    {
                        internalType: "uint256",
                        name: "",
                        type: "uint256"
                    }
                ],
                name: "events",
                outputs: [
                    {
                        internalType: "address",
                        name: "organizer",
                        type: "address"
                    },
                    {
                        internalType: "uint32",
                        name: "assetThreshold",
                        type: "uint32"
                    },
                    {
                        internalType: "string",
                        name: "eventName",
                        type: "string"
                    },
                    {
                        internalType: "uint256",
                        name: "expiryTime",
                        type: "uint256"
                    },
                    {
                        internalType: "bool",
                        name: "isActive",
                        type: "bool"
                    },
                    {
                        internalType: "uint256",
                        name: "eventId",
                        type: "uint256"
                    }
                ],
                stateMutability: "view",
                type: "function"
            },
            {
                inputs: [
                    {
                        internalType: "uint256",
                        name: "_eventId",
                        type: "uint256"
                    }
                ],
                name: "getEvent",
                outputs: [
                    {
                        components: [
                            {
                                internalType: "address",
                                name: "organizer",
                                type: "address"
                            },
                            {
                                internalType: "uint32",
                                name: "assetThreshold",
                                type: "uint32"
                            },
                            {
                                internalType: "string",
                                name: "eventName",
                                type: "string"
                            },
                            {
                                internalType: "uint256",
                                name: "expiryTime",
                                type: "uint256"
                            },
                            {
                                internalType: "bool",
                                name: "isActive",
                                type: "bool"
                            },
                            {
                                internalType: "uint256",
                                name: "eventId",
                                type: "uint256"
                            }
                        ],
                        internalType: "struct EventManager.Event",
                        name: "",
                        type: "tuple"
                    }
                ],
                stateMutability: "view",
                type: "function"
            },
            {
                inputs: [],
                name: "nextEventId",
                outputs: [
                    {
                        internalType: "uint256",
                        name: "",
                        type: "uint256"
                    }
                ],
                stateMutability: "view",
                type: "function"
            },
            {
                inputs: [],
                name: "owner",
                outputs: [
                    {
                        internalType: "address",
                        name: "",
                        type: "address"
                    }
                ],
                stateMutability: "view",
                type: "function"
            },
            {
                inputs: [],
                name: "renounceOwnership",
                outputs: [],
                stateMutability: "nonpayable",
                type: "function"
            },
            {
                inputs: [
                    {
                        internalType: "address",
                        name: "newOwner",
                        type: "address"
                    }
                ],
                name: "transferOwnership",
                outputs: [],
                stateMutability: "nonpayable",
                type: "function"
            },
            {
                inputs: [
                    {
                        internalType: "uint256",
                        name: "_eventId",
                        type: "uint256"
                    },
                    {
                        internalType: "uint32",
                        name: "_newAssetThreshold",
                        type: "uint32"
                    },
                    {
                        internalType: "string",
                        name: "_newEventName",
                        type: "string"
                    },
                    {
                        internalType: "uint256",
                        name: "_newExpiryTime",
                        type: "uint256"
                    },
                    {
                        internalType: "bool",
                        name: "_newIsActive",
                        type: "bool"
                    }
                ],
                name: "updateEvent",
                outputs: [],
                stateMutability: "nonpayable",
                type: "function"
            }
        ]
    },
    GoldenTicketVerification: {
        address: "0x4472Be950F6a4c1c3E20D3D7A5c1B63b13a352f1",
        abi: [
            {
                inputs: [
                    {
                        internalType: "address",
                        name: "_goldenTicketNFTAddress",
                        type: "address"
                    },
                    {
                        internalType: "address",
                        name: "_eventManagerAddress",
                        type: "address"
                    }
                ],
                stateMutability: "nonpayable",
                type: "constructor"
            },
            {
                inputs: [],
                name: "HandlesAlreadySavedForRequestID",
                type: "error"
            },
            {
                inputs: [],
                name: "InvalidKMSSignatures",
                type: "error"
            },
            {
                inputs: [],
                name: "NoHandleFoundForRequestID",
                type: "error"
            },
            {
                anonymous: false,
                inputs: [
                    {
                        indexed: true,
                        internalType: "uint256",
                        name: "requestID",
                        type: "uint256"
                    }
                ],
                name: "DecryptionFulfilled",
                type: "event"
            },
            {
                anonymous: false,
                inputs: [
                    {
                        indexed: true,
                        internalType: "bytes32",
                        name: "requestId",
                        type: "bytes32"
                    },
                    {
                        indexed: true,
                        internalType: "address",
                        name: "sender",
                        type: "address"
                    },
                    {
                        indexed: true,
                        internalType: "uint256",
                        name: "eventId",
                        type: "uint256"
                    }
                ],
                name: "DecryptionRequested",
                type: "event"
            },
            {
                inputs: [],
                name: "assetThreshold",
                outputs: [
                    {
                        internalType: "uint32",
                        name: "",
                        type: "uint32"
                    }
                ],
                stateMutability: "view",
                type: "function"
            },
            {
                inputs: [],
                name: "eventManager",
                outputs: [
                    {
                        internalType: "contract EventManager",
                        name: "",
                        type: "address"
                    }
                ],
                stateMutability: "view",
                type: "function"
            },
            {
                inputs: [],
                name: "goldenTicketNFT",
                outputs: [
                    {
                        internalType: "contract GoldenTicketNFT",
                        name: "",
                        type: "address"
                    }
                ],
                stateMutability: "view",
                type: "function"
            },
            {
                inputs: [
                    {
                        internalType: "uint256",
                        name: "requestID",
                        type: "uint256"
                    },
                    {
                        internalType: "bytes",
                        name: "cleartexts",
                        type: "bytes"
                    },
                    {
                        internalType: "bytes",
                        name: "decryptionProof",
                        type: "bytes"
                    }
                ],
                name: "oracleCallback",
                outputs: [],
                stateMutability: "nonpayable",
                type: "function"
            },
            {
                inputs: [
                    {
                        internalType: "bytes32",
                        name: "",
                        type: "bytes32"
                    }
                ],
                name: "pendingDecryptions",
                outputs: [
                    {
                        internalType: "address",
                        name: "",
                        type: "address"
                    }
                ],
                stateMutability: "view",
                type: "function"
            },
            {
                inputs: [
                    {
                        internalType: "bytes32",
                        name: "",
                        type: "bytes32"
                    }
                ],
                name: "pendingEventIds",
                outputs: [
                    {
                        internalType: "uint256",
                        name: "",
                        type: "uint256"
                    }
                ],
                stateMutability: "view",
                type: "function"
            },
            {
                inputs: [],
                name: "protocolId",
                outputs: [
                    {
                        internalType: "uint256",
                        name: "",
                        type: "uint256"
                    }
                ],
                stateMutability: "pure",
                type: "function"
            },
            {
                inputs: [
                    {
                        internalType: "uint32",
                        name: "_newThreshold",
                        type: "uint32"
                    }
                ],
                name: "setAssetThreshold",
                outputs: [],
                stateMutability: "nonpayable",
                type: "function"
            },
            {
                inputs: [
                    {
                        internalType: "address",
                        name: "_newAddress",
                        type: "address"
                    }
                ],
                name: "setGoldenTicketNFTAddress",
                outputs: [],
                stateMutability: "nonpayable",
                type: "function"
            },
            {
                inputs: [
                    {
                        internalType: "uint256",
                        name: "_eventId",
                        type: "uint256"
                    },
                    {
                        internalType: "externalEuint32",
                        name: "_encryptedBalance",
                        type: "bytes32"
                    },
                    {
                        internalType: "bytes",
                        name: "inputProof",
                        type: "bytes"
                    }
                ],
                name: "verifyAndRequestMint",
                outputs: [],
                stateMutability: "nonpayable",
                type: "function"
            }
        ]
    }
},
} as const;

export default deployedContracts satisfies GenericContractsDeclaration;
