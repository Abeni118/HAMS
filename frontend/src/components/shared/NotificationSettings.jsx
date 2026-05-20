import { Bell, Mail, Smartphone, AlertCircle } from "lucide-react";

const NotificationSettings = ({ settings, handleToggle }) => {
  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
      <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
        <Bell className="w-5 h-5 text-[#698bf4]" /> Notification Preferences
      </h3>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold text-slate-700 flex items-center gap-2">
              <Mail className="w-4 h-4 text-slate-400"/> Email Notifications
            </p>
            <p className="text-xs text-slate-500 mt-1">Receive daily summaries and important alerts via email.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={settings.emailNotifications} onChange={() => handleToggle("emailNotifications")} className="sr-only peer" />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#698bf4]"></div>
          </label>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold text-slate-700 flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-slate-400"/> SMS Alerts
            </p>
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
  );
};

export default NotificationSettings;
