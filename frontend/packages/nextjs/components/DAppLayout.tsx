'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  TicketIcon,
  CalendarIcon,
  PlusCircleIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { RainbowKitCustomConnectButton } from '~~/components/helper/RainbowKitCustomConnectButton';

const navigation = [
  { name: 'Dashboard', href: '/app', icon: HomeIcon },
  { name: 'Browse Events', href: '/app/events', icon: CalendarIcon },
  { name: 'My Tickets', href: '/app/my-tickets', icon: TicketIcon },
  { name: 'Create Event', href: '/app/create-event', icon: PlusCircleIcon },
];

export default function DAppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
      {/* Background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-amber-900/10 via-transparent to-transparent pointer-events-none" />

      <div className="relative flex h-screen overflow-hidden">
        {/* Mobile sidebar backdrop */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-slate-900/50 backdrop-blur-md border-r border-slate-700/50 transform transition-transform duration-300 ease-in-out ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-700/50">
              <Link href="/" className="flex items-center space-x-2 group">
                <div className="p-2 bg-gradient-to-br from-amber-500/20 to-cyan-500/20 rounded-lg group-hover:from-amber-500/30 group-hover:to-cyan-500/30 transition-all duration-300">
                  <TicketIcon className="w-6 h-6 text-amber-400" />
                </div>
                <span className="font-bold text-lg bg-gradient-to-r from-cyan-400 to-amber-400 bg-clip-text text-transparent">
                  Golden Ticket
                </span>
              </Link>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden text-slate-400 hover:text-white"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Privacy Badge */}
            <div className="px-6 py-4">
              <div className="px-3 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
                <p className="text-xs text-cyan-300 font-medium">Privacy First</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
              {navigation.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/app' && pathname?.startsWith(item.href));
                const Icon = item.icon;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-cyan-600/30 to-blue-600/30 border border-cyan-500/50 text-white shadow-lg shadow-cyan-500/20'
                        : 'text-slate-300 hover:bg-slate-800/50 hover:text-white border border-transparent'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-slate-700/50">
              <div className="px-3 py-2 bg-slate-800/30 rounded-lg">
                <p className="text-xs text-slate-400">Powered by Zama fhEVM</p>
                <p className="text-xs text-slate-500 mt-1">Fully Homomorphic Encryption</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top bar */}
          <header className="sticky top-0 z-30 bg-slate-900/50 backdrop-blur-md border-b border-slate-700/50">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-4">
                {/* Mobile menu button */}
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden text-slate-300 hover:text-white"
                >
                  <Bars3Icon className="w-6 h-6" />
                </button>

                <div>
                  <h1 className="text-xl font-bold text-white">
                    {navigation.find(item => {
                      if (item.href === '/app') return pathname === '/app';
                      return pathname?.startsWith(item.href);
                    })?.name || 'Dashboard'}
                  </h1>
                  <p className="text-sm text-slate-400">Privacy-preserving asset verification</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <RainbowKitCustomConnectButton />
              </div>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 overflow-y-auto">
            <div className="p-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
