'use client';

import { useState } from 'react';
import { useAccount, usePublicClient, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { CalendarIcon, CurrencyDollarIcon, PlusCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';
import deployedContracts from '~~/contracts/deployedContracts';

export default function CreateEventPage() {
  const { address: connectedAddress, isConnected, chainId } = useAccount();
  const publicClient = usePublicClient();

  const [formData, setFormData] = useState({
    eventName: '',
    assetThreshold: '',
    expiryDays: '365',
  });

  const [isCreating, setIsCreating] = useState(false);

  const chainIdTyped = (chainId || 11155111) as 11155111;
  const eventManagerContract = deployedContracts[chainIdTyped]?.EventManager;

  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConnected || !connectedAddress) {
      toast.error('Please connect your wallet');
      return;
    }

    if (!eventManagerContract) {
      toast.error('EventManager contract not found');
      return;
    }

    if (!formData.eventName.trim()) {
      toast.error('Please enter an event name');
      return;
    }

    const thresholdEth = parseFloat(formData.assetThreshold);
    if (isNaN(thresholdEth) || thresholdEth <= 0) {
      toast.error('Please enter a valid asset threshold');
      return;
    }

    const days = parseInt(formData.expiryDays);
    if (isNaN(days) || days <= 0) {
      toast.error('Please enter valid expiry days');
      return;
    }

    setIsCreating(true);

    try {
      // Convert ETH to milli-ETH units for uint32
      const thresholdInMilliEth = Math.floor(thresholdEth * 1000);

      // Calculate expiry timestamp
      const expiryTime = Math.floor(Date.now() / 1000) + days * 24 * 60 * 60;

      writeContract({
        address: eventManagerContract.address as `0x${string}`,
        abi: eventManagerContract.abi,
        functionName: 'createEvent',
        args: [thresholdInMilliEth, formData.eventName, BigInt(expiryTime)],
      });
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error('Failed to create event');
      setIsCreating(false);
    }
  };

  // Handle transaction status
  if (isPending) {
    toast.loading('Creating event...', { id: 'create-event' });
  } else if (isConfirmed) {
    toast.success('Event created successfully!', { id: 'create-event' });
    setIsCreating(false);
    // Reset form
    setFormData({
      eventName: '',
      assetThreshold: '',
      expiryDays: '365',
    });
  }

  const presetThresholds = [
    { label: 'Bronze', value: '0.001', days: 365 },
    { label: 'Silver', value: '0.01', days: 365 },
    { label: 'Gold', value: '0.05', days: 365 },
    { label: 'Platinum', value: '0.1', days: 365 },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-amber-400 bg-clip-text text-transparent mb-2">
          Create New Event
        </h2>
        <p className="text-slate-300">
          Publish an exclusive event with asset threshold requirements. Participants will verify their eligibility privately using FHE.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Event Name */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
          <label className="block text-white font-semibold mb-3">Event Name</label>
          <input
            type="text"
            value={formData.eventName}
            onChange={(e) => setFormData({ ...formData, eventName: e.target.value })}
            placeholder="e.g., Platinum Member Exclusive Party"
            className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            required
          />
        </div>

        {/* Asset Threshold */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
          <label className="block text-white font-semibold mb-3 flex items-center gap-2">
            <CurrencyDollarIcon className="w-5 h-5 text-cyan-400" />
            Asset Threshold (ETH)
          </label>
          <input
            type="number"
            step="0.001"
            min="0.001"
            value={formData.assetThreshold}
            onChange={(e) => setFormData({ ...formData, assetThreshold: e.target.value })}
            placeholder="0.1"
            className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            required
          />
          <p className="text-sm text-slate-400 mt-2">
            Minimum asset balance required to participate in this event
          </p>

          {/* Preset Buttons */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4">
            {presetThresholds.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    assetThreshold: preset.value,
                    expiryDays: preset.days.toString(),
                  })
                }
                className="px-3 py-2 bg-slate-800/50 hover:bg-cyan-600/20 border border-slate-700 hover:border-cyan-500/50 rounded-lg text-sm text-slate-300 hover:text-cyan-400 transition-all duration-200"
              >
                {preset.label}
                <br />
                <span className="text-xs text-slate-500">{preset.value} ETH</span>
              </button>
            ))}
          </div>
        </div>

        {/* Expiry Time */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6">
          <label className="block text-white font-semibold mb-3 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-amber-400" />
            Event Duration (Days)
          </label>
          <input
            type="number"
            min="1"
            value={formData.expiryDays}
            onChange={(e) => setFormData({ ...formData, expiryDays: e.target.value })}
            placeholder="365"
            className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
            required
          />
          <p className="text-sm text-slate-400 mt-2">
            Event will expire on: {new Date(Date.now() + parseInt(formData.expiryDays || '0') * 24 * 60 * 60 * 1000).toLocaleDateString()}
          </p>
        </div>

        {/* Privacy Notice */}
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
          <p className="text-sm text-blue-300">
            <strong>Privacy Protected:</strong> Participants' asset balances will be encrypted using FHE. Only eligibility status will be revealed, not exact balances.
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isConnected || isCreating || isPending || isConfirming}
          className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:from-slate-700 disabled:to-slate-600 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all duration-300 shadow-lg shadow-cyan-500/30 hover:shadow-cyan-400/40 disabled:shadow-none flex items-center justify-center gap-2"
        >
          {isCreating || isPending || isConfirming ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Creating Event...
            </>
          ) : !isConnected ? (
            'Connect Wallet to Create Event'
          ) : (
            <>
              <PlusCircleIcon className="w-5 h-5" />
              Create Event
            </>
          )}
        </button>
      </form>

      {/* Success Message */}
      {isConfirmed && (
        <div className="bg-gradient-to-br from-green-800/20 to-green-900/20 backdrop-blur-sm border border-green-500/30 rounded-2xl p-6">
          <div className="flex items-center gap-3 text-green-400 mb-2">
            <CheckCircleIcon className="w-6 h-6" />
            <h3 className="text-xl font-bold">Event Created Successfully!</h3>
          </div>
          <p className="text-slate-300 mb-4">
            Your event has been published. Participants can now verify their eligibility and register.
          </p>
          <a
            href="/app/events"
            className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg transition-all duration-300"
          >
            View All Events
          </a>
        </div>
      )}
    </div>
  );
}
