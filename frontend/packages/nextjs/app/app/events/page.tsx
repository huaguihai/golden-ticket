"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePublicClient } from "wagmi";
import { CalendarIcon, CurrencyDollarIcon, TicketIcon, CheckCircleIcon } from "@heroicons/react/24/outline";
import deployedContracts from "~~/contracts/deployedContracts";

interface Event {
  id: number;
  organizer: string;
  assetThreshold: number;
  eventName: string;
  expiryTime: bigint;
  isActive: boolean;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  // Always use Sepolia for reading event data
  const publicClient = usePublicClient({ chainId: 11155111 });
  const chainId = 11155111; // Sepolia

  const eventManagerContract = deployedContracts[chainId]?.EventManager;

  useEffect(() => {
    const fetchEvents = async () => {
      if (!publicClient || !eventManagerContract) return;

      try {
        // First get nextEventId
        const nextEventId = await publicClient.readContract({
          address: eventManagerContract.address as `0x${string}`,
          abi: eventManagerContract.abi,
          functionName: "nextEventId",
        }) as bigint;

        const totalEvents = Number(nextEventId);
        const eventPromises = [];

        // Fetch each event
        for (let i = 1; i < totalEvents; i++) {
          eventPromises.push(
            publicClient.readContract({
              address: eventManagerContract.address as `0x${string}`,
              abi: eventManagerContract.abi,
              functionName: "getEvent",
              args: [BigInt(i)],
            })
          );
        }

        const results = await Promise.all(eventPromises);
        const formattedEvents = results.map((result: any) => ({
          id: Number(result.eventId || result[5]),
          organizer: result.organizer || result[0],
          assetThreshold: Number(result.assetThreshold || result[1]),
          eventName: result.eventName || result[2],
          expiryTime: result.expiryTime || result[3],
          isActive: result.isActive !== undefined ? result.isActive : result[4],
        }));

        setEvents(formattedEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [publicClient, eventManagerContract]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-900 text-white">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-cyan-400 to-amber-400 bg-clip-text text-transparent">
              Explore Events
            </span>
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Discover exclusive events and prove your eligibility with privacy-preserving asset verification
          </p>
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block p-4 bg-slate-800/50 rounded-full mb-4">
              <TicketIcon className="w-16 h-16 text-slate-400 animate-pulse" />
            </div>
            <p className="text-slate-400 text-xl">Loading events...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-block p-4 bg-slate-800/50 rounded-full mb-4">
              <TicketIcon className="w-16 h-16 text-slate-400" />
            </div>
            <p className="text-slate-400 text-xl">No events available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function EventCard({ event }: { event: Event }) {
  const isExpired = new Date(Number(event.expiryTime) * 1000) < new Date();
  const thresholdEth = event.assetThreshold / 1000; // Convert milli-ETH to ETH

  return (
    <Link href={`/app/events/${event.id}`}>
      <div className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:border-cyan-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/10 hover:scale-[1.02]">
        {/* Glowing effect on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-cyan-500/5 to-amber-500/0 opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-300" />

        <div className="relative">
          {/* Status Badge */}
          <div className="flex justify-between items-start mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-amber-500/20 to-amber-600/20 border border-amber-500/30 rounded-full text-amber-300 text-sm font-medium">
              <TicketIcon className="w-4 h-4" />
              Event #{event.id}
            </span>
            {event.isActive && !isExpired ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-green-500/20 to-green-600/20 border border-green-500/30 rounded-full text-green-300 text-sm">
                <CheckCircleIcon className="w-4 h-4" />
                Active
              </span>
            ) : (
              <span className="px-3 py-1 bg-slate-700/50 border border-slate-600 rounded-full text-slate-400 text-sm">
                Inactive
              </span>
            )}
          </div>

          {/* Event Name */}
          <h3 className="text-2xl font-bold mb-4 group-hover:text-cyan-400 transition-colors">
            {event.eventName}
          </h3>

          {/* Event Details */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-slate-300">
              <div className="p-2 bg-cyan-500/10 rounded-lg">
                <CurrencyDollarIcon className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Asset Threshold</p>
                <p className="font-semibold">{thresholdEth} ETH</p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-slate-300">
              <div className="p-2 bg-amber-500/10 rounded-lg">
                <CalendarIcon className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Expires</p>
                <p className="font-semibold">
                  {new Date(Number(event.expiryTime) * 1000).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-6 pt-4 border-t border-slate-700/50">
            <button className="w-full py-3 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white font-bold rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/30">
              View Details →
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
