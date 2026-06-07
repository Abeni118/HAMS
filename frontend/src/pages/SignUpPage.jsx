import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Loader2, Hospital, User, Activity, Building, LogIn } from "lucide-react";
import Input from "../components/Input";
import AuthImagePattern from "../components/AuthImagePattern";
import toast from "react-hot-toast";

const SignUpPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeRole, setActiveRole] = useState("patient");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    medicalLicenseNumber: "",
    specialization: "",
    department: "",
    yearsOfExperience: "",
    licenseNumber: "",
    shiftPreference: "Day",
  });

  const { signup, isSigningUp } = useAuthStore();

  const validateForm = () => {
    if (!formData.fullName.trim()) return toast.error("Full name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6) return toast.error("Password must be at least 6 characters");
    if (formData.password !== formData.confirmPassword) return toast.error("Passwords do not match");

    if (activeRole === "doctor") {
      if (!formData.medicalLicenseNumber.trim()) return toast.error("Medical license number is required");
      if (!formData.specialization.trim()) return toast.error("Specialization is required");
      if (!formData.department) return toast.error("Department is required");
      if (!formData.yearsOfExperience) return toast.error("Years of experience is required");
    }

    if (activeRole === "nurse") {
      if (!formData.licenseNumber.trim()) return toast.error("License number is required");
      if (!formData.department) return toast.error("Department/Ward selection is required");
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validateForm();
    if (isValid === true) {
      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: activeRole,
      };

      if (activeRole === "doctor") {
        payload.medicalLicenseNumber = formData.medicalLicenseNumber;
        payload.specialization = formData.specialization;
        payload.department = formData.department;
        payload.yearsOfExperience = Number(formData.yearsOfExperience) || 0;
      } else if (activeRole === "nurse") {
        payload.licenseNumber = formData.licenseNumber;
        payload.department = formData.department;
        payload.shiftPreference = formData.shiftPreference;
      }

      const res = await signup(payload);
      if (res && res.requiresApproval) {
        setFormData({
          fullName: "",
          email: "",
          password: "",
          confirmPassword: "",
          medicalLicenseNumber: "",
          specialization: "",
          department: "",
          yearsOfExperience: "",
          licenseNumber: "",
          shiftPreference: "Day",
        });
        navigate("/login");
      }
    }
  };

  const roles = [
    { id: "patient", label: "PATIENT", icon: User },
    { id: "doctor", label: "DOCTOR", icon: Hospital },
    { id: "nurse", label: "NURSE", icon: Activity },
  ];

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-[#f8fafc]">
      
      {/* Left side - 3x3 Grid Pattern */}
      <AuthImagePattern />

      {/* Right side - Form */}
      <div className="flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-y-auto">
        
        {/* Header Section */}
        <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10 mb-8 mt-10">
          <h2 className="text-center text-3xl font-extrabold text-slate-800 tracking-tight">
            Create Account
          </h2>
          <p className="mt-2 text-center text-sm text-slate-500">
            Join the Hospital Appointment Management System
          </p>
        </div>

        {/* Card Section */}
        <div className="sm:mx-auto sm:w-full sm:max-w-md z-10 mb-16">
          <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-2xl sm:px-10 border border-slate-100">
            
            {/* Role Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-slate-700 mb-3">Select Your Role</label>
              <div className="grid grid-cols-4 gap-2 border border-slate-200 p-1 rounded-xl bg-slate-50">
                {roles.map((role) => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => setActiveRole(role.id)}
                    className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-all ${
                      activeRole === role.id
                        ? "bg-[#698bf4] text-white shadow-sm"
                        : "text-slate-500 hover:bg-slate-200/50"
                    }`}
                  >
                    <role.icon className={`w-5 h-5 mb-1 ${activeRole === role.id ? "text-white" : "text-slate-400"}`} />
                    <span className="text-[9px] font-bold tracking-wider">{role.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Form */}
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <Input
                  icon={User}
                  type="text"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                <Input
                  icon={Mail}
                  type="email"
                  placeholder="e.g. name@hospital.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <Input
                    icon={Lock}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center mb-6"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 text-slate-400 hover:text-[#698bf4] transition-colors" />
                    ) : (
                      <Eye className="w-5 h-5 text-slate-400 hover:text-[#698bf4] transition-colors" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
                <div className="relative">
                  <Input
                    icon={Lock}
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center mb-6"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5 text-slate-400 hover:text-[#698bf4] transition-colors" />
                    ) : (
                      <Eye className="w-5 h-5 text-slate-400 hover:text-[#698bf4] transition-colors" />
                    )}
                  </button>
                </div>
              </div>

              {activeRole === "doctor" && (
                <div className="space-y-4 border-l-2 border-[#698bf4] pl-3 py-1 my-3 bg-slate-50/50 p-3 rounded-r-xl">
                  <p className="text-xs font-bold text-[#698bf4] uppercase tracking-wider mb-2">Doctor Professional Credentials</p>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Medical License Number</label>
                    <Input
                      icon={Building}
                      type="text"
                      placeholder="e.g. MD-12345-US"
                      value={formData.medicalLicenseNumber}
                      onChange={(e) => setFormData({ ...formData, medicalLicenseNumber: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Specialization</label>
                    <Input
                      icon={Activity}
                      type="text"
                      placeholder="e.g. Cardiology, Pediatrics"
                      value={formData.specialization}
                      onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Department</label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#698bf4] outline-none bg-white font-medium"
                      required
                    >
                      <option value="">Select Department</option>
                      <option value="Cardiology">Cardiology</option>
                      <option value="Neurology">Neurology</option>
                      <option value="Pediatrics">Pediatrics</option>
                      <option value="Orthopedics">Orthopedics</option>
                      <option value="General Medicine">General Medicine</option>
                      <option value="Emergency">Emergency</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Years of Experience</label>
                    <Input
                      icon={User}
                      type="number"
                      placeholder="e.g. 5"
                      value={formData.yearsOfExperience}
                      onChange={(e) => setFormData({ ...formData, yearsOfExperience: e.target.value })}
                      required
                      min="0"
                    />
                  </div>
                </div>
              )}

              {activeRole === "nurse" && (
                <div className="space-y-4 border-l-2 border-purple-500 pl-3 py-1 my-3 bg-slate-50/50 p-3 rounded-r-xl">
                  <p className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-2">Nurse Professional Credentials</p>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">License Number</label>
                    <Input
                      icon={Building}
                      type="text"
                      placeholder="e.g. RN-98765-US"
                      value={formData.licenseNumber}
                      onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Department / Ward</label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#698bf4] outline-none bg-white font-medium"
                      required
                    >
                      <option value="">Select Department/Ward</option>
                      <option value="Cardiology">Cardiology</option>
                      <option value="Neurology">Neurology</option>
                      <option value="Pediatrics">Pediatrics</option>
                      <option value="Orthopedics">Orthopedics</option>
                      <option value="General Medicine">General Medicine</option>
                      <option value="Emergency">Emergency</option>
                      <option value="ICU">ICU</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Shift Preference</label>
                    <select
                      value={formData.shiftPreference}
                      onChange={(e) => setFormData({ ...formData, shiftPreference: e.target.value })}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#698bf4] outline-none bg-white font-medium"
                      required
                    >
                      <option value="Day">Day Shift</option>
                      <option value="Night">Night Shift</option>
                      <option value="Evening">Evening Shift</option>
                      <option value="Rotating">Rotating Shift</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSigningUp}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-[#698bf4] hover:bg-[#5a7dec] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#698bf4] transition-all"
                >
                  {isSigningUp ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create Account"}
                </button>
              </div>
            </form>

            {/* Separator */}
            <div className="mt-8 relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-400 text-xs font-bold tracking-widest uppercase">
                  ALREADY HAVE AN ACCOUNT?
                </span>
              </div>
            </div>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <Link 
                to="/login" 
                className="inline-flex items-center text-sm font-bold text-[#698bf4] hover:text-[#5a7dec] transition-colors"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Sign in to Dashboard
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-4 left-0 w-full px-8 flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-400 font-medium z-10">
          <p>© 2024 Hospital Appointment Management System. All rights reserved.</p>
          <div className="flex gap-4 mt-2 sm:mt-0">
            <span>Version 1.0.2</span>
            <span>Last sync: 2 mins ago</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SignUpPage;
