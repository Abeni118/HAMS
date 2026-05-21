import { useState } from "react";
import { Building, Mail, Phone, Globe, Save } from "lucide-react";
import toast from "react-hot-toast";

const AdminSettings = () => {
  const [settings, setSettings] = useState({
    hospitalName: "Arba Minch General Hospital",
    contactEmail: "admin@hams.gov.et",
    contactPhone: "+1 234 567 8900",
    website: "www.hams.gov.et",
    maintenanceMode: false,
    publicRegistration: true
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
      toast.success("Hospital settings updated successfully");
    }, 500);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 pb-16">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Hospital Settings</h1>
        <p className="text-sm text-slate-500 mt-1">Configure global platform preferences and contact details.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 md:p-8">
          <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
            <Building className="w-5 h-5 text-[#698bf4]" /> Global Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Hospital Name</label>
              <input type="text" name="hospitalName" value={settings.hospitalName} onChange={handleChange} className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#698bf4] outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2"><Mail className="w-4 h-4"/> Contact Email</label>
              <input type="email" name="contactEmail" value={settings.contactEmail} onChange={handleChange} className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#698bf4] outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2"><Phone className="w-4 h-4"/> Contact Phone</label>
              <input type="text" name="contactPhone" value={settings.contactPhone} onChange={handleChange} className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#698bf4] outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2"><Globe className="w-4 h-4"/> Website URL</label>
              <input type="text" name="website" value={settings.website} onChange={handleChange} className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#698bf4] outline-none" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 md:p-8">
          <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
            System Preferences
          </h2>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-700">Public Patient Registration</p>
                <p className="text-xs text-slate-500 mt-1">Allow new patients to register themselves via the signup page.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" name="publicRegistration" checked={settings.publicRegistration} onChange={handleChange} className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#698bf4]"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <div>
                <p className="font-bold text-amber-800">Maintenance Mode</p>
                <p className="text-xs text-amber-700 mt-1">Block non-admin logins and display a maintenance page.</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" name="maintenanceMode" checked={settings.maintenanceMode} onChange={handleChange} className="sr-only peer" />
                <div className="w-11 h-6 bg-amber-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" className="flex items-center gap-2 px-6 py-3 bg-[#698bf4] text-white rounded-xl text-sm font-medium hover:bg-[#5a7dec] transition-colors shadow-sm">
            <Save className="w-4 h-4" /> Save Settings
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;
