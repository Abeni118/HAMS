import { useState, useRef, useEffect } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { User, Mail, Phone, MapPin, Calendar, Activity, Edit2, Camera, ShieldCheck, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const { authUser, updateProfile, isUpdatingProfile, uploadAvatar, isUploadingAvatar } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    fullName: authUser?.fullName || "",
    email: authUser?.email || "",
    dateOfBirth: authUser?.dateOfBirth || "",
    gender: authUser?.gender || "Prefer not to say",
    phoneNumber: authUser?.phoneNumber || "",
    address: authUser?.address || "",
    emergencyContactName: authUser?.emergencyContactName || "",
    emergencyPhone: authUser?.emergencyPhone || "",
  });

  useEffect(() => {
    if (authUser && !isEditing) {
      setFormData({
        fullName: authUser.fullName || "",
        email: authUser.email || "",
        dateOfBirth: authUser.dateOfBirth || "",
        gender: authUser.gender || "Prefer not to say",
        phoneNumber: authUser.phoneNumber || "",
        address: authUser.address || "",
        emergencyContactName: authUser.emergencyContactName || "",
        emergencyPhone: authUser.emergencyPhone || "",
      });
    }
  }, [authUser, isEditing]);

  const handleSave = async () => {
    try {
      await updateProfile(formData);
      setIsEditing(false);
    } catch (error) {
      console.log("Failed to update profile", error);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB");
      return;
    }

    await uploadAvatar(file);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 pb-16">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">My Profile</h1>
          <p className="text-sm text-slate-500 mt-1">Manage your personal and medical information</p>
        </div>
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
            isEditing 
              ? "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200" 
              : "bg-[#698bf4] text-white hover:bg-[#5a7dec] shadow-sm shadow-[#698bf4]/20"
          }`}
        >
          {isEditing ? (
            <>Cancel Edit</>
          ) : (
            <><Edit2 className="w-4 h-4" /> Edit Profile</>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column - Avatar & Quick Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col items-center text-center">
            <div className="relative mb-4 group">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-slate-100 border-4 border-white shadow-md">
                {authUser?.profilePic ? (
                  <img src={`${authUser.profilePic}?t=${Date.now()}`} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#e0e7ff] text-[#698bf4]">
                    <User className="w-12 h-12" />
                  </div>
                )}
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/png, image/jpeg, image/webp"
                className="hidden"
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingAvatar}
                className="absolute bottom-0 right-0 bg-[#698bf4] text-white p-2 rounded-full shadow-lg hover:bg-[#5a7dec] transition-colors border-2 border-white disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isUploadingAvatar ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
              </button>
            </div>
            <h2 className="text-xl font-bold text-slate-800">{authUser?.fullName}</h2>
            <p className="text-sm text-[#698bf4] font-medium capitalize mb-4">{authUser?.role}</p>
            
            <div className="w-full border-t border-slate-100 pt-4 flex flex-col gap-3 text-sm text-left">
              <div className="flex items-center gap-3 text-slate-600">
                <Mail className="w-4 h-4 text-slate-400" />
                <span className="truncate">{authUser?.email}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <Phone className="w-4 h-4 text-slate-400" />
                <span>{authUser?.phoneNumber || "No phone added"}</span>
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <MapPin className="w-4 h-4 text-slate-400" />
                <span>{authUser?.address || "No address added"}</span>
              </div>
            </div>
          </div>

          <div className="bg-[#f0fdf4] rounded-2xl border border-[#bbf7d0] p-6 flex items-start gap-4 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-green-800 text-sm">Account Verified</h3>
              <p className="text-xs text-green-600 mt-1 leading-relaxed">Your identity has been verified by the hospital administration.</p>
            </div>
          </div>
        </div>

        {/* Right Column - Form Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-800">Personal Information</h2>
              <p className="text-sm text-slate-500">Update your personal details here.</p>
            </div>
            <div className="p-6 space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Full Name</label>
                  <input 
                    type="text" 
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#698bf4] focus:bg-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
                  <input 
                    type="email" 
                    value={formData.email}
                    disabled={true} // Email should usually not be easily edited
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#698bf4] focus:bg-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Date of Birth</label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <input 
                      type="date" 
                      value={formData.dateOfBirth}
                      onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      disabled={!isEditing}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#698bf4] focus:bg-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Gender</label>
                  <select 
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#698bf4] focus:bg-white transition-all disabled:opacity-60 disabled:cursor-not-allowed appearance-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
              </div>

            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex items-center gap-3">
              <Activity className="w-5 h-5 text-[#698bf4]" />
              <div>
                <h2 className="text-lg font-bold text-slate-800">Medical Notes</h2>
                <p className="text-sm text-slate-500">Important health information for your doctors.</p>
              </div>
            </div>
            <div className="p-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Allergies</label>
                <div className="flex flex-wrap gap-2 mb-6">
                  {authUser?.allergies?.length > 0 ? (
                    authUser.allergies.map((allergy, i) => (
                      <span key={i} className="px-3 py-1 bg-red-50 text-red-600 border border-red-200 rounded-lg text-sm font-medium">
                        {allergy}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-slate-400 italic">No allergies recorded</span>
                  )}
                  {isEditing && (
                    <button className="px-3 py-1 border border-dashed border-slate-300 text-slate-400 rounded-lg text-sm font-medium hover:bg-slate-50 hover:text-slate-600 transition-colors">
                      + Add
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Emergency Contact</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    placeholder="Contact Name"
                    value={formData.emergencyContactName}
                    onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#698bf4] focus:bg-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                  <input 
                    type="tel" 
                    placeholder="Phone Number"
                    value={formData.emergencyPhone}
                    onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#698bf4] focus:bg-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="flex justify-end gap-4 mt-6">
              <button 
                onClick={() => setIsEditing(false)}
                disabled={isUpdatingProfile}
                className="px-6 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors disabled:opacity-70"
              >
                Discard
              </button>
              <button 
                onClick={handleSave}
                disabled={isUpdatingProfile}
                className="inline-flex justify-center items-center gap-2 px-6 py-2.5 bg-[#698bf4] text-white rounded-xl text-sm font-medium hover:bg-[#5a7dec] shadow-sm shadow-[#698bf4]/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isUpdatingProfile ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
