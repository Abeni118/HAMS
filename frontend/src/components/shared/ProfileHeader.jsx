import { Save, Loader2 } from "lucide-react";

const ProfileHeader = ({ title, subtitle, onSubmit, isUpdating }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">{title}</h1>
        <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
      </div>
      <button 
        onClick={onSubmit}
        disabled={isUpdating}
        className="px-5 py-2.5 bg-[#698bf4] text-white rounded-xl text-sm font-medium hover:bg-[#5a7dec] transition-colors flex items-center gap-2 shadow-sm disabled:opacity-70"
      >
        {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        Save Changes
      </button>
    </div>
  );
};

export default ProfileHeader;
