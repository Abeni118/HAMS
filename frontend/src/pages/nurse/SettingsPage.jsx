import { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import toast from "react-hot-toast";

import NotificationSettings from "../../components/shared/NotificationSettings";
import PrivacySettings from "../../components/shared/PrivacySettings";
import SecuritySettings from "../../components/shared/SecuritySettings";

const SettingsPage = () => {
  const { authUser, updateSettings, changePassword } = useAuthStore();
  
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
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Account Settings</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your security, notifications, and privacy preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <NotificationSettings settings={settings} handleToggle={handleToggle} />
          <PrivacySettings settings={settings} handleToggle={handleToggle} />
        </div>

        <div className="space-y-8">
          <SecuritySettings 
            passwords={passwords} 
            setPasswords={setPasswords} 
            handlePasswordSubmit={handlePasswordSubmit} 
            isChangingPassword={isChangingPassword} 
          />
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
