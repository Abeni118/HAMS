import { useRef } from "react";
import { Camera } from "lucide-react";

const AvatarUpload = ({ profilePic, onUpload, tagLabel }) => {
  const fileInputRef = useRef(null);

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative group">
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-slate-50 shadow-md">
          <img 
            src={profilePic || "/avatar.png"} 
            alt="Profile" 
            className="w-full h-full object-cover"
          />
        </div>
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-sm"
        >
          <Camera className="w-6 h-6 text-white mb-1" />
          <span className="text-[10px] text-white font-medium uppercase tracking-wider">Change</span>
        </div>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={onUpload} 
          accept="image/png, image/jpeg, image/webp" 
          className="hidden" 
        />
      </div>
      {tagLabel && (
        <div className="text-center">
          <span className="px-3 py-1 bg-indigo-50 text-[#698bf4] rounded-full text-xs font-bold uppercase tracking-wider border border-indigo-100">
            {tagLabel}
          </span>
        </div>
      )}
    </div>
  );
};

export default AvatarUpload;
