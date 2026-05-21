import { AlertTriangle, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

const UnauthorizedPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-8">
          <AlertTriangle className="w-12 h-12" />
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Unauthorized Access</h1>
        <p className="text-lg text-slate-600 max-w-md mb-8">
          You do not have the required permissions to view this page. Ensure you are logged into the correct role account.
        </p>
        <button 
          onClick={() => navigate(-1)} 
          className="px-6 py-3 bg-[#698bf4] text-white rounded-xl font-bold flex items-center gap-2 hover:bg-[#5a7dec] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" /> Go Back
        </button>
      </div>
      <Footer />
    </div>
  );
};

export default UnauthorizedPage;
