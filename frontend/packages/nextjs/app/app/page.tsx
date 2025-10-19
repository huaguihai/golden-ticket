'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAccount, usePublicClient } from 'wagmi';
import {
  ChartBarIcon,
  TicketIcon,
  CalendarIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon,
  ShieldCheckIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline';
import deployedContracts from '~~/contracts/deployedContracts';

export default function DashboardPage() {
  const { address: connectedAddress, isConnected, chainId: userChainId } = useAccount();
  const publicClient = usePublicClient();
  const [stats, setStats] = useState({
    totalEvents: 0,
    activeEvents: 0,
    myTickets: 0,
  });

  const chainId = 11155111; // Sepolia
  const isCorrectNetwork = userChainId === chainId;
  const eventManagerContract = deployedContracts[chainId]?.EventManager;
  const nftContract = deployedContracts[chainId]?.GoldenTicketNFT;

  useEffect(() => {
    const fetchStats = async () => {
      if (!publicClient || !eventManagerContract || !isCorrectNetwork) return;

      try {
        // Get total events
        const nextEventId = await publicClient.readContract({
          address: eventManagerContract.address as `0x${string}`,
          abi: eventManagerContract.abi,
          functionName: 'nextEventId',
        }) as bigint;

        const totalEvents = Number(nextEventId) - 1;

        // Count active events
        let activeCount = 0;
        for (let i = 1; i <= totalEvents; i++) {
          const event = await publicClient.readContract({
            address: eventManagerContract.address as `0x${string}`,
            abi: eventManagerContract.abi,
            functionName: 'getEvent',
            args: [BigInt(i)],
          }) as any;

          const isActive = event.isActive || event[4];
          const expiryTime = event.expiryTime || event[3];
          const notExpired = new Date(Number(expiryTime) * 1000) > new Date();

          if (isActive && notExpired) {
            activeCount++;
          }
        }

        // Get user's NFT count if connected
        let nftCount = 0;
        if (isConnected && connectedAddress && nftContract) {
          const balance = await publicClient.readContract({
            address: nftContract.address as `0x${string}`,
            abi: nftContract.abi,
            functionName: 'balanceOf',
            args: [connectedAddress],
          }) as bigint;
          nftCount = Number(balance);
        }

        setStats({
          totalEvents,
          activeEvents: activeCount,
          myTickets: nftCount,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, [publicClient, eventManagerContract, nftContract, isConnected, connectedAddress]);

  const statCards = [
    {
      label: 'Total Events',
      value: stats.totalEvents,
      change: '+12%',
      changeLabel: 'all time',
      icon: ChartBarIcon,
      color: 'cyan',
    },
    {
      label: 'Active Events',
      value: stats.activeEvents,
      change: '+8%',
      changeLabel: 'this month',
      icon: CalendarIcon,
      color: 'green',
    },
    {
      label: 'My Tickets',
      value: stats.myTickets,
      change: isConnected ? '' : 'Connect wallet',
      changeLabel: isConnected ? 'owned' : '',
      icon: TicketIcon,
      color: 'amber',
    },
    {
      label: 'Privacy Success',
      value: '99.8%',
      change: '+0.2%',
      changeLabel: 'system reliability',
      icon: ShieldCheckIcon,
      color: 'violet',
    },
  ];

  const quickActions = [
    {
      title: 'Browse Events',
      description: 'Discover exclusive events and verify your eligibility',
      icon: CalendarIcon,
      href: '/app/events',
      color: 'from-cyan-600 to-blue-600',
    },
    {
      title: 'Create Event',
      description: 'Publish your own event with asset threshold requirements',
      icon: RocketLaunchIcon,
      href: '/app/create-event',
      color: 'from-amber-600 to-orange-600',
    },
    {
      title: 'My Tickets',
      description: 'View and manage your Golden Ticket NFTs',
      icon: TicketIcon,
      href: '/app/my-tickets',
      color: 'from-violet-600 to-purple-600',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Wrong Network Warning */}
      {isConnected && !isCorrectNetwork && (
        <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500/50 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-orange-300 mb-2">Wrong Network</h3>
              <p className="text-slate-300 mb-3">
                This DApp is deployed on Sepolia Testnet. Please switch your wallet to Sepolia network to continue.
              </p>
              <p className="text-sm text-slate-400">
                Current network: {userChainId ? `Chain ID ${userChainId}` : 'Unknown'} | Required: Sepolia (Chain ID 11155111)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Welcome Banner */}
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-amber-400 bg-clip-text text-transparent mb-2">
              Welcome to Golden Ticket
            </h2>
            <p className="text-slate-300 text-lg max-w-2xl">
              Cast your vote with complete privacy using Fully Homomorphic Encryption. Your choices remain encrypted throughout the entire voting process.
            </p>
            <div className="flex gap-4 mt-6">
              <Link
                href="/app/events"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-lg transition-all duration-300 shadow-lg shadow-cyan-500/30"
              >
                <CalendarIcon className="w-5 h-5" />
                View Active Events
              </Link>
              <button className="inline-flex items-center gap-2 px-6 py-3 border border-slate-600 hover:border-slate-500 hover:bg-slate-800/50 text-white font-semibold rounded-lg transition-all duration-300">
                How it Works
              </button>
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="w-32 h-32 bg-gradient-to-br from-cyan-500/20 to-amber-500/20 rounded-full blur-2xl"></div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          const colorMap = {
            cyan: 'from-cyan-500/20 to-cyan-600/20 border-cyan-500/30 text-cyan-400',
            green: 'from-green-500/20 to-green-600/20 border-green-500/30 text-green-400',
            amber: 'from-amber-500/20 to-amber-600/20 border-amber-500/30 text-amber-400',
            violet: 'from-violet-500/20 to-violet-600/20 border-violet-500/30 text-violet-400',
          };

          return (
            <div
              key={stat.label}
              className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:border-slate-600/50 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 bg-gradient-to-r ${colorMap[stat.color as keyof typeof colorMap]} border rounded-xl`}>
                  <Icon className="w-6 h-6" />
                </div>
                {stat.change && (
                  <span className="text-sm text-green-400 flex items-center gap-1">
                    {stat.change !== 'Connect wallet' && <ArrowTrendingUpIcon className="w-4 h-4" />}
                    {stat.change}
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-400 mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
              {stat.changeLabel && <p className="text-xs text-slate-500">{stat.changeLabel}</p>}
            </div>
          );
        })}
      </div>

      {/* Security Features */}
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
        <h3 className="text-2xl font-bold text-white mb-6">Security Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-slate-900/30 border border-slate-700/30 rounded-xl">
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl w-fit mb-4">
              <ShieldCheckIcon className="w-6 h-6 text-emerald-400" />
            </div>
            <h4 className="text-lg font-bold text-emerald-400 mb-2">End-to-End Encryption</h4>
            <p className="text-sm text-slate-400">
              Votes are encrypted on your device before transmission
            </p>
          </div>
          <div className="p-6 bg-slate-900/30 border border-slate-700/30 rounded-xl">
            <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xl w-fit mb-4">
              <ChartBarIcon className="w-6 h-6 text-cyan-400" />
            </div>
            <h4 className="text-lg font-bold text-cyan-400 mb-2">Homomorphic Tallying</h4>
            <p className="text-sm text-slate-400">
              Results computed without decrypting individual votes
            </p>
          </div>
          <div className="p-6 bg-slate-900/30 border border-slate-700/30 rounded-xl">
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl w-fit mb-4">
              <TicketIcon className="w-6 h-6 text-amber-400" />
            </div>
            <h4 className="text-lg font-bold text-amber-400 mb-2">Verifiable Voting</h4>
            <p className="text-sm text-slate-400">
              Verify your vote without revealing your choice
            </p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-2xl font-bold text-white mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.title}
                href={action.href}
                className="group bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:border-slate-600 transition-all duration-300 hover:scale-105"
              >
                <div className={`p-4 bg-gradient-to-r ${action.color} rounded-xl w-fit mb-4 group-hover:shadow-lg transition-all duration-300`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h4 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                  {action.title}
                </h4>
                <p className="text-sm text-slate-400">{action.description}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
