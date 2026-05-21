import { HeartPulse } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-2">
          <HeartPulse className="w-5 h-5 text-[#698bf4]" />
          <span className="font-bold text-white tracking-wider">HAMS</span>
        </div>
        <div className="text-sm text-center md:text-left">
          &copy; {new Date().getFullYear()} Arba Minch General Hospital System. All rights reserved.
        </div>
        <div className="flex flex-wrap justify-center gap-6 text-sm font-medium">
          <Link to="/" className="hover:text-white transition-colors">About Hospital</Link>
          <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
          <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          <a href="/#contact" className="hover:text-white transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
