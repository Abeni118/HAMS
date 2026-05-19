import { useState } from "react";
import { Bell, Lock, Globe, ShieldAlert, Loader2, X, AlertTriangle } from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import toast from "react-hot-toast";

const SettingsPage = () => {
  const { 
    authUser, 
    updateSettings, 
    changePassword, 
    deleteAccount,
    isChangingPassword,
    isDeletingAccount
  } = useAuthStore();

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: ""
  });

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");

  const handleToggle = (settingKey) => {
    const currentValue = authUser?.settings?.[settingKey] ?? (settingKey === "emailNotifications" ? true : false);
    updateSettings({ [settingKey]: !currentValue });
  };

  const handleLanguageChange = (e) => {
    updateSettings({ language: e.target.value });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!passwords.currentPassword || !passwords.newPassword) {
      toast.error("Please fill in all password fields");
      return;
    }
    const success = await changePassword(passwords);
    if (success) {
      setPasswords({ currentPassword: "", newPassword: "" });
    }
  };

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    if (!deletePassword) {
      toast.error("Please enter your password to confirm");
      return;
    }
    try {
      await deleteAccount(deletePassword);
    } catch (error) {
      // Handled by store
    }
  };
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your account preferences and security</p>
        </div>
      </div>

      <div className="space-y-6">
        
        {/* Security Section */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Password & Security</h2>
              <p className="text-sm text-slate-500">Update your password and secure your account</p>
            </div>
          </div>
          <div className="p-6">
            <form onSubmit={handlePasswordSubmit} className="max-w-md space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Current Password</label>
                <input 
                  type="password" 
                  value={passwords.currentPassword}
                  onChange={(e) => setPasswords({...passwords, currentPassword: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#698bf4]"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">New Password</label>
                <input 
                  type="password" 
                  value={passwords.newPassword}
                  onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#698bf4]"
                  placeholder="••••••••"
                />
              </div>
              <div className="pt-2">
                <button 
                  type="submit" 
                  disabled={isChangingPassword}
                  className="px-5 py-2 bg-slate-800 text-white rounded-xl text-sm font-medium hover:bg-slate-700 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {isChangingPassword ? <Loader2 className="w-4 h-4 animate-spin" /> : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Preferences Section */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Notifications & Preferences</h2>
              <p className="text-sm text-slate-500">Choose how we communicate with you</p>
            </div>
          </div>
          <div className="p-6 divide-y divide-slate-100">
            
            <div className="py-4 flex items-center justify-between first:pt-0">
              <div>
                <p className="font-semibold text-slate-800 text-sm">Email Notifications</p>
                <p className="text-xs text-slate-500 mt-1">Receive appointment reminders and health reports via email</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={authUser?.settings?.emailNotifications ?? true} 
                  onChange={() => handleToggle('emailNotifications')}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#698bf4]"></div>
              </label>
            </div>

            <div className="py-4 flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-800 text-sm">SMS Alerts</p>
                <p className="text-xs text-slate-500 mt-1">Receive text messages for urgent updates</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={authUser?.settings?.smsNotifications ?? false}
                  onChange={() => handleToggle('smsNotifications')}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#698bf4]"></div>
              </label>
            </div>

            <div className="py-4 flex items-center justify-between pb-0">
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-slate-400" />
                <div>
                  <p className="font-semibold text-slate-800 text-sm">Language</p>
                  <p className="text-xs text-slate-500 mt-1">Select your preferred language</p>
                </div>
              </div>
              <select 
                value={authUser?.settings?.language || "English (US)"}
                onChange={handleLanguageChange}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#698bf4]"
              >
                <option value="English (US)">English (US)</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
              </select>
            </div>

          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-red-50 rounded-2xl border border-red-100 overflow-hidden mt-8">
          <div className="p-6 flex items-start sm:items-center justify-between flex-col sm:flex-row gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600 shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-red-800">Danger Zone</h2>
                <p className="text-sm text-red-600 mt-1">Permanently delete your account and all associated health data. This action cannot be undone.</p>
              </div>
            </div>
            <button 
              onClick={() => setIsDeleteModalOpen(true)}
              className="px-5 py-2 bg-white border border-red-200 text-red-600 rounded-xl text-sm font-bold hover:bg-red-600 hover:text-white transition-colors whitespace-nowrap shadow-sm"
            >
              Delete Account
            </button>
          </div>
        </div>

      </div>

      {/* Delete Account Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-bold text-slate-800 mb-2">Delete Account</h2>
              <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                You are about to permanently delete your account. All your medical data, appointments, and reports will be wiped. Please enter your password to confirm.
              </p>
              <form onSubmit={handleDeleteAccount} className="space-y-4">
                <input 
                  type="password" 
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400 text-center"
                />
                <div className="flex gap-3 pt-2">
                  <button 
                    type="button"
                    onClick={() => {
                      setIsDeleteModalOpen(false);
                      setDeletePassword("");
                    }}
                    className="flex-1 px-4 py-2.5 text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl text-sm font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={isDeletingAccount}
                    className="flex-1 px-4 py-2.5 text-white bg-red-600 hover:bg-red-700 rounded-xl text-sm font-medium transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                  >
                    {isDeletingAccount ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete Forever"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default SettingsPage;
