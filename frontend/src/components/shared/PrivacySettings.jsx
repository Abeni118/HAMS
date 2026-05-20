import { Eye } from "lucide-react";

const PrivacySettings = ({ settings, handleToggle }) => {
  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
      <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
        <Eye className="w-5 h-5 text-[#698bf4]" /> Privacy & Visibility
      </h3>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold text-slate-700">Internal Profile Visibility</p>
            <p className="text-xs text-slate-500 mt-1">Allow other staff members to view your full profile.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={settings.profileVisibility} onChange={() => handleToggle("profileVisibility")} className="sr-only peer" />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#698bf4]"></div>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold text-slate-700">Public Directory Listing</p>
            <p className="text-xs text-slate-500 mt-1">Show your profile to patients searching in the directory.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={settings.publicListingVisibility} onChange={() => handleToggle("publicListingVisibility")} className="sr-only peer" />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#698bf4]"></div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default PrivacySettings;
