import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Loader2, Hospital, User, ShieldCheck } from "lucide-react";
import AuthImagePattern from "../components/AuthImagePattern";
import Input from "../components/Input";
import toast from "react-hot-toast";

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "patient",
  });

  const { signup, isSigningUp } = useAuthStore();

  const validateForm = () => {
    if (!formData.fullName.trim()) return toast.error("Full name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6) return toast.error("Password must be at least 6 characters");
    if (formData.password !== formData.confirmPassword) return toast.error("Passwords do not match");

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = validateForm();
    if (isValid === true) {
      signup({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-slate-50">
      {/* Left side - Branding/Pattern */}
      <AuthImagePattern
        title="Join HAMS Today"
        subtitle="Create an account to streamline your hospital appointments and management."
      />

      {/* Right side - Form */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12 z-10 bg-white shadow-[-20px_0_30px_-15px_rgba(0,0,0,0.05)] overflow-y-auto">
        <div className="w-full max-w-md space-y-8 my-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                <Hospital className="w-8 h-8 text-indigo-600" />
              </div>
              <h1 className="text-2xl font-bold mt-2 text-slate-800">Create Account</h1>
              <p className="text-slate-500">Get started with your free account</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              icon={User}
              type="text"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            />

            <Input
              icon={Mail}
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />

            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <ShieldCheck className="w-5 h-5 text-indigo-400" />
              </div>
              <select
                className="w-full pl-10 pr-3 py-3 bg-white bg-opacity-50 text-slate-800 rounded-xl border border-indigo-100 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all duration-200 shadow-sm appearance-none"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
                <option value="nurse">Nurse</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="relative">
              <Input
                icon={Lock}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center mb-6"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5 text-slate-400 hover:text-indigo-500 transition-colors" />
                ) : (
                  <Eye className="w-5 h-5 text-slate-400 hover:text-indigo-500 transition-colors" />
                )}
              </button>
            </div>

            <div className="relative">
              <Input
                icon={Lock}
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center mb-6"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="w-5 h-5 text-slate-400 hover:text-indigo-500 transition-colors" />
                ) : (
                  <Eye className="w-5 h-5 text-slate-400 hover:text-indigo-500 transition-colors" />
                )}
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all shadow-md flex items-center justify-center"
              disabled={isSigningUp}
            >
              {isSigningUp ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-sm text-slate-600">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline transition-all">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
