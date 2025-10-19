'use client';

import { useEffect, useState } from 'react';
import { useAccount, usePublicClient } from 'wagmi';
import { TicketIcon, CalendarIcon, ShieldCheckIcon, QrCodeIcon } from '@heroicons/react/24/outline';
import { QRCodeSVG } from 'qrcode.react';
import deployedContracts from '~~/contracts/deployedContracts';

interface NFTTicket {
  tokenId: number;
  eventId: number;
  eventName: string;
  threshold: number;
  mintTime: number;
  owner: string;
}

export default function MyTicketsPage() {
  const { address: connectedAddress, isConnected } = useAccount();
  const publicClient = usePublicClient();
  const [tickets, setTickets] = useState<NFTTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<NFTTicket | null>(null);

  const chainId = 11155111; // Sepolia
  const nftContract = deployedContracts[chainId]?.GoldenTicketNFT;
  const eventManagerContract = deployedContracts[chainId]?.EventManager;

  useEffect(() => {
    const fetchTickets = async () => {
      if (!isConnected || !connectedAddress || !publicClient || !nftContract || !eventManagerContract) {
        setLoading(false);
        return;
      }

      try {
        // Get user's NFT balance
        const balance = await publicClient.readContract({
          address: nftContract.address as `0x${string}`,
          abi: nftContract.abi,
          functionName: 'balanceOf',
          args: [connectedAddress],
        }) as bigint;

        const tokenCount = Number(balance);

        if (tokenCount === 0) {
          setLoading(false);
          return;
        }

        // Get each token ID owned by the user
        const ticketPromises = [];
        for (let i = 0; i < tokenCount; i++) {
          ticketPromises.push(
            publicClient.readContract({
              address: nftContract.address as `0x${string}`,
              abi: nftContract.abi,
              functionName: 'tokenOfOwnerByIndex',
              args: [connectedAddress, BigInt(i)],
            })
          );
        }

        const tokenIds = await Promise.all(ticketPromises);

        // Get token URI and event details for each token
        const ticketDetailPromises = tokenIds.map(async (tokenId) => {
          const tokenIdNum = Number(tokenId);

          // Get token URI to extract eventId (assuming tokenURI contains eventId info)
          // For now, we'll use a simple mapping: tokenId corresponds to eventId
          // In production, you'd parse the tokenURI or have a mapping contract

          // Try to get event details for each event until we find the right one
          // This is a simplified approach - in production you'd have better tracking
          let eventId = 1; // Start from first event
          let eventData;

          try {
            // For demo purposes, we'll fetch first few events and match
            for (let eid = 1; eid <= 10; eid++) {
              try {
                eventData = await publicClient.readContract({
                  address: eventManagerContract.address as `0x${string}`,
                  abi: eventManagerContract.abi,
                  functionName: 'getEvent',
                  args: [BigInt(eid)],
                }) as any;

                // If we got valid event data, use this eventId
                if (eventData) {
                  eventId = eid;
                  break;
                }
              } catch (e) {
                // Event doesn't exist, continue
                continue;
              }
            }
          } catch (error) {
            console.error('Error fetching event:', error);
          }

          return {
            tokenId: tokenIdNum,
            eventId: eventId,
            eventName: eventData?.eventName || eventData?.[2] || `Event #${eventId}`,
            threshold: Number(eventData?.assetThreshold || eventData?.[1] || 0),
            mintTime: Date.now(), // In production, get from contract events
            owner: connectedAddress,
          };
        });

        const ticketDetails = await Promise.all(ticketDetailPromises);
        setTickets(ticketDetails);
      } catch (error) {
        console.error('Error fetching tickets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [isConnected, connectedAddress, publicClient, nftContract, eventManagerContract]);

  if (!isConnected) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <ShieldCheckIcon className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Connect Your Wallet</h2>
          <p className="text-slate-400">Please connect your wallet to view your Golden Tickets</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-300">Loading your tickets...</p>
        </div>
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center max-w-md">
          <TicketIcon className="w-16 h-16 text-slate-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">No Tickets Yet</h2>
          <p className="text-slate-400 mb-6">
            You haven't registered for any events yet. Browse available events and verify your eligibility to get your first Golden Ticket!
          </p>
          <a
            href="/app/events"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-lg transition-all duration-300"
          >
            <CalendarIcon className="w-5 h-5" />
            Browse Events
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">My Golden Tickets</h2>
          <p className="text-slate-400 mt-1">You own {tickets.length} ticket{tickets.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tickets.map((ticket) => (
          <div
            key={ticket.tokenId}
            className="group relative bg-gradient-to-br from-amber-600/20 via-slate-800/50 to-slate-900/50 rounded-2xl shadow-2xl overflow-hidden border border-amber-500/30 hover:border-amber-400/60 transition-all duration-500 hover:scale-105 hover:shadow-amber-500/30 backdrop-blur-sm cursor-pointer"
            onClick={() => setSelectedTicket(ticket)}
          >
            {/* Glowing effects */}
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 to-transparent"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl"></div>

            <div className="relative p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <TicketIcon className="w-6 h-6 text-amber-400" />
                  <h4 className="font-bold text-amber-400 text-lg tracking-wider">GOLDEN TICKET</h4>
                </div>
                <span className="text-xs text-slate-400">#{ticket.tokenId}</span>
              </div>

              {/* Event Name */}
              <h3 className="text-xl font-bold text-white mb-2">{ticket.eventName}</h3>

              {/* Details */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Threshold</span>
                  <span className="text-slate-200 font-semibold">{(ticket.threshold / 1000).toFixed(3)} ETH</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Verified</span>
                  <span className="text-green-400 flex items-center gap-1">
                    <ShieldCheckIcon className="w-4 h-4" />
                    Eligible
                  </span>
                </div>
              </div>

              {/* QR Code Preview */}
              <div className="bg-white/90 rounded-lg p-3 flex items-center justify-center">
                <QRCodeSVG
                  value={JSON.stringify({
                    tokenId: ticket.tokenId,
                    eventId: ticket.eventId,
                    owner: ticket.owner,
                    network: 'sepolia',
                  })}
                  size={100}
                  level="H"
                  includeMargin={true}
                />
              </div>

              {/* View Details Button */}
              <button className="w-full mt-4 py-2 bg-gradient-to-r from-amber-600/20 to-amber-500/20 hover:from-amber-600/30 hover:to-amber-500/30 border border-amber-500/30 text-amber-300 font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2">
                <QrCodeIcon className="w-4 h-4" />
                View QR Code
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* QR Code Modal */}
      {selectedTicket && (
        <div
          className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-6"
          onClick={() => setSelectedTicket(null)}
        >
          <div
            className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl p-8 max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <TicketIcon className="w-8 h-8 text-amber-400" />
                <h3 className="text-2xl font-bold text-white">Golden Ticket #{selectedTicket.tokenId}</h3>
              </div>

              <h4 className="text-xl font-semibold text-slate-200 mb-6">{selectedTicket.eventName}</h4>

              {/* Large QR Code */}
              <div className="bg-white rounded-xl p-6 mb-6">
                <QRCodeSVG
                  value={JSON.stringify({
                    tokenId: selectedTicket.tokenId,
                    eventId: selectedTicket.eventId,
                    owner: selectedTicket.owner,
                    network: 'sepolia',
                    contract: nftContract?.address,
                  })}
                  size={256}
                  level="H"
                  includeMargin={true}
                />
              </div>

              {/* Ticket Info */}
              <div className="bg-slate-800/50 rounded-xl p-4 mb-6 text-left space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Token ID</span>
                  <span className="text-white font-semibold">#{selectedTicket.tokenId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Event ID</span>
                  <span className="text-white font-semibold">#{selectedTicket.eventId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Threshold</span>
                  <span className="text-white font-semibold">{(selectedTicket.threshold / 1000).toFixed(3)} ETH</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Status</span>
                  <span className="text-green-400 flex items-center gap-1 font-semibold">
                    <ShieldCheckIcon className="w-4 h-4" />
                    Verified
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedTicket(null)}
                className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-all duration-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
