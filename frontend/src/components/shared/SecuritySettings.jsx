import { Lock, Shield, Check, Key, Loader2, Smartphone } from "lucide-react";

const SecuritySettings = ({ passwords, setPasswords, handlePasswordSubmit, isChangingPassword }) => {
  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
      <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
        <Shield className="w-5 h-5 text-[#698bf4]" /> Security
      </h3>
      
      <form onSubmit={handlePasswordSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Current Password</label>
          <div className="relative">
            <Key className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input 
              required 
              type="password" 
              value={passwords.currentPassword} 
              onChange={e => setPasswords({...passwords, currentPassword: e.target.value})} 
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#698bf4] outline-none" 
            />
          </div>
        </div>
        
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">New Password</label>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input 
              required 
              minLength={6} 
              type="password" 
              value={passwords.newPassword} 
              onChange={e => setPasswords({...passwords, newPassword: e.target.value})} 
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#698bf4] outline-none" 
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Confirm New Password</label>
          <div className="relative">
            <Check className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input 
              required 
              minLength={6} 
              type="password" 
              value={passwords.confirmPassword} 
              onChange={e => setPasswords({...passwords, confirmPassword: e.target.value})} 
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#698bf4] outline-none" 
            />
          </div>
        </div>

        <button disabled={isChangingPassword} type="submit" className="w-full py-2.5 bg-slate-800 text-white rounded-xl text-sm font-medium hover:bg-slate-700 transition-colors flex items-center justify-center gap-2 mt-2">
          {isChangingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : "Update Password"}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-slate-100">
        <h4 className="font-bold text-slate-800 mb-2">Active Sessions</h4>
        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
          <div className="w-8 h-8 bg-green-100 text-green-600 rounded flex items-center justify-center">
            <Smartphone className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-slate-700">Current Device</p>
            <p className="text-[10px] text-slate-500">Active now</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;
