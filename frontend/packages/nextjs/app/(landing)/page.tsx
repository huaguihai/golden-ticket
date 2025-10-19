import Link from "next/link";
import {
  ShieldCheckIcon,
  LockClosedIcon,
  SparklesIcon,
  TicketIcon,
  CubeTransparentIcon,
  ServerStackIcon,
  UserGroupIcon,
  ChartBarIcon,
  CalendarIcon,
  BuildingLibraryIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline';

// This page is now static and doesn't need server-side translation fetching
// All text is hardcoded as per the design document for this refactoring pass.

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white relative overflow-hidden">
      {/* Advanced background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent pointer-events-none"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-amber-900/10 via-transparent to-transparent pointer-events-none"></div>

      {/* Animated grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(to right, rgb(148, 163, 184) 1px, transparent 1px), linear-gradient(to bottom, rgb(148, 163, 184) 1px, transparent 1px)`,
        backgroundSize: '50px 50px'
      }}></div>

      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
      {/* Hero Section */}
      <section className="relative w-full max-w-6xl mx-auto px-8 py-20 text-center lg:text-left z-10">
        <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
          <div className="lg:w-1/2 flex justify-center p-8">
            {/* Animated Golden Ticket NFT showcase */}
            <div className="w-80 h-48 bg-gradient-to-br from-amber-600/20 via-slate-800/50 to-slate-900/50 rounded-2xl shadow-2xl relative overflow-hidden border border-amber-500/30 hover:border-amber-400/60 transition-all duration-500 hover:scale-105 hover:shadow-amber-500/30 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 to-transparent"></div>
              <div className="p-6 text-left relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <TicketIcon className="w-6 h-6 text-amber-400" />
                  <h4 className="font-bold text-amber-400 text-lg tracking-wider">GOLDEN TICKET</h4>
                </div>
                <p className="text-sm text-slate-300 mt-1">Verified Asset Holder</p>
              </div>
              <div className="absolute bottom-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full">
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-amber-500/5 to-transparent animate-pulse"></div>
              </div>
            </div>
          </div>
          <div className="lg:w-1/2">
            <div className="flex gap-3 mb-6 justify-center lg:justify-start flex-wrap">
              <span className="bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 px-4 py-2 rounded-full text-xs font-medium backdrop-blur-sm flex items-center gap-2">
                <LockClosedIcon className="w-4 h-4" />
                Powered by Zama fhEVM
              </span>
              <span className="bg-amber-500/10 border border-amber-400/30 text-amber-300 px-4 py-2 rounded-full text-xs font-medium backdrop-blur-sm flex items-center gap-2">
                <ShieldCheckIcon className="w-4 h-4" />
                Fully Encrypted Verification
              </span>
            </div>
            <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-amber-400 bg-clip-text text-transparent">
                Verify Your Assets.
              </span>
              <br />
              <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-cyan-400 bg-clip-text text-transparent">
                Protect Your Privacy.
              </span>
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed mb-8">
              Golden Ticket uses Fully Homomorphic Encryption to verify your eligibility for exclusive events and services—without exposing your financial data.
            </p>
            <div className="flex gap-4 justify-center lg:justify-start flex-wrap">
              <Link href="/app" target="_blank" rel="noopener noreferrer" className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 px-8 py-4 rounded-xl text-white font-bold shadow-lg shadow-cyan-500/30 hover:shadow-cyan-400/50 transition-all duration-300 hover:scale-105 flex items-center gap-2">
                <RocketLaunchIcon className="w-5 h-5" />
                Launch DApp
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Trust Section */}
      <section className="py-20 w-full max-w-6xl mx-auto px-8 z-10 relative">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">Built on Cutting-Edge Privacy Technology</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-xl p-8 hover:border-emerald-500/50 transition-all duration-300 hover:scale-105 hover:shadow-emerald-500/20 group">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-emerald-500/10 rounded-xl group-hover:bg-emerald-500/20 transition-colors">
                <LockClosedIcon className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-2xl font-bold text-emerald-400">Fully Homomorphic Encryption</h3>
            </div>
            <p className="text-slate-300 leading-relaxed">Your data remains encrypted during entire verification process—even during computation.</p>
          </div>
          <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-xl p-8 hover:border-cyan-500/50 transition-all duration-300 hover:scale-105 hover:shadow-cyan-500/20 group">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-cyan-500/10 rounded-xl group-hover:bg-cyan-500/20 transition-colors">
                <CubeTransparentIcon className="w-8 h-8 text-cyan-400" />
              </div>
              <h3 className="text-2xl font-bold text-cyan-400">Zama fhEVM Integration</h3>
            </div>
            <p className="text-slate-300 leading-relaxed">Leveraging the first confidential smart contract platform for blockchain-native privacy.</p>
          </div>
          <div className="bg-gradient-to-br from-slate-800/40 to-slate-900/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl shadow-xl p-8 hover:border-violet-500/50 transition-all duration-300 hover:scale-105 hover:shadow-violet-500/20 group">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-violet-500/10 rounded-xl group-hover:bg-violet-500/20 transition-colors">
                <ShieldCheckIcon className="w-8 h-8 text-violet-400" />
              </div>
              <h3 className="text-2xl font-bold text-violet-400">Zero-Knowledge Principles</h3>
            </div>
            <p className="text-slate-300 leading-relaxed">Prove you qualify without revealing any details about your assets or identity.</p>
          </div>
        </div>
      </section>

      {/* How It Works - Process Flow */}
      <section className="py-20 w-full max-w-5xl mx-auto px-8 z-10 relative">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">Get Verified in 3 Simple Steps</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-8 rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-sm shadow-lg hover:border-amber-500/50 transition-all duration-300 group">
            <div className="text-6xl font-bold bg-gradient-to-br from-amber-400 to-amber-600 bg-clip-text text-transparent mb-4 group-hover:scale-110 transition-transform duration-300">1</div>
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-amber-500/10 rounded-2xl group-hover:bg-amber-500/20 transition-colors">
                <ServerStackIcon className="w-10 h-10 text-amber-400" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mt-2 mb-3">Connect & Encrypt</h3>
            <p className="text-slate-300 leading-relaxed">Connect your Web3 wallet. Your asset data is immediately encrypted using FHE technology.</p>
          </div>
          <div className="p-8 rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-sm shadow-lg hover:border-amber-500/50 transition-all duration-300 group">
            <div className="text-6xl font-bold bg-gradient-to-br from-amber-400 to-amber-600 bg-clip-text text-transparent mb-4 group-hover:scale-110 transition-transform duration-300">2</div>
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-amber-500/10 rounded-2xl group-hover:bg-amber-500/20 transition-colors">
                <ShieldCheckIcon className="w-10 h-10 text-amber-400" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mt-2 mb-3">Private Verification</h3>
            <p className="text-slate-300 leading-relaxed">Our smart contract verifies your encrypted balance against the threshold—without decryption.</p>
          </div>
          <div className="p-8 rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-sm shadow-lg hover:border-amber-500/50 transition-all duration-300 group">
            <div className="text-6xl font-bold bg-gradient-to-br from-amber-400 to-amber-600 bg-clip-text text-transparent mb-4 group-hover:scale-110 transition-transform duration-300">3</div>
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-amber-500/10 rounded-2xl group-hover:bg-amber-500/20 transition-colors">
                <TicketIcon className="w-10 h-10 text-amber-400" />
              </div>
            </div>
            <h3 className="text-2xl font-bold mt-2 mb-3">Receive Golden Ticket</h3>
            <p className="text-slate-300 leading-relaxed">Upon verification, mint your exclusive Golden Ticket NFT for access to premium experiences.</p>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 w-full max-w-6xl mx-auto px-8 z-10 relative">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4">Unlock Exclusive Opportunities</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-sm shadow-lg p-6 hover:border-pink-500/50 transition-all duration-300 hover:scale-105 hover:shadow-pink-500/10 group">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-pink-500/10 rounded-lg group-hover:bg-pink-500/20 transition-colors">
                <ChartBarIcon className="w-6 h-6 text-pink-400" />
              </div>
              <h3 className="font-bold text-lg text-pink-400">Private Auctions</h3>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">Access high-value NFT and asset auctions with verified participant requirements.</p>
          </div>
          <div className="rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-sm shadow-lg p-6 hover:border-blue-500/50 transition-all duration-300 hover:scale-105 hover:shadow-blue-500/10 group">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                <CalendarIcon className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="font-bold text-lg text-blue-400">VIP Events</h3>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">Gain entry to exclusive conferences, parties, and networking events.</p>
          </div>
          <div className="rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-sm shadow-lg p-6 hover:border-emerald-500/50 transition-all duration-300 hover:scale-105 hover:shadow-emerald-500/10 group">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-emerald-500/10 rounded-lg group-hover:bg-emerald-500/20 transition-colors">
                <UserGroupIcon className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="font-bold text-lg text-emerald-400">Private Clubs</h3>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">Join exclusive DAOs and private communities with asset-based membership.</p>
          </div>
          <div className="rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-sm shadow-lg p-6 hover:border-violet-500/50 transition-all duration-300 hover:scale-105 hover:shadow-violet-500/10 group">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-violet-500/10 rounded-lg group-hover:bg-violet-500/20 transition-colors">
                <RocketLaunchIcon className="w-6 h-6 text-violet-400" />
              </div>
              <h3 className="font-bold text-lg text-violet-400">Early Access</h3>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">Get priority access to high-potential project launches and investment opportunities.</p>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-24 w-full px-8 z-10 relative">
        <div className="rounded-3xl border border-amber-500/30 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm shadow-2xl shadow-amber-500/10 max-w-4xl mx-auto p-12 text-center hover:border-amber-400/50 transition-all duration-500">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-amber-400 to-cyan-400 bg-clip-text text-transparent">
            Ready to Access the World of Exclusive Opportunities?
          </h2>
          <p className="text-lg text-slate-300 my-6 leading-relaxed">
            Join thousands of high-net-worth individuals who protect their privacy while verifying their eligibility.
          </p>
          <div className="flex gap-4 justify-center flex-wrap mt-8">
            <Link href="/app" target="_blank" rel="noopener noreferrer" className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 px-8 py-4 rounded-xl text-white font-bold shadow-lg shadow-cyan-500/30 hover:shadow-cyan-400/50 transition-all duration-300 hover:scale-105 flex items-center gap-2">
              <TicketIcon className="w-5 h-5" />
              Start Private Verification
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}