import { useState } from "react";
import { useAuthStore } from "../../store/useAuthStore";
import toast from "react-hot-toast";

import ProfileHeader from "../../components/shared/ProfileHeader";
import AvatarUpload from "../../components/shared/AvatarUpload";
import PersonalInfoForm from "../../components/shared/PersonalInfoForm";
import NurseProfessionalInfo from "./NurseProfessionalInfo";

const ProfilePage = () => {
  const { authUser, updateProfile, uploadAvatar, isUpdatingProfile } = useAuthStore();
  
  const [formData, setFormData] = useState({
    // Personal
    fullName: authUser?.fullName || "",
    email: authUser?.email || "",
    phoneNumber: authUser?.phoneNumber || "",
    gender: authUser?.gender || "",
    dateOfBirth: authUser?.dateOfBirth || "",
    address: authUser?.address || "",
    
    // Professional (Nurse Specific)
    nursingLevel: authUser?.nursingLevel || "",
    assignedWard: authUser?.assignedWard || "",
    shiftType: authUser?.shiftType || "",
    certifications: authUser?.certifications || [],
    yearsOfExperience: authUser?.yearsOfExperience || 0,
    biography: authUser?.biography || "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateProfile(formData);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto pb-20">
      <ProfileHeader 
        title="Nurse Profile" 
        subtitle="Manage your personal information, credentials, and hospital assignment." 
        onSubmit={handleSubmit} 
        isUpdating={isUpdatingProfile} 
      />

      <div className="space-y-6">
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <AvatarUpload 
              profilePic={authUser?.profilePic} 
              onUpload={handleImageUpload} 
              tagLabel={authUser?.nursingLevel || 'Nurse'} 
            />
            <PersonalInfoForm 
              formData={formData} 
              handleChange={handleChange} 
            />
          </div>
        </div>

        <NurseProfessionalInfo 
          formData={formData} 
          handleChange={handleChange} 
        />
      </div>
    </div>
  );
};

export default ProfilePage;
