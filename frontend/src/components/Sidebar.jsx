import { NavLink } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Settings,
  Activity,
  FileText,
  Building,
  HeartPulse,
  ClipboardList,
  X
} from "lucide-react";

const getSidebarLinks = (role) => {
  switch (role) {
    case "patient":
      return [
        { name: "Dashboard", path: "/patient", icon: LayoutDashboard },
        { name: "Appointments", path: "/patient/appointments", icon: Calendar, badge: 2 },
        { name: "Profile", path: "/patient/profile", icon: Users },
        { name: "Reports", path: "/patient/reports", icon: FileText },
        { name: "Settings", path: "/patient/settings", icon: Settings },
      ];
    case "doctor":
      return [
        { name: "Dashboard", path: "/doctor", icon: LayoutDashboard },
        { name: "Schedule", path: "/doctor/schedule", icon: Calendar },
        { name: "Patients", path: "/doctor/patients", icon: Users },
        { name: "Reports", path: "/doctor/reports", icon: FileText },
        { name: "Settings", path: "/doctor/settings", icon: Settings },
      ];
    case "nurse":
      return [
        { name: "Dashboard", path: "/nurse", icon: LayoutDashboard },
        { name: "Vitals", path: "/nurse/vitals", icon: Activity },
        { name: "Patient Queue", path: "/nurse/queue", icon: Users },
        { name: "Reports", path: "/nurse/reports", icon: FileText },
        { name: "Settings", path: "/nurse/settings", icon: Settings },
      ];
    case "admin":
      return [
        { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
        { name: "Appointments", path: "/admin/appointments", icon: Calendar, badge: 4 },
        { name: "Users", path: "/admin/users", icon: Users },
        { name: "Departments", path: "/admin/departments", icon: Building },
        { name: "Reports", path: "/admin/reports", icon: FileText },
        { name: "Audit Log", path: "/admin/audit-log", icon: ClipboardList },
        { name: "Settings", path: "/admin/settings", icon: Settings },
      ];
    default:
      return [];
  }
};

const Sidebar = ({ isOpen, onClose }) => {
  const { authUser } = useAuthStore();
  const links = getSidebarLinks(authUser?.role);

  return (
    <aside
      className={`
        fixed top-0 left-0 h-screen w-64 bg-[#f8fafc] flex flex-col z-50
        border-r border-slate-200
        transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0
      `}
      aria-label="Sidebar navigation"
    >
      {/* Logo Section */}
      <div className="h-20 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-lg bg-[#698bf4] flex items-center justify-center mr-3 shadow-sm">
            <HeartPulse className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-[#698bf4] tracking-tight">HAMS</h1>
        </div>
        {/* Close button — only visible on mobile/tablet */}
        <button
          onClick={onClose}
          className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1">
          {links.map((link) => (
            <li key={link.name}>
              <NavLink
                to={link.path}
                end={link.path.split('/').length <= 2}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center justify-between px-6 py-3 transition-all duration-200 relative ${
                    isActive
                      ? "bg-[#e0e7ff] text-[#698bf4] font-medium"
                      : "text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                  }`
                }
              >
                {/* Active Left Border Indicator */}
                <div
                  className={`absolute left-0 top-0 bottom-0 w-1 bg-[#698bf4] transition-opacity duration-200 ${
                    location.pathname === link.path || (link.path.split('/').length <= 2 && location.pathname === link.path)
                      ? "opacity-100" : "opacity-0 hidden"
                  }`}
                />

                <div className="flex items-center">
                  <link.icon className={`w-5 h-5 mr-3`} />
                  <span>{link.name}</span>
                </div>

                {link.badge && (
                  <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {link.badge}
                  </span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      {/* Bottom Storage Widget */}
      <div className="p-6 shrink-0">
        <div className="bg-[#e0e7ff] rounded-xl p-4">
          <p className="text-xs font-semibold text-slate-700 mb-2">Storage Usage</p>
          <div className="w-full bg-slate-200 rounded-full h-1.5 mb-2">
            <div className="bg-[#698bf4] h-1.5 rounded-full" style={{ width: "60%" }}></div>
          </div>
          <p className="text-[10px] text-slate-500">1.2GB of 2GB used</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
