"use client";

import { useEffect, useState } from "react";
import { useAccount, usePublicClient, useWriteContract, useReadContract, useWatchContractEvent, useWaitForTransactionReceipt } from "wagmi";
import { encryptBalance } from "~~/services/fheService";
import { toast } from "react-hot-toast";
import deployedContracts from "~~/contracts/deployedContracts";
import { useTranslation } from "react-i18next"; // Corrected import

export default function GoldenTicketPage() {
  const { t } = useTranslation(); // Initialize useTranslation
  const { address: connectedAddress, isConnected, chainId } = useAccount(); // Get chainId from useAccount
  const publicClient = usePublicClient();
  const [assetBalance, setAssetBalance] = useState<number>(0);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [hasGoldenTicket, setHasGoldenTicket] = useState<boolean | null>(null); // null: unknown, true: has, false: not qualified

  // Safely get contract info only when chainId is available
  const chainIdTyped = chainId as keyof typeof deployedContracts;
  const nftContract = chainId ? deployedContracts[chainIdTyped]?.GoldenTicketNFT : undefined;
  const verificationContract = chainId ? deployedContracts[chainIdTyped]?.GoldenTicketVerification : undefined;

  // Read NFT balance
  const { data: nftBalance, refetch: refetchNftBalance } = useReadContract({
    abi: nftContract?.abi,
    address: nftContract?.address,
    functionName: "balanceOf",
    args: [connectedAddress],
    query: {
      enabled: isConnected && !!connectedAddress && !!nftContract,
      refetchInterval: 5000, // Poll every 5 seconds
    },
  });

  useEffect(() => {
    if (nftBalance !== undefined) {
      // wagmi v2+ with ethers v6 returns bigint. Convert it safely.
      setHasGoldenTicket(nftBalance > 0n);
    }
  }, [nftBalance]);

  // Listen for NFT Transfer events to confirm minting
  useWatchContractEvent({
    address: nftContract?.address,
    abi: nftContract?.abi,
    eventName: "Transfer",
    onLogs(logs) {
      for (const log of logs) {
        if (log.args.to === connectedAddress) {
          toast.success(t("verification_success_with_id", { tokenId: log.args.tokenId.toString() })); // Use i18n key
          refetchNftBalance(); // Refetch balance to update UI
        }
      }
    },
    enabled: !!nftContract,
  });

  const { writeContract, data: hash, isPending, error: writeError } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (isPending) {
      setIsVerifying(true);
      toast.loading(t("verifying_request_sending")); // Use i18n key
    } else if (isConfirmed) {
      setIsVerifying(false);
      toast.success(t("verifying_request_sent")); // Use i18n key
    } else if (writeError) {
      setIsVerifying(false);
      console.error("Verification error:", writeError);
      toast.error(t("verification_request_failed")); // Use i18n key
      setHasGoldenTicket(false);
    }
  }, [isPending, isConfirmed, writeError, t]); // Add t to dependency array

  const handleVerify = async () => {
    if (!isConnected || !publicClient || !connectedAddress || !chainId) {
      toast.error(t("connect_wallet_prompt")); // Use i18n key
      return;
    }
    if (assetBalance <= 0) {
      toast.error(t("enter_valid_asset_balance")); // Use i18n key
      return;
    }
    if (!verificationContract) {
      toast.error(t("contract_not_found_error")); // Use i18n key for contract not found
      return;
    }

    setIsVerifying(true);
    setHasGoldenTicket(null); // Reset status
    try {
      const { ciphertext, publicAmount } = await encryptBalance(assetBalance, chainId, publicClient);

      writeContract({
        address: verificationContract.address,
        abi: verificationContract.abi,
        functionName: "verifyAndRequestMint",
        args: [ciphertext, publicAmount],
      });
    } catch (error) {
      console.error("加密或合约调用错误:", error);
      toast.error(t("verification_process_error")); // Use i18n key
      setIsVerifying(false);
      setHasGoldenTicket(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-200 p-4">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body items-center text-center">
          <h2 className="card-title text-2xl font-bold mb-4">{t("dapp_title")}</h2>

          {!isConnected ? (
            <p className="text-error">{t("connect_wallet_prompt")}</p>
          ) : (
            <>
              <p className="text-lg mb-4">{t("your_address")}: {connectedAddress?.slice(0, 6)}...{connectedAddress?.slice(-4)}</p>
              <div className="form-control w-full max-w-xs mb-4">
                <label className="label">
                  <span className="label-text">{t("asset_input_label")}</span>
                </label>
                <input
                  type="number"
                  placeholder={t("asset_input_placeholder")}
                  className="input input-bordered w-full"
                  value={assetBalance}
                  onChange={(e) => setAssetBalance(Number(e.target.value))}
                  min="0"
                  disabled={isVerifying}
                />
              </div>
              <div className="card-actions">
                <button
                  className="btn btn-primary"
                  onClick={handleVerify}
                  disabled={!isConnected || isVerifying || assetBalance <= 0}
                >
                  {isVerifying ? t("verifying_button_text") : t("verify_button")}
                </button>
              </div>

              {isVerifying && <p className="mt-4 text-info">{t("verifying_status")}</p>}
              {hasGoldenTicket === true && (
                <p className="mt-4 text-success font-bold">{t("verification_success")}</p>
              )}
              {hasGoldenTicket === false && !isVerifying && (
                <p className="mt-4 text-warning">{t("verification_failure_ineligible")}</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}