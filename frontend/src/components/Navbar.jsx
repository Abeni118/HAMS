import { useState, useRef, useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useNotificationStore } from "../store/useNotificationStore";
import { LogOut, Bell, HelpCircle, Search, User as UserIcon, Settings, ChevronDown, Check, Trash2, Calendar as CalendarIcon, FileText, Activity, ShieldAlert, X, Menu } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ onMenuToggle }) => {
  const { authUser, logout } = useAuthStore();
  const { notifications, unreadCount, fetchNotifications, markAsRead, markAllAsRead, deleteNotification, connectSocket, disconnectSocket } = useNotificationStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (authUser) {
      fetchNotifications();
      connectSocket();
    }
    return () => disconnectSocket();
  }, [authUser, fetchNotifications, connectSocket, disconnectSocket]);

  const notificationRoutes = {
    appointment: {
      patient: "/patient/appointments",
      doctor: "/doctor/schedule",
      nurse: "/nurse",
      admin: "/admin/appointments"
    },
    schedule: {
      patient: "/patient/appointments",
      doctor: "/doctor/schedule",
      nurse: "/nurse",
      admin: "/admin/appointments"
    },
    report: {
      patient: "/patient/reports",
      doctor: "/doctor/reports",
      nurse: "/nurse/reports",
      admin: "/admin/reports"
    },
    queue: {
      patient: "/patient",
      doctor: "/doctor/patients",
      nurse: "/nurse/queue",
      admin: "/admin"
    },
    profile: {
      patient: "/patient/profile",
      doctor: "/doctor/profile",
      nurse: "/nurse/profile",
      admin: "/admin/profile"
    },
    user: {
      admin: "/admin/users"
    },
    system: {
      patient: "/patient",
      doctor: "/doctor",
      nurse: "/nurse",
      admin: "/admin"
    }
  };

  const handleNotificationClick = (notif) => {
    if (!notif.read) markAsRead(notif._id);
    setIsNotificationsOpen(false);

    const role = authUser?.role || "patient";
    const route = notificationRoutes[notif.type]?.[role];

    if (route) {
      navigate(route);
    } else {
      navigate(`/${role}`);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "urgent": return "bg-red-100 text-red-700 border-red-200";
      case "low": return "bg-slate-100 text-slate-700 border-slate-200";
      default: return "bg-indigo-50 text-indigo-700 border-indigo-200";
    }
  };

  const getIcon = (type) => {
    switch(type) {
      case "appointment": return <CalendarIcon className="w-4 h-4" />;
      case "report": return <FileText className="w-4 h-4" />;
      case "queue": return <Activity className="w-4 h-4" />;
      case "emergency": return <ShieldAlert className="w-4 h-4 text-red-500" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  return (
    <nav className="bg-white border-b border-slate-200 h-20 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-30">

      {/* Hamburger — visible on mobile/tablet only */}
      <button
        onClick={onMenuToggle}
        className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors mr-2 shrink-0"
        aria-label="Open sidebar"
      >
        <Menu className="w-6 h-6" />
      </button>

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
          <div className="relative" ref={notifRef}>
            <button 
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="relative hover:text-slate-700 transition-colors"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
                  {unreadCount}
                </span>
              )}
            </button>
            
            {/* Notifications Dropdown */}
            {isNotificationsOpen && (
              <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 rounded-t-xl">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-800">Notifications</h3>
                    {unreadCount > 0 && (
                      <span className="text-xs font-bold text-white bg-red-500 px-2 py-0.5 rounded-full">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button 
                      onClick={() => markAllAsRead()}
                      className="text-xs font-semibold text-[#698bf4] hover:text-[#5879e2] flex items-center gap-1 transition-colors"
                    >
                      <Check className="w-3 h-3" /> Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-[350px] overflow-y-auto hide-scrollbar">
                  {notifications.length === 0 ? (
                    <div className="px-4 py-8 text-center text-sm text-slate-500 flex flex-col items-center">
                      <Bell className="w-8 h-8 text-slate-200 mb-2" />
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div 
                        key={notif._id} 
                        className={`px-4 py-3 border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors flex gap-3 group relative ${!notif.read ? 'bg-[#f8faff]' : ''}`}
                      >
                        <div className="mt-1 shrink-0">
                          <div className={`p-2 rounded-full ${!notif.read ? 'bg-[#698bf4]/10 text-[#698bf4]' : 'bg-slate-100 text-slate-400'}`}>
                            {getIcon(notif.type)}
                          </div>
                        </div>
                        <div className="flex-1 cursor-pointer pr-6" onClick={() => handleNotificationClick(notif)}>
                          <div className="flex justify-between items-start mb-0.5">
                            <p className={`text-sm ${!notif.read ? 'font-bold text-slate-800' : 'font-medium text-slate-600'}`}>{notif.title}</p>
                          </div>
                          <p className="text-xs text-slate-500 leading-relaxed mb-1.5">{notif.message}</p>
                          <div className="flex items-center gap-2">
                            <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">{new Date(notif.createdAt).toLocaleDateString()} {new Date(notif.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                            {notif.priority === "urgent" && (
                              <span className="text-[9px] font-bold uppercase tracking-wider bg-red-100 text-red-600 px-1.5 py-0.5 rounded border border-red-200">Urgent</span>
                            )}
                          </div>
                        </div>
                        <button 
                          onClick={(e) => { e.stopPropagation(); deleteNotification(notif._id); }}
                          className="absolute right-3 top-3 p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                          title="Delete notification"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
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
                <img src={`${authUser.profilePic}?t=${Date.now()}`} alt="Profile" className="w-full h-full object-cover" />
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
