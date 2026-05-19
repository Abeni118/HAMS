import { useState, useRef, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, Bell, HelpCircle, Search, User as UserIcon, Settings, ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { authUser, logout } = useAuthStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-white border-b border-slate-200 h-20 flex items-center justify-between px-8 sticky top-0 z-50">
      
      {/* Search Bar */}
      <div className="flex-1 max-w-2xl">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border-none rounded-lg bg-slate-50 text-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-200"
            placeholder="Search users, appointments, departments..."
          />
        </div>
      </div>

      <div className="flex items-center gap-6 relative">
        {/* Icons */}
        <div className="flex items-center gap-4 text-slate-500">
          <button className="relative hover:text-slate-700 transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-0 right-0 block h-1.5 w-1.5 rounded-full bg-red-500 ring-2 ring-white" />
          </button>
          <button className="hover:text-slate-700 transition-colors">
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>

        <div className="h-8 w-px bg-slate-200"></div>

        {/* Profile Dropdown Container */}
        <div className="relative" ref={dropdownRef}>
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 hover:bg-slate-50 p-1.5 rounded-xl transition-colors focus:outline-none"
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-slate-800">{authUser?.fullName || "Admin Root"}</p>
              <p className="text-[11px] text-slate-500 capitalize">
                {authUser?.role === "admin" ? "Super Administrator" : authUser?.specialization || authUser?.role}
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#e0e7ff] flex items-center justify-center text-[#698bf4] overflow-hidden border border-indigo-100">
              {authUser?.profilePic ? (
                <img src={authUser.profilePic} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <UserIcon className="w-5 h-5" />
              )}
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-2 border-b border-slate-100 mb-1 sm:hidden">
                <p className="text-sm font-semibold text-slate-800 line-clamp-1">{authUser?.fullName}</p>
                <p className="text-xs text-slate-500 capitalize">{authUser?.role}</p>
              </div>
              
              <Link 
                to={`/${authUser?.role || 'doctor'}/profile`} 
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#698bf4] transition-colors"
              >
                <UserIcon className="w-4 h-4" /> My Profile
              </Link>
              
              <Link 
                to={`/${authUser?.role || 'doctor'}/settings`} 
                onClick={() => setIsDropdownOpen(false)}
                className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#698bf4] transition-colors"
              >
                <Settings className="w-4 h-4" /> Settings
              </Link>
              
              <div className="h-px bg-slate-100 my-1"></div>
              
              <button
                onClick={() => {
                  setIsDropdownOpen(false);
                  logout();
                }}
                className="flex items-center w-full gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
