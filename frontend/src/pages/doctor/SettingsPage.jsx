import { useState, useEffect } from "react";
import { 
  Bell, Lock, Shield, Eye, Smartphone, Mail, AlertCircle, 
  Check, Save, Loader2, Key
} from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import toast from "react-hot-toast";

const SettingsPage = () => {
  const { authUser, updateSettings, changePassword, isUpdatingSettings } = useAuthStore();
  
  // Settings State
  const [settings, setSettings] = useState({
    emailNotifications: authUser?.settings?.emailNotifications ?? true,
    smsNotifications: authUser?.settings?.smsNotifications ?? false,
    appointmentNotifications: authUser?.settings?.appointmentNotifications ?? true,
    patientUpdates: authUser?.settings?.patientUpdates ?? true,
    reportNotifications: authUser?.settings?.reportNotifications ?? true,
    emergencyAlerts: authUser?.settings?.emergencyAlerts ?? true,
    profileVisibility: authUser?.settings?.profileVisibility ?? true,
    publicListingVisibility: authUser?.settings?.publicListingVisibility ?? true,
  });

  // Password State
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Auto-save settings when toggled
  const handleToggle = async (key) => {
    const newValue = !settings[key];
    setSettings(prev => ({ ...prev, [key]: newValue }));
    await updateSettings({ [key]: newValue });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    
    setIsChangingPassword(true);
    const success = await changePassword(passwords.currentPassword, passwords.newPassword);
    if (success) {
      setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
    }
    setIsChangingPassword(false);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 pb-20">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Account Settings</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your security, notifications, and privacy preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Toggles */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Notification Preferences */}
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
              <Bell className="w-5 h-5 text-[#698bf4]" /> Notification Preferences
            </h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-700 flex items-center gap-2"><Mail className="w-4 h-4 text-slate-400"/> Email Notifications</p>
                  <p className="text-xs text-slate-500 mt-1">Receive daily summaries and important alerts via email.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={settings.emailNotifications} onChange={() => handleToggle("emailNotifications")} className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#698bf4]"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-700 flex items-center gap-2"><Smartphone className="w-4 h-4 text-slate-400"/> SMS Alerts</p>
                  <p className="text-xs text-slate-500 mt-1">Receive instant text messages for urgent updates.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={settings.smsNotifications} onChange={() => handleToggle("smsNotifications")} className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#698bf4]"></div>
                </label>
              </div>
              
              <div className="h-px w-full bg-slate-100"></div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-700">Appointment Bookings</p>
                  <p className="text-xs text-slate-500 mt-1">Notify me when a new appointment is booked or cancelled.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={settings.appointmentNotifications} onChange={() => handleToggle("appointmentNotifications")} className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#698bf4]"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-700">Patient Updates</p>
                  <p className="text-xs text-slate-500 mt-1">Alerts regarding assigned patient status changes.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={settings.patientUpdates} onChange={() => handleToggle("patientUpdates")} className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#698bf4]"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-100">
                <div>
                  <p className="font-bold text-red-800 flex items-center gap-2"><AlertCircle className="w-4 h-4" /> Emergency Alerts</p>
                  <p className="text-xs text-red-600/80 mt-1">Bypass 'Do Not Disturb' for critical hospital codes.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={settings.emergencyAlerts} onChange={() => handleToggle("emergencyAlerts")} className="sr-only peer" />
                  <div className="w-11 h-6 bg-red-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Privacy Settings */}
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
              <Eye className="w-5 h-5 text-[#698bf4]" /> Privacy & Visibility
            </h3>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-700">Internal Profile Visibility</p>
                  <p className="text-xs text-slate-500 mt-1">Allow other doctors and nurses to view your full profile.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={settings.profileVisibility} onChange={() => handleToggle("profileVisibility")} className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#698bf4]"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-700">Public Directory Listing</p>
                  <p className="text-xs text-slate-500 mt-1">Show your profile to patients searching for specialists.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={settings.publicListingVisibility} onChange={() => handleToggle("publicListingVisibility")} className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#698bf4]"></div>
                </label>
              </div>
            </div>
          </div>
          
        </div>

        {/* Right Column: Security */}
        <div className="space-y-8">
          
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
              <Shield className="w-5 h-5 text-[#698bf4]" /> Security
            </h3>
            
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Current Password</label>
                <div className="relative">
                  <Key className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <input required type="password" value={passwords.currentPassword} onChange={e => setPasswords({...passwords, currentPassword: e.target.value})} className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#698bf4] outline-none" />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">New Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <input required minLength={6} type="password" value={passwords.newPassword} onChange={e => setPasswords({...passwords, newPassword: e.target.value})} className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#698bf4] outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Confirm New Password</label>
                <div className="relative">
                  <Check className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <input required minLength={6} type="password" value={passwords.confirmPassword} onChange={e => setPasswords({...passwords, confirmPassword: e.target.value})} className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#698bf4] outline-none" />
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
                  <p className="text-[10px] text-slate-500">Windows • Chrome • Active now</p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default SettingsPage;
