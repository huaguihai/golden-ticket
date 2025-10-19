"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAccount, usePublicClient, useWriteContract, useWaitForTransactionReceipt, useWatchContractEvent, useBalance } from "wagmi";
import { ShieldCheckIcon, CurrencyDollarIcon, CalendarIcon, ArrowLeftIcon, CheckCircleIcon, XCircleIcon, WalletIcon } from "@heroicons/react/24/outline";
import { formatEther } from "viem";
import { encryptBalance } from "~~/services/fheService";
import { toast } from "react-hot-toast";
import deployedContracts from "~~/contracts/deployedContracts";

interface Event {
  organizer: string;
  assetThreshold: number;
  eventName: string;
  expiryTime: bigint;
  isActive: boolean;
}

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params?.eventId as string;

  const { address: connectedAddress, isConnected, chain } = useAccount();
  const chainId = chain?.id;

  // Always use Sepolia for reading event data
  const publicClient = usePublicClient({ chainId: 11155111 });

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<"idle" | "verifying" | "success" | "failed">("idle");

  // Auto-fetch wallet balance
  const { data: balanceData, isLoading: balanceLoading } = useBalance({
    address: connectedAddress,
  });

  const chainIdTyped = (chainId || 11155111) as 11155111;
  const eventManagerContract = deployedContracts[chainIdTyped]?.EventManager;
  const verificationContract = deployedContracts[chainIdTyped]?.GoldenTicketVerification;
  const nftContract = deployedContracts[chainIdTyped]?.GoldenTicketNFT;

  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  // Listen for NFT Transfer events
  useWatchContractEvent({
    address: nftContract?.address as `0x${string}`,
    abi: nftContract?.abi,
    eventName: "Transfer",
    onLogs(logs) {
      for (const log of logs) {
        if ((log.args as any).to === connectedAddress) {
          toast.success(`🎉 Golden Ticket Minted! Token ID: ${(log.args as any).tokenId?.toString()}`);
          setVerificationStatus("success");
          setIsVerifying(false);

          // Redirect to my-tickets page after 2 seconds
          setTimeout(() => {
            router.push("/my-tickets");
          }, 2000);
        }
      }
    },
  });

  // Fetch event details
  useEffect(() => {
    const fetchEvent = async () => {
      if (!publicClient || !eventManagerContract || !eventId) return;

      try {
        const result = await publicClient.readContract({
          address: eventManagerContract.address as `0x${string}`,
          abi: eventManagerContract.abi,
          functionName: "getEvent",
          args: [BigInt(eventId)],
        }) as any;

        setEvent({
          organizer: result.organizer || result[0],
          assetThreshold: Number(result.assetThreshold || result[1]),
          eventName: result.eventName || result[2],
          expiryTime: result.expiryTime || result[3],
          isActive: result.isActive !== undefined ? result.isActive : result[4],
        });
      } catch (error) {
        console.error("Error fetching event:", error);
        toast.error("Failed to load event details");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [publicClient, eventManagerContract, eventId]);

  // Handle transaction status
  useEffect(() => {
    if (isPending) {
      setIsVerifying(true);
      setVerificationStatus("verifying");
      toast.loading("Submitting verification request...", { id: "verify" });
    } else if (isConfirmed) {
      toast.success("Verification request submitted! Waiting for oracle callback...", { id: "verify" });
    }
  }, [isPending, isConfirmed]);

  const handleVerify = async () => {
    if (!isConnected || !connectedAddress || !chainId) {
      toast.error("Please connect your wallet");
      return;
    }

    if (!balanceData) {
      toast.error("Unable to fetch wallet balance");
      return;
    }

    // Get actual balance in ETH
    const balanceInEth = parseFloat(formatEther(balanceData.value));

    if (!verificationContract) {
      toast.error("Verification contract not found");
      return;
    }

    setIsVerifying(true);
    setVerificationStatus("verifying");

    try {
      // Convert ETH to milli-ETH units (match contract's uint32 format)
      const balanceInMilliEth = Math.floor(balanceInEth * 1000);

      const { ciphertext, publicAmount } = await encryptBalance(
        balanceInMilliEth,
        chainId,
        verificationContract.address as `0x${string}`,
        connectedAddress
      );

      writeContract({
        address: verificationContract.address as `0x${string}`,
        abi: verificationContract.abi,
        functionName: "verifyAndRequestMint",
        args: [BigInt(eventId), ciphertext, publicAmount],
      });
    } catch (error) {
      console.error("Verification error:", error);
      toast.error("Verification failed. Please try again.");
      setIsVerifying(false);
      setVerificationStatus("failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-300">Loading event details...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-300 text-xl">Event not found</p>
          <button
            onClick={() => router.push("/app/events")}
            className="mt-4 px-6 py-3 bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-colors"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  const isExpired = new Date(Number(event.expiryTime) * 1000) < new Date();
  const thresholdEth = event.assetThreshold / 1000;

  // Calculate if user meets requirement
  const userBalanceEth = balanceData ? parseFloat(formatEther(balanceData.value)) : 0;
  const meetsRequirement = userBalanceEth >= thresholdEth;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-900 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-6 py-16">
        {/* Back Button */}
        <button
          onClick={() => router.push("/app/events")}
          className="flex items-center gap-2 text-slate-300 hover:text-cyan-400 transition-colors mb-8"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Back to Events
        </button>

        {/* Event Header */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 mb-8">
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-amber-400 bg-clip-text text-transparent">
              {event.eventName}
            </h1>
            {event.isActive && !isExpired ? (
              <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500/30 rounded-full text-green-300">
                <CheckCircleIcon className="w-5 h-5" />
                Active
              </span>
            ) : (
              <span className="px-4 py-2 bg-slate-700/50 border border-slate-600 rounded-full text-slate-400">
                Inactive
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-cyan-500/10 rounded-xl">
                <CurrencyDollarIcon className="w-8 h-8 text-cyan-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Asset Threshold</p>
                <p className="text-2xl font-bold">{thresholdEth} ETH</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-500/10 rounded-xl">
                <CalendarIcon className="w-8 h-8 text-amber-400" />
              </div>
              <div>
                <p className="text-sm text-slate-400">Expires</p>
                <p className="text-xl font-bold">
                  {new Date(Number(event.expiryTime) * 1000).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Verification Form */}
        {!isConnected ? (
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8 text-center">
            <ShieldCheckIcon className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
            <p className="text-xl text-slate-300 mb-6">Connect your wallet to participate</p>
          </div>
        ) : verificationStatus === "success" ? (
          <div className="bg-gradient-to-br from-green-800/20 to-green-900/20 backdrop-blur-sm border border-green-500/30 rounded-2xl p-8 text-center">
            <CheckCircleIcon className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-green-400 mb-2">Verification Successful!</h3>
            <p className="text-slate-300 mb-4">Your Golden Ticket has been minted</p>
            <p className="text-sm text-slate-400">Redirecting to My Tickets...</p>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <ShieldCheckIcon className="w-8 h-8 text-cyan-400" />
              Private Asset Verification
            </h2>

            {/* Wallet Balance Display */}
            <div className="mb-6 p-6 bg-slate-900/50 border border-slate-700 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-cyan-500/10 rounded-lg">
                    <WalletIcon className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Your Wallet Balance</p>
                    {balanceLoading ? (
                      <p className="text-xl font-bold text-slate-300">Loading...</p>
                    ) : balanceData ? (
                      <p className="text-2xl font-bold text-white">
                        {parseFloat(formatEther(balanceData.value)).toFixed(4)} ETH
                      </p>
                    ) : (
                      <p className="text-xl font-bold text-slate-400">--</p>
                    )}
                  </div>
                </div>

                {/* Status Badge */}
                {balanceData && (
                  <div>
                    {meetsRequirement ? (
                      <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500/30 rounded-full text-green-300 font-medium">
                        <CheckCircleIcon className="w-5 h-5" />
                        Eligible
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-500/30 rounded-full text-red-300 font-medium">
                        <XCircleIcon className="w-5 h-5" />
                        Insufficient
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Requirement Comparison */}
              {balanceData && (
                <div className="pt-4 border-t border-slate-700/50">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Event Threshold:</span>
                    <span className="font-semibold text-amber-400">{thresholdEth} ETH</span>
                  </div>
                  {!meetsRequirement && (
                    <p className="mt-2 text-xs text-red-400">
                      ⚠️ You need at least {(thresholdEth - userBalanceEth).toFixed(4)} more ETH to participate
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Privacy Notice */}
            <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <p className="text-sm text-blue-300">
                🔒 <strong>Privacy Protected:</strong> Your balance will be encrypted before verification. The contract only learns whether you meet the threshold, not your exact balance.
              </p>
            </div>

            {/* Register Button */}
            <button
              onClick={handleVerify}
              disabled={!isConnected || isVerifying || !balanceData || !meetsRequirement}
              className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:from-slate-700 disabled:to-slate-600 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all duration-300 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-400/40 disabled:shadow-none flex items-center justify-center gap-2"
            >
              {isVerifying ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Verifying...
                </>
              ) : !balanceData ? (
                "Loading Balance..."
              ) : !meetsRequirement ? (
                <>
                  <XCircleIcon className="w-5 h-5" />
                  Insufficient Balance
                </>
              ) : (
                <>
                  <ShieldCheckIcon className="w-5 h-5" />
                  Register for Event
                </>
              )}
            </button>

            {verificationStatus === "verifying" && (
              <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <p className="text-sm text-blue-300">
                  ⏳ Waiting for oracle callback... This may take a few moments.
                </p>
              </div>
            )}

            {verificationStatus === "failed" && (
              <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
                <XCircleIcon className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-300">Verification Failed</p>
                  <p className="text-xs text-red-400 mt-1">
                    Your assets may not meet the threshold, or there was an error. Please try again.
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
