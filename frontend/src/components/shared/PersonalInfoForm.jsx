import { User, Mail, Phone, MapPin, Calendar } from "lucide-react";

const PersonalInfoForm = ({ formData, handleChange }) => {
  return (
    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
          <User className="w-4 h-4"/> Full Name
        </label>
        <input 
          type="text" 
          name="fullName" 
          value={formData.fullName} 
          onChange={handleChange} 
          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#698bf4] outline-none" 
        />
      </div>
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
          <Mail className="w-4 h-4"/> Email (Read Only)
        </label>
        <input 
          type="email" 
          value={formData.email} 
          disabled 
          className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-500 cursor-not-allowed" 
        />
      </div>
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
          <Phone className="w-4 h-4"/> Phone Number
        </label>
        <input 
          type="tel" 
          name="phoneNumber" 
          value={formData.phoneNumber} 
          onChange={handleChange} 
          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#698bf4] outline-none" 
        />
      </div>
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
          <Calendar className="w-4 h-4"/> Date of Birth
        </label>
        <input 
          type="date" 
          name="dateOfBirth" 
          value={formData.dateOfBirth} 
          onChange={handleChange} 
          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#698bf4] outline-none" 
        />
      </div>
      <div>
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
          <User className="w-4 h-4"/> Gender
        </label>
        <select 
          name="gender" 
          value={formData.gender} 
          onChange={handleChange} 
          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#698bf4] outline-none"
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
          <option value="Prefer not to say">Prefer not to say</option>
        </select>
      </div>
      <div className="md:col-span-2">
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
          <MapPin className="w-4 h-4"/> Home Address
        </label>
        <input 
          type="text" 
          name="address" 
          value={formData.address} 
          onChange={handleChange} 
          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#698bf4] outline-none" 
        />
      </div>
    </div>
  );
};

export default PersonalInfoForm;
