import { SearchX, Home } from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-slate-200 text-slate-500 rounded-full flex items-center justify-center mb-8">
          <SearchX className="w-12 h-12" />
        </div>
        <h1 className="text-6xl font-extrabold text-slate-900 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Page Not Found</h2>
        <p className="text-lg text-slate-600 max-w-md mb-8">
          The healthcare portal or page you are looking for does not exist or has been moved.
        </p>
        <Link 
          to="/" 
          className="px-6 py-3 bg-[#698bf4] text-white rounded-xl font-bold flex items-center gap-2 hover:bg-[#5a7dec] transition-colors"
        >
          <Home className="w-5 h-5" /> Return to Homepage
        </Link>
      </div>
      <Footer />
    </div>
  );
};

export default NotFoundPage;
