import { Mail, Car } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white/40 dark:bg-slate-950/40 backdrop-blur-md text-slate-600 dark:text-slate-200 border-t border-white/20 dark:border-white/10">
      <div className="container px-4 md:px-6 py-12 md:py-16">
        <div className="grid gap-10 md:grid-cols-3 lg:grid-cols-4">
          {/* Column 1: Project Info */}
          <div className="space-y-4 lg:col-span-2">
            <div className="flex items-center space-x-2 text-xl font-bold text-slate-900 dark:text-white">
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Car className="h-5 w-5 text-white" />
              </div>
              <span className="tracking-tight">SmartLot</span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md leading-relaxed">
              An enterprise-grade automated parking solution designed to maximize efficiency, reduce congestion, and provide a seamless, digital experience.
            </p>
          </div>

          {/* Column 2: Contact */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100">Contact Us</h4>
            <div className="flex items-center space-x-2 text-sm text-slate-500 dark:text-slate-400 group">
              <Mail className="h-4 w-4 text-cyan-600 dark:text-cyan-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
              <a href="mailto:contact@smartlot.com" className="hover:text-indigo-600 dark:hover:text-white transition-colors">
                contact@smartlot.com
              </a>
            </div>
          </div>

          {/* Column 3: Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-bold text-slate-900 dark:text-slate-100">Quick Links</h4>
            <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <li><Link to="/" className="hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors">Home</Link></li>
              <li><Link to="/entry" className="hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors">Entry Terminal</Link></li>
              <li><Link to="/live-slots" className="hover:text-indigo-600 dark:hover:text-cyan-400 transition-colors">Live Status</Link></li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-900 text-center">
          <p className="text-xs text-slate-500">
            © 2026 HARITHA.N, POOJASREE.G, DHARSHITHA.K.S - DEPARTMENT OF CSE (CYBERSECURITY). All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;