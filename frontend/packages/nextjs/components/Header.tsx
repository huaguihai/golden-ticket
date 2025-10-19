'use client';

import React from 'react';
import Link from 'next/link';
import { TicketIcon, BookOpenIcon, RocketLaunchIcon } from '@heroicons/react/24/outline';
import { RainbowKitCustomConnectButton } from '~~/components/helper/RainbowKitCustomConnectButton';

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/50 text-white">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <Link href="/" passHref className="flex items-center space-x-2 group">
            <div className="p-2 bg-gradient-to-br from-amber-500/20 to-cyan-500/20 rounded-lg group-hover:from-amber-500/30 group-hover:to-cyan-500/30 transition-all duration-300">
              <TicketIcon className="w-6 h-6 text-amber-400" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-cyan-400 to-amber-400 bg-clip-text text-transparent">
              Golden Ticket
            </span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <a href="#technology" className="text-slate-300 hover:text-cyan-400 transition-colors">Technology</a>
            <a href="#use-cases" className="text-slate-300 hover:text-cyan-400 transition-colors">Use Cases</a>
            <a href="#developers" className="text-slate-300 hover:text-cyan-400 transition-colors">Developers</a>
            <a href="#faq" className="text-slate-300 hover:text-cyan-400 transition-colors">FAQ</a>
          </nav>
        </div>
        <div className="flex items-center">
          {/* Header buttons removed as requested */}
        </div>
      </div>
    </header>
  );
};