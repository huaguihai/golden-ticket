import React from 'react';
import Link from 'next/link';
import { TicketIcon } from '@heroicons/react/24/outline';
import { FaTwitter, FaDiscord, FaGithub } from 'react-icons/fa';

export const Footer = () => {
  return (
    <footer className="w-full bg-gradient-to-b from-slate-950 to-slate-900 text-white border-t border-slate-800/50">
      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="md:col-span-2 flex flex-col space-y-4">
            <div className="flex items-center space-x-2 group">
              <div className="p-2 bg-gradient-to-br from-amber-500/20 to-cyan-500/20 rounded-lg">
                <TicketIcon className="w-6 h-6 text-amber-400" />
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-cyan-400 to-amber-400 bg-clip-text text-transparent">
                Golden Ticket
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-md">
              FHE-Powered Private Verification. Prove your eligibility for exclusive events and services without exposing your financial data.
            </p>
            <div className="flex gap-4 pt-2">
              <a
                href="https://x.com/im0xmarco"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 hover:border-cyan-500/50 rounded-lg transition-all duration-300 hover:scale-110 group"
              >
                <FaTwitter className="w-5 h-5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
              </a>
              <a
                href="https://discord.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 hover:border-violet-500/50 rounded-lg transition-all duration-300 hover:scale-110 group"
              >
                <FaDiscord className="w-5 h-5 text-slate-400 group-hover:text-violet-400 transition-colors" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700/50 hover:border-amber-500/50 rounded-lg transition-all duration-300 hover:scale-110 group"
              >
                <FaGithub className="w-5 h-5 text-slate-400 group-hover:text-amber-400 transition-colors" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col">
            <h4 className="font-bold mb-4 text-cyan-400">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#technology" className="text-slate-400 hover:text-cyan-400 transition-colors">Technology</a></li>
              <li><a href="#use-cases" className="text-slate-400 hover:text-cyan-400 transition-colors">Use Cases</a></li>
              <li><a href="#developers" className="text-slate-400 hover:text-cyan-400 transition-colors">Developers</a></li>
              <li><a href="#faq" className="text-slate-400 hover:text-cyan-400 transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="flex flex-col">
            <h4 className="font-bold mb-4 text-amber-400">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-slate-400 hover:text-amber-400 transition-colors">Documentation</a></li>
              <li><a href="#" className="text-slate-400 hover:text-amber-400 transition-colors">Whitepaper</a></li>
              <li><a href="#" className="text-slate-400 hover:text-amber-400 transition-colors">GitHub</a></li>
              <li><a href="#" className="text-slate-400 hover:text-amber-400 transition-colors">Community</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-400">
            &copy; {new Date().getFullYear()} Golden Ticket Protocol. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-slate-400">
            <a href="#" className="hover:text-cyan-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-cyan-400 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};