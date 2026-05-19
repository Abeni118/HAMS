import { useState, useRef } from "react";
import { 
  User, Mail, Phone, MapPin, Calendar, Camera,
  Briefcase, Award, FileText, Clock, AlertCircle, Save, Loader2, BookOpen
} from "lucide-react";
import { useAuthStore } from "../../store/useAuthStore";
import toast from "react-hot-toast";

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const ProfilePage = () => {
  const { authUser, updateProfile, uploadAvatar, isUpdatingProfile } = useAuthStore();
  const fileInputRef = useRef(null);
  
  // State initialization matching the backend schema
  const [formData, setFormData] = useState({
    // Personal
    fullName: authUser?.fullName || "",
    email: authUser?.email || "",
    phoneNumber: authUser?.phoneNumber || "",
    gender: authUser?.gender || "",
    dateOfBirth: authUser?.dateOfBirth || "",
    address: authUser?.address || "",
    
    // Professional
    educationLevel: authUser?.educationLevel || "",
    degree: authUser?.degree || "",
    institution: authUser?.institution || "",
    graduationYear: authUser?.graduationYear || "",
    medicalLicenseNumber: authUser?.medicalLicenseNumber || "",
    yearsOfExperience: authUser?.yearsOfExperience || 0,
    specialization: authUser?.specialization || "",
    department: authUser?.department || "",
    biography: authUser?.biography || "",
    
    // Availability
    workingDays: authUser?.workingDays || [],
    consultationStart: authUser?.consultationStart || "",
    consultationEnd: authUser?.consultationEnd || "",
    consultationDuration: authUser?.consultationDuration || 30,
    emergencyAvailability: authUser?.emergencyAvailability || false,
  });

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    await uploadAvatar(file);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleWorkingDaysToggle = (day) => {
    setFormData(prev => {
      const days = [...prev.workingDays];
      if (days.includes(day)) {
        return { ...prev, workingDays: days.filter(d => d !== day) };
      } else {
        return { ...prev, workingDays: [...days, day] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateProfile(formData);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto pb-20">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Doctor Profile</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your professional identity and hospital availability.</p>
        </div>
        <button 
          onClick={handleSubmit}
          disabled={isUpdatingProfile}
          className="px-5 py-2.5 bg-[#698bf4] text-white rounded-xl text-sm font-medium hover:bg-[#5a7dec] transition-colors flex items-center gap-2 shadow-sm disabled:opacity-70"
        >
          {isUpdatingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </button>
      </div>

      <div className="space-y-6">
        {/* Profile Identity Section */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-slate-50 shadow-md">
                  <img 
                    src={authUser?.profilePic || "/avatar.png"} 
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
                  onChange={handleImageUpload} 
                  accept="image/png, image/jpeg, image/webp" 
                  className="hidden" 
                />
              </div>
              <div className="text-center">
                <span className="px-3 py-1 bg-indigo-50 text-[#698bf4] rounded-full text-xs font-bold uppercase tracking-wider border border-indigo-100">
                  {authUser?.department || 'Doctor'}
                </span>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2"><User className="w-4 h-4"/> Full Name</label>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#698bf4] outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2"><Mail className="w-4 h-4"/> Email (Read Only)</label>
                <input type="email" value={formData.email} disabled className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-500 cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2"><Phone className="w-4 h-4"/> Phone Number</label>
                <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#698bf4] outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2"><Calendar className="w-4 h-4"/> Date of Birth</label>
                <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#698bf4] outline-none" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2"><MapPin className="w-4 h-4"/> Home Address</label>
                <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#698bf4] outline-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Professional Qualifications */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
            <BookOpen className="w-5 h-5 text-[#698bf4]" /> Professional Qualifications
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Education Level</label>
              <select name="educationLevel" value={formData.educationLevel} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#698bf4] outline-none">
                <option value="">Select Level</option>
                <option value="MBBS">MBBS</option>
                <option value="MD">MD</option>
                <option value="MSc">MSc</option>
                <option value="PhD">PhD</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Degree Name</label>
              <input type="text" name="degree" placeholder="e.g. Doctor of Medicine" value={formData.degree} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#698bf4] outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Institution/University</label>
              <input type="text" name="institution" placeholder="University name" value={formData.institution} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#698bf4] outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Graduation Year</label>
              <input type="text" name="graduationYear" placeholder="YYYY" value={formData.graduationYear} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#698bf4] outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Biography / About</label>
              <textarea name="biography" rows="3" placeholder="Brief professional biography..." value={formData.biography} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#698bf4] outline-none"></textarea>
            </div>
          </div>
        </div>

        {/* Hospital Affiliation & Practice */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
            <Briefcase className="w-5 h-5 text-[#698bf4]" /> Clinical Practice Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Specialization</label>
              <input type="text" name="specialization" placeholder="e.g. Cardiology" value={formData.specialization} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#698bf4] outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Department</label>
              <select name="department" value={formData.department} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#698bf4] outline-none">
                <option value="">Select Department</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Neurology">Neurology</option>
                <option value="Orthopedics">Orthopedics</option>
                <option value="Pediatrics">Pediatrics</option>
                <option value="General Surgery">General Surgery</option>
                <option value="Internal Medicine">Internal Medicine</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Medical License Number</label>
              <input type="text" name="medicalLicenseNumber" placeholder="MD-XXXX-XXXX" value={formData.medicalLicenseNumber} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#698bf4] outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Years of Experience</label>
              <input type="number" name="yearsOfExperience" min="0" value={formData.yearsOfExperience} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#698bf4] outline-none" />
            </div>
          </div>
        </div>

        {/* Availability Preferences */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
            <Clock className="w-5 h-5 text-[#698bf4]" /> Availability & Scheduling
          </h3>
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Working Days</label>
              <div className="flex flex-wrap gap-3">
                {DAYS_OF_WEEK.map(day => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleWorkingDaysToggle(day)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                      formData.workingDays.includes(day)
                        ? "bg-indigo-50 border-[#698bf4] text-[#698bf4]"
                        : "bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300"
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Start Time</label>
                <input type="time" name="consultationStart" value={formData.consultationStart} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#698bf4] outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">End Time</label>
                <input type="time" name="consultationEnd" value={formData.consultationEnd} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#698bf4] outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Slot Duration (mins)</label>
                <select name="consultationDuration" value={formData.consultationDuration} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#698bf4] outline-none">
                  <option value="15">15 Minutes</option>
                  <option value="30">30 Minutes</option>
                  <option value="45">45 Minutes</option>
                  <option value="60">60 Minutes</option>
                </select>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                </div>
                <div>
                  <p className="text-sm font-bold text-red-800">Emergency Availability</p>
                  <p className="text-xs text-red-600/80 mt-0.5">Allow hospital admin to assign emergency cases outside scheduled hours.</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" name="emergencyAvailability" checked={formData.emergencyAvailability} onChange={handleChange} className="sr-only peer" />
                <div className="w-11 h-6 bg-red-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
              </label>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProfilePage;
