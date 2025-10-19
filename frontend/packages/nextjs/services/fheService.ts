"use client";

import { FhevmInstance, initFhevm, createInstance } from "fhevmjs";

let fhevmInstance: FhevmInstance | null = null;
let currentChainId: number | null = null;
let fhevmInstancePromise: Promise<FhevmInstance> | null = null;

// Sepolia FHEVM configuration
const SEPOLIA_CONFIG = {
  chainId: 11155111,
  gatewayUrl: "https://gateway.sepolia.zama.ai",
  aclContractAddress: "0x687820221192C5B662b25367F70076A37bc79b6c",
  kmsContractAddress: "0x1364cBBf2cDF5032C47d8226a6f6FBD2AFCDacAC",
} as const;

/**
 * Gets or creates the FHEVM instance
 * Uses window.ethereum directly as fhevmjs expects an EIP-1193 provider
 */
export async function getFhevmInstance(chainId: number): Promise<FhevmInstance> {
  // Return cached instance if available and chain matches
  if (fhevmInstance && currentChainId === chainId) {
    return fhevmInstance;
  }

  // Return existing promise if initialization is in progress
  if (fhevmInstancePromise) {
    return fhevmInstancePromise;
  }

  // Create new instance
  fhevmInstancePromise = (async () => {
    try {
      // Check browser environment and ethereum provider
      if (typeof window === 'undefined') {
        throw new Error("Must be called in browser environment");
      }

      if (!window.ethereum) {
        throw new Error("Please install MetaMask or another Web3 wallet");
      }

      // Initialize WASM modules
      await initFhevm({ base: '/fhevmjs/' });

      // Create FHEVM instance with window.ethereum directly
      const instance = await createInstance({
        chainId: SEPOLIA_CONFIG.chainId,
        network: window.ethereum, // fhevmjs expects window.ethereum (EIP-1193)
        gatewayUrl: SEPOLIA_CONFIG.gatewayUrl,
        aclContractAddress: SEPOLIA_CONFIG.aclContractAddress,
        kmsContractAddress: SEPOLIA_CONFIG.kmsContractAddress,
      });

      fhevmInstance = instance;
      currentChainId = chainId;

      return instance;
    } catch (error) {
      console.error("[FHE] Failed to initialize FHEVM:", error);
      fhevmInstance = null;
      currentChainId = null;
      throw error;
    } finally {
      fhevmInstancePromise = null;
    }
  })();

  return fhevmInstancePromise;
}

/**
 * Encrypts a user's balance using FHE and generates the necessary proof.
 * @param balance The balance (uint32) to encrypt.
 * @param chainId The current chain ID.
 * @param contractAddress The address of the contract that will receive the encrypted input.
 * @param userAddress The address of the user making the request.
 * @returns An object containing the encrypted ciphertext (bytes) and public amount (bytes, proof).
 */
export async function encryptBalance(
  balance: number,
  chainId: number,
  contractAddress: string,
  userAddress: string
): Promise<{ ciphertext: `0x${string}`; publicAmount: `0x${string}` }> {
  const instance = await getFhevmInstance(chainId);

  // Create encrypted input for the specific contract and user
  const input = instance.createEncryptedInput(contractAddress, userAddress);

  // Add the balance as uint32
  input.add32(balance);

  // Generate the encrypted input with proof
  const encryptedInput = await input.encrypt();

  return {
    ciphertext: encryptedInput.handles[0] as `0x${string}`,
    publicAmount: encryptedInput.inputProof as `0x${string}`,
  };
}

/**
 * Helper to get the FHE public key
 */
export async function getFhePublicKey(chainId: number): Promise<string> {
  const instance = await getFhevmInstance(chainId);
  return instance.getPublicKey();
}
