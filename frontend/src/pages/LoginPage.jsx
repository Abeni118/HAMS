import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Loader2, Hospital } from "lucide-react";
import AuthImagePattern from "../components/AuthImagePattern";
import Input from "../components/Input";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { login, isLoggingIn } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-slate-50">
      {/* Left side - Branding/Pattern */}
      <AuthImagePattern
        title="Welcome back to HAMS"
        subtitle="Sign in to access the Hospital Appointment Management System."
      />

      {/* Right side - Form */}
      <div className="flex flex-col justify-center items-center p-6 sm:p-12 z-10 bg-white shadow-[-20px_0_30px_-15px_rgba(0,0,0,0.05)]">
        <div className="w-full max-w-md space-y-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex flex-col items-center gap-2 group">
              <div className="w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                <Hospital className="w-8 h-8 text-indigo-600" />
              </div>
              <h1 className="text-2xl font-bold mt-2 text-slate-800">Welcome Back</h1>
              <p className="text-slate-500">Sign in to your account</p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              icon={Mail}
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />

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

            <button
              type="submit"
              className="w-full py-3 px-4 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all shadow-md flex items-center justify-center"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          <div className="text-center">
            <p className="text-sm text-slate-600">
              Don&apos;t have an account?{" "}
              <Link to="/signup" className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline transition-all">
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
