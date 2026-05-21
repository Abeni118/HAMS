import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useAdminStore } from "../store/useAdminStore";
import { 
  Users, Building, FileText, HeartPulse, Search, 
  Filter, Calendar, AlertCircle, Clock, ChevronDown, Check, Loader2
} from "lucide-react";

const AdminDashboard = () => {
  const { authUser } = useAuthStore();
  const { 
    stats, fetchDashboardStats, isLoadingStats,
    users, fetchUsers, isLoadingUsers,
    departments, fetchDepartments, isLoadingDepartments
  } = useAdminStore();

  useEffect(() => {
    fetchDashboardStats();
    fetchUsers();
    fetchDepartments();
  }, [fetchDashboardStats, fetchUsers, fetchDepartments]);

  const dashboardStats = [
    { title: "Total Users", value: stats?.totalPatients + stats?.totalDoctors + stats?.totalNurses || 0, icon: Users, solid: true },
    { title: "Active Appointments", value: stats?.todayAppointments || 0, icon: Calendar, solid: false },
    { title: "Doctors Available", value: stats?.totalDoctors || 0, icon: HeartPulse, solid: true },
    { title: "Pending Approvals", value: stats?.pendingApprovals || 0, icon: AlertCircle, solid: false },
  ];

  // Placeholder audits (could be fetched later)
  const audits = [
    { user: "System", action: "automatic backup completed", target: "Database_SRV", time: "09:00 AM" },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 pb-16">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Hospital Administration</h1>
          <p className="text-sm text-slate-500 mt-1">Operational overview and system administration console. Welcome back, {authUser?.fullName}</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-[#698bf4] text-[#698bf4] bg-white rounded-lg text-sm font-medium hover:bg-[#f0f4ff]">
            Export Data
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#698bf4] text-white rounded-lg text-sm font-medium hover:bg-[#5a7dec]">
            + Schedule Report
          </button>
        </div>
      </div>

      {/* Stats Row */}
      {isLoadingStats ? (
        <div className="flex justify-center p-8"><Loader2 className="w-8 h-8 animate-spin text-[#698bf4]" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardStats.map((stat, i) => (
            <div key={i} className="bg-white rounded-xl p-6 border border-slate-200 flex justify-between items-center shadow-sm">
              <div>
                <p className="text-slate-500 text-sm mb-1">{stat.title}</p>
                <div className="flex items-end gap-2">
                  <h3 className="text-3xl font-bold text-slate-800">{stat.value}</h3>
                </div>
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${stat.solid ? 'bg-[#698bf4] text-white' : 'border border-slate-200 text-slate-800'}`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Column - User Management */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-800">Recent Users</h2>
                <p className="text-sm text-slate-500">Quick view of hospital staff and patients</p>
              </div>
              <div className="flex gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <input type="text" placeholder="Search name..." className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm w-48 focus:outline-none focus:border-[#698bf4]" />
                </div>
              </div>
            </div>
            <div className="overflow-x-auto">
              {isLoadingUsers ? (
                <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-[#698bf4]" /></div>
              ) : (
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Name</th>
                      <th className="px-6 py-4 font-semibold">Role</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                      <th className="px-6 py-4 font-semibold">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {users.slice(0, 5).map((u, i) => (
                      <tr key={i} className="hover:bg-slate-50/50">
                        <td className="px-6 py-4 flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center text-slate-500 text-xs font-bold uppercase overflow-hidden">
                            {u.fullName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-slate-800">{u.fullName}</p>
                            <p className="text-xs text-slate-500">{u.email}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-700 capitalize">{u.role}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 text-[10px] uppercase font-bold rounded-full ${u.isActive !== false ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-500'}`}>
                            {u.isActive !== false ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-500 text-xs">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Deep Insights Banner */}
          <div className="bg-[#eef2ff] border border-[#e0e7ff] rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                <FileText className="w-6 h-6 text-[#698bf4]" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg">Need deeper insights?</h3>
                <p className="text-sm text-slate-600">Generate cross-department monthly performance reports with custom data points.</p>
              </div>
            </div>
            <div className="flex gap-3 whitespace-nowrap">
              <button className="px-4 py-2 bg-[#698bf4] text-white rounded-lg text-sm font-medium hover:bg-[#5a7dec] shadow-sm">Create Advanced Report</button>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          
          {/* Departments Widget */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-slate-800">Departments</h2>
            </div>
            {isLoadingDepartments ? (
              <div className="flex justify-center p-4"><Loader2 className="w-5 h-5 animate-spin text-[#698bf4]" /></div>
            ) : (
              <div className="space-y-6">
                {departments.length === 0 ? (
                  <p className="text-sm text-slate-500 text-center">No departments created.</p>
                ) : departments.slice(0, 4).map((d, i) => (
                  <div key={i} className="flex justify-between items-start">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                        <Building className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">{d.name}</p>
                        <p className="text-xs text-slate-500">Head: {d.head?.fullName || "Not assigned"}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-[10px] font-bold ${d.status === 'Critical' ? 'text-red-500' : 'text-slate-400'}`}>{d.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Audit Log Widget */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-slate-800">Audit Log</h2>
              <Clock className="w-4 h-4 text-slate-400" />
            </div>
            <div className="space-y-5 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent pl-8">
              {audits.map((audit, i) => (
                <div key={i} className="relative">
                  <div className="absolute -left-8 bg-white border border-slate-200 w-5 h-5 rounded-full flex items-center justify-center z-10">
                    <Check className="w-3 h-3 text-[#698bf4]" />
                  </div>
                  <p className="text-sm text-slate-800">
                    <span className="font-medium text-[#698bf4]">{audit.user}</span> {audit.action}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">Target: <span className="italic">{audit.target}</span></p>
                  <p className="text-[10px] text-slate-400 mt-1">{audit.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
