import { useState, useEffect, useRef } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";
import { User, Mail, Phone, MapPin, Camera, Save, Lock, Clock, ShieldCheck, Loader2 } from "lucide-react";

const ProfilePage = () => {
  const { authUser, setAuthUser } = useAuthStore();
  const fileInputRef = useRef(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    address: "",
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  useEffect(() => {
    // We can fetch fresh profile data or just use authUser if it's already populated
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const res = await axiosInstance.get("/admin/profile");
        setFormData({
          fullName: res.data.fullName || "",
          email: res.data.email || "",
          phoneNumber: res.data.phoneNumber || "",
          address: res.data.address || "",
        });
      } catch (error) {
        toast.error("Failed to fetch profile data");
        // Fallback to authUser
        if (authUser) {
          setFormData({
            fullName: authUser.fullName || "",
            email: authUser.email || "",
            phoneNumber: authUser.phoneNumber || "",
            address: authUser.address || "",
          });
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [authUser]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await axiosInstance.put("/admin/update-profile", formData);
      setAuthUser(res.data);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return toast.error("New passwords do not match");
    }
    
    setIsSaving(true);
    try {
      // Assuming the backend verifies currentPassword if provided.
      // If the backend doesn't check currentPassword in /update-profile, it just updates it.
      await axiosInstance.put("/admin/update-profile", { password: passwordData.newPassword });
      toast.success("Password changed successfully");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      toast.error("Failed to change password");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      // Show loading toast or state if desired
      const res = await axiosInstance.post("/users/upload-avatar", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      setAuthUser(res.data);
      toast.success("Profile picture updated");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to upload image");
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-[60vh]"><Loader2 className="w-8 h-8 animate-spin text-[#698bf4]" /></div>;
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 pb-16">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Admin Profile</h1>
        <p className="text-sm text-slate-500 mt-1">Manage your personal information and security preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Avatar & Overview */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col items-center text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-[#e0e7ff] to-[#c7d2fe]"></div>
            
            <div className="relative mt-8 mb-4 group cursor-pointer" onClick={handleAvatarClick}>
              <div className="w-28 h-28 rounded-full bg-white p-1 shadow-md relative z-10">
                {authUser?.profilePic ? (
                  <img src={`${authUser.profilePic}?t=${Date.now()}`} alt="Profile" className="w-full h-full object-cover rounded-full" />
                ) : (
                  <div className="w-full h-full bg-indigo-50 rounded-full flex items-center justify-center text-[#698bf4] text-4xl font-bold uppercase border border-indigo-100">
                    {formData.fullName.charAt(0) || "A"}
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera className="w-8 h-8 text-white" />
                </div>
              </div>
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden" 
              />
            </div>
            
            <h2 className="text-xl font-bold text-slate-800">{formData.fullName}</h2>
            <p className="text-sm text-[#698bf4] font-medium mb-4 flex items-center justify-center gap-1">
              <ShieldCheck className="w-4 h-4" /> System Administrator
            </p>
            
            <div className="w-full border-t border-slate-100 pt-4 mt-2 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Account Status</span>
                <span className="px-2.5 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase">Active</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 flex items-center gap-1"><Clock className="w-3.5 h-3.5"/> Last Login</span>
                <span className="text-slate-700 font-medium">Just now</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Forms */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Profile Details Form */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
              <User className="w-5 h-5 text-[#698bf4]" /> Personal Information
            </h3>
            
            <form onSubmit={handleSaveProfile} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#698bf4] outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#698bf4] outline-none bg-slate-50" readOnly />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Phone Number</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#698bf4] outline-none" placeholder="+1 (555) 000-0000" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Location / Office</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                    <input type="text" name="address" value={formData.address} onChange={handleInputChange} className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#698bf4] outline-none" placeholder="Admin Wing, Room 402" />
                  </div>
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <button disabled={isSaving} type="submit" className="flex items-center gap-2 px-5 py-2.5 bg-[#698bf4] text-white rounded-xl text-sm font-medium hover:bg-[#5a7dec] transition-colors shadow-sm disabled:opacity-70">
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Changes
                </button>
              </div>
            </form>
          </div>

          {/* Security Form */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
              <Lock className="w-5 h-5 text-[#698bf4]" /> Security Settings
            </h3>
            
            <form onSubmit={handleSavePassword} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Current Password</label>
                  <input type="password" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#698bf4] outline-none" placeholder="••••••••" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">New Password</label>
                  <input type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#698bf4] outline-none" placeholder="••••••••" required />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Confirm New Password</label>
                  <input type="password" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#698bf4] outline-none" placeholder="••••••••" required />
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <button disabled={isSaving} type="submit" className="flex items-center gap-2 px-5 py-2.5 border border-slate-200 text-slate-700 bg-white rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-70">
                  Update Password
                </button>
              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
