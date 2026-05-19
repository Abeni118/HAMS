import { useAuthStore } from "../store/useAuthStore";
import { 
  Users, Building, FileText, HeartPulse, Search, 
  Filter, Calendar, AlertCircle, Clock, ChevronDown, Download, Check
} from "lucide-react";

const AdminDashboard = () => {
  const { authUser } = useAuthStore();

  const stats = [
    { title: "Total Users", value: "1,284", change: "+12%", changeType: "positive", icon: Users, solid: true },
    { title: "Active Appointments", value: "482", change: "-5%", changeType: "negative", icon: Calendar, solid: false },
    { title: "Doctors On Call", value: "56", change: "-2%", changeType: "negative", icon: HeartPulse, solid: true },
    { title: "System Alerts", value: "03", change: null, changeType: "neutral", icon: AlertCircle, solid: false },
  ];

  const users = [
    { name: "Dr. Sarah Mitchell", email: "s.mitchell@hospital.com", role: "Doctor", dept: "Cardiology", status: "Active", login: "2 mins ago" },
    { name: "James Wilson", email: "j.wilson@hospital.com", role: "Admin", dept: "Operations", status: "Active", login: "1 hour ago" },
    { name: "Elena Rodriguez", email: "e.rodriguez@hospital.com", role: "Receptionist", dept: "Front Desk", status: "Active", login: "12 mins ago" },
    { name: "Dr. Michael Chen", email: "m.chen@hospital.com", role: "Doctor", dept: "Neurology", status: "Inactive", login: "2 days ago" },
    { name: "Linda Thompson", email: "l.thompson@hospital.com", role: "Manager", dept: "HR", status: "Active", login: "Just now" },
  ];

  const departments = [
    { name: "Cardiology", head: "Dr. Sarah Mitchell", doctors: 12, status: "Full" },
    { name: "Neurology", head: "Dr. Robert Fox", doctors: 8, status: "Available" },
    { name: "Pediatrics", head: "Dr. Emily Blunt", doctors: 15, status: "Available" },
    { name: "Emergency", head: "Dr. Greg House", doctors: 22, status: "Critical" },
  ];

  const audits = [
    { user: "James Wilson", action: "modified user role", target: "Dr. Michael Chen", time: "10:45 AM" },
    { user: "System", action: "automatic backup completed", target: "Database_SRV_04", time: "09:00 AM" },
    { user: "Elena Rodriguez", action: "appointment cancelled", target: "ID #88291", time: "08:15 AM" },
    { user: "Dr. Sarah Mitchell", action: "accessed patient record", target: "John Doe", time: "07:30 AM" },
  ];

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 pb-16">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Hospital Appointment Management</h1>
          <p className="text-sm text-slate-500 mt-1">Operational overview and system administration console. Last updated: 12 Oct, 10:45 AM</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white rounded-lg text-sm text-slate-600 hover:bg-slate-50">
            <Calendar className="w-4 h-4" />
            Oct 01 - Oct 31, 2023
            <ChevronDown className="w-4 h-4 ml-2" />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 bg-white rounded-lg text-sm text-slate-600 hover:bg-slate-50">
            <Filter className="w-4 h-4" />
            All Departments
            <ChevronDown className="w-4 h-4 ml-2" />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-[#698bf4] text-[#698bf4] bg-white rounded-lg text-sm font-medium hover:bg-[#f0f4ff]">
            Export
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#698bf4] text-white rounded-lg text-sm font-medium hover:bg-[#5a7dec]">
            + Schedule Report
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-xl p-6 border border-slate-200 flex justify-between items-center shadow-sm">
            <div>
              <p className="text-slate-500 text-sm mb-1">{stat.title}</p>
              <div className="flex items-end gap-2">
                <h3 className="text-3xl font-bold text-slate-800">{stat.value}</h3>
                {stat.change && (
                  <span className={`text-xs font-semibold mb-1 ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-500'}`}>
                    {stat.change}
                  </span>
                )}
              </div>
            </div>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${stat.solid ? 'bg-[#698bf4] text-white' : 'border border-slate-200 text-slate-800'}`}>
              <stat.icon className="w-5 h-5" />
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Column - User Management */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-800">User Management</h2>
                <p className="text-sm text-slate-500">Manage hospital staff roles and platform access</p>
              </div>
              <div className="flex gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <input type="text" placeholder="Search name..." className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm w-48 focus:outline-none focus:border-[#698bf4]" />
                </div>
                <button className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50">
                  <Filter className="w-4 h-4" /> Filter
                </button>
                <button className="flex items-center gap-2 px-4 py-2 bg-[#698bf4] text-white rounded-lg text-sm font-medium hover:bg-[#5a7dec]">
                  + Add User
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 font-semibold"><input type="checkbox" className="rounded border-slate-300" /></th>
                    <th className="px-6 py-4 font-semibold">Name</th>
                    <th className="px-6 py-4 font-semibold">Role</th>
                    <th className="px-6 py-4 font-semibold">Department</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold">Last Login</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {users.map((u, i) => (
                    <tr key={i} className="hover:bg-slate-50/50">
                      <td className="px-6 py-4"><input type="checkbox" className="rounded border-slate-300" /></td>
                      <td className="px-6 py-4 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex-shrink-0 flex items-center justify-center text-slate-500 text-xs font-bold uppercase overflow-hidden">
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">{u.name}</p>
                          <p className="text-xs text-slate-500">{u.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-700">{u.role}</td>
                      <td className="px-6 py-4 text-slate-700">{u.dept}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 text-[10px] uppercase font-bold rounded-full ${u.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                          {u.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500 text-xs">
                        {u.login}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t border-slate-100 flex justify-between items-center text-sm text-slate-500">
              <p>Showing 5 of 1,284 users</p>
              <div className="flex gap-1">
                <button className="px-3 py-1 border border-slate-200 rounded text-slate-400 cursor-not-allowed">Previous</button>
                <button className="px-3 py-1 border border-slate-200 rounded bg-slate-50 text-slate-800 font-medium">1</button>
                <button className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50">2</button>
                <button className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50">3</button>
                <button className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50 text-slate-700">Next</button>
              </div>
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
              <button className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium shadow-sm hover:bg-slate-50">Export CSV</button>
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
              <button className="text-sm text-[#698bf4] font-medium hover:underline">+ Add New</button>
            </div>
            <div className="space-y-6">
              {departments.map((d, i) => (
                <div key={i} className="flex justify-between items-start">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                      <Building className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">{d.name}</p>
                      <p className="text-xs text-slate-500">Head: {d.head}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-2 py-1 bg-slate-50 border border-slate-100 text-slate-600 text-[10px] rounded-full font-medium mb-1">
                      {d.doctors} Doctors
                    </span>
                    <p className={`text-[10px] font-bold ${d.status === 'Critical' ? 'text-red-500' : 'text-slate-400'}`}>{d.status}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-2 text-sm text-slate-500 font-medium hover:text-slate-800 transition-colors">
              View All Departments
            </button>
          </div>

          {/* Audit Log Widget */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-slate-800">Audit Log</h2>
              <Clock className="w-4 h-4 text-slate-400" />
            </div>
            <div className="relative mb-6">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Filter logs..." className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#698bf4]" />
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
            <button className="w-full mt-6 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 font-medium hover:bg-slate-50 transition-colors">
              View Full Audit History
            </button>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="pt-8 mt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 gap-4">
        <p>© 2023 MediSync Healthcare Solutions. All rights reserved.</p>
        <div className="flex gap-4">
          <span>System Status: Operational</span>
          <span>v1.2.4-stable</span>
          <a href="#" className="hover:text-slate-800">Privacy Policy</a>
          <a href="#" className="hover:text-slate-800">Help Center</a>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
