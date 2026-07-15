import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Github, Linkedin, Facebook, Twitter, Send, Award, ShieldCheck, HeartHandshake } from 'lucide-react';
import toast from 'react-hot-toast';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast.success('Subscribed successfully! Thank you for staying in touch.');
    setEmail('');
  };

  return (
    <footer className="border-t border-slate-900 bg-slate-950/80 text-slate-400 mt-auto">
      {/* Top badges */}
      <div className="border-b border-slate-900/60 py-8 bg-slate-950/45">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-600/10 text-blue-500">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-200 font-display">Verified Creators</h4>
              <p className="text-xs text-slate-500 mt-0.5">Every campaign is manually vetted before approvals.</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="p-3 rounded-xl bg-purple-600/10 text-purple-500">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-200 font-display">Secure Double Ledger</h4>
              <p className="text-xs text-slate-500 mt-0.5">Transparent transactions & full supporter refunds on deletion.</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="p-3 rounded-xl bg-sky-600/10 text-sky-500">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-200 font-display">Community First</h4>
              <p className="text-xs text-slate-500 mt-0.5">Lending support directly to causes and creative builds.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white">
                <span className="font-display font-extrabold text-lg">F</span>
              </div>
              <span className="font-display font-bold text-xl tracking-tight text-white">
                Fund<span className="text-blue-500">Forge</span>
              </span>
            </Link>
            <p className="text-sm text-slate-500">
              Empowering creators, technologists, and cause founders to secure micro-contributions and launch their vision.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:text-white transition"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:text-white transition"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:text-white transition"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:text-white transition"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Explore Links */}
          <div>
            <h3 className="text-sm font-semibold text-slate-200 tracking-wider font-display uppercase mb-4">Explore</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/explore" className="hover:text-white transition">All Campaigns</Link>
              </li>
              <li>
                <Link to="/explore?category=Technology" className="hover:text-white transition">Technology</Link>
              </li>
              <li>
                <Link to="/explore?category=Art" className="hover:text-white transition">Art & Creative</Link>
              </li>
              <li>
                <Link to="/explore?category=Community" className="hover:text-white transition">Community</Link>
              </li>
              <li>
                <Link to="/explore?category=Health" className="hover:text-white transition">Medical & Health</Link>
              </li>
            </ul>
          </div>

          {/* Legal / Pages */}
          <div>
            <h3 className="text-sm font-semibold text-slate-200 tracking-wider font-display uppercase mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="hover:text-white transition">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition">Contact</Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white transition">Help & FAQ</Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-white transition">Privacy Policy</Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Subscribe */}
          <div>
            <h3 className="text-sm font-semibold text-slate-200 tracking-wider font-display uppercase mb-4">Stay Tuned</h3>
            <p className="text-sm text-slate-500 mb-4">
              Get notified when top vetted projects launch or hit funding milestones.
            </p>
            <form onSubmit={handleSubscribe} className="relative flex">
              <input
                type="email"
                required
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg py-2 pl-3 pr-10 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-600"
              />
              <button
                type="submit"
                className="absolute right-1 top-1 p-1.5 rounded-md bg-blue-600 hover:bg-blue-500 text-white transition cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="border-t border-slate-900 mt-12 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} FundForge Inc. All rights reserved.</p>
          <div className="flex gap-4 mt-2 md:mt-0">
            <Link to="/privacy-policy" className="hover:text-white transition">Privacy</Link>
            <Link to="/faq" className="hover:text-white transition">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
