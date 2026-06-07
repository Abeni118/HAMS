import { useEffect, useState } from "react";
import { useAdminStore } from "../../store/useAdminStore";
import { Search, Filter, Loader2, ShieldCheck, XCircle, Info, Calendar, User, Eye, CheckCircle2, AlertCircle } from "lucide-react";

const AdminApprovals = () => {
  const { pendingApprovals, fetchPendingApprovals, approveUser, rejectUser, isLoadingApprovals } = useAdminStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  
  // Modal state for detail review
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchPendingApprovals();
  }, [fetchPendingApprovals]);

  const filteredApprovals = pendingApprovals.filter((u) => {
    const matchesSearch =
      u.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const handleOpenDetail = (user) => {
    setSelectedUser(user);
    setIsDetailModalOpen(true);
  };

  const handleApprove = async (id, name) => {
    if (window.confirm(`Are you sure you want to APPROVE the registration for ${name}?`)) {
      await approveUser(id);
    }
  };

  const handleReject = async (id, name) => {
    if (window.confirm(`Are you sure you want to REJECT the registration for ${name}?`)) {
      await rejectUser(id);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 pb-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Pending Registrations</h1>
          <p className="text-sm text-slate-500 mt-1">
            Review and approve registration requests for healthcare professionals (Doctors and Nurses).
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Filters */}
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/50">
          <div className="flex gap-3 flex-wrap w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-none">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm w-full sm:w-64 focus:outline-none focus:border-[#698bf4] bg-white"
              />
            </div>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 outline-none focus:border-[#698bf4] bg-white cursor-pointer"
            >
              <option value="all">All Roles</option>
              <option value="doctor">Doctors Only</option>
              <option value="nurse">Nurses Only</option>
            </select>
          </div>
          <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">
            {filteredApprovals.length} Request(s) found
          </div>
        </div>

        {/* Table / List */}
        <div className="overflow-x-auto">
          {isLoadingApprovals ? (
            <div className="flex justify-center p-12">
              <Loader2 className="w-8 h-8 animate-spin text-[#698bf4]" />
            </div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 font-semibold">User Details</th>
                  <th className="px-6 py-4 font-semibold">Requested Role</th>
                  <th className="px-6 py-4 font-semibold">Department</th>
                  <th className="px-6 py-4 font-semibold">License Number</th>
                  <th className="px-6 py-4 font-semibold">Date Registered</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredApprovals.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-slate-500 font-medium">
                      No pending approval requests found.
                    </td>
                  </tr>
                ) : (
                  filteredApprovals.map((u) => (
                    <tr key={u._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-50 flex-shrink-0 flex items-center justify-center text-[#698bf4] font-bold uppercase border border-indigo-100">
                          {u.fullName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{u.fullName}</p>
                          <p className="text-xs text-slate-500">{u.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 text-[10px] uppercase font-bold rounded-full ${
                          u.role === "doctor" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-600 font-medium">
                        {u.department || u.assignedWard || <span className="text-slate-400 italic">None</span>}
                      </td>
                      <td className="px-6 py-4 font-mono text-slate-600">
                        {u.medicalLicenseNumber || <span className="text-slate-400 italic">N/A</span>}
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end items-center gap-2">
                          <button
                            onClick={() => handleOpenDetail(u)}
                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleApprove(u._id, u.fullName)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 border border-green-200 rounded-lg text-xs font-bold transition-all shadow-sm"
                            title="Approve Account"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" /> Approve
                          </button>
                          <button
                            onClick={() => handleReject(u._id, u.fullName)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 rounded-lg text-xs font-bold transition-all shadow-sm"
                            title="Reject Account"
                          >
                            <XCircle className="w-3.5 h-3.5" /> Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {isDetailModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh]">
            <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center shrink-0">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Review Professional Credentials</h3>
                <p className="text-xs text-slate-400 mt-0.5 font-mono">ID: {selectedUser._id}</p>
              </div>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-200/50 transition-colors"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {/* User Overview */}
              <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-200/50 rounded-xl">
                <div className="w-14 h-14 rounded-full bg-[#e0e7ff] text-[#698bf4] flex items-center justify-center text-xl font-bold uppercase border border-indigo-100">
                  {selectedUser.fullName.charAt(0)}
                </div>
                <div>
                  <p className="text-base font-bold text-slate-800">{selectedUser.fullName}</p>
                  <p className="text-sm text-slate-500">{selectedUser.email}</p>
                  <span className={`inline-block px-2 py-0.5 text-[9px] font-extrabold uppercase rounded border mt-1.5 ${
                    selectedUser.role === "doctor" ? "bg-blue-50 text-blue-700 border-blue-200" : "bg-purple-50 text-purple-700 border-purple-200"
                  }`}>
                    {selectedUser.role}
                  </span>
                </div>
              </div>

              {/* Credentials Fields */}
              <div className="space-y-4">
                <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Professional Info</h4>
                <div className="bg-white border border-slate-150 rounded-xl divide-y divide-slate-100">
                  
                  {/* Common Details */}
                  <div className="flex justify-between items-center py-3 px-4 text-sm">
                    <span className="text-slate-500 font-medium">Department / Specialty</span>
                    <span className="text-slate-800 font-semibold">
                      {selectedUser.department || selectedUser.assignedWard || "Not Provided"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center py-3 px-4 text-sm">
                    <span className="text-slate-500 font-medium">License / Registry Number</span>
                    <span className="font-mono text-slate-800 font-semibold">
                      {selectedUser.medicalLicenseNumber || "Not Provided"}
                    </span>
                  </div>

                  {/* Doctor Details */}
                  {selectedUser.role === "doctor" && (
                    <>
                      <div className="flex justify-between items-center py-3 px-4 text-sm">
                        <span className="text-slate-500 font-medium">Specialization</span>
                        <span className="text-slate-800 font-semibold">{selectedUser.specialization || "General Medicine"}</span>
                      </div>
                      <div className="flex justify-between items-center py-3 px-4 text-sm">
                        <span className="text-slate-500 font-medium">Years of Experience</span>
                        <span className="text-slate-800 font-semibold">{selectedUser.yearsOfExperience} Year(s)</span>
                      </div>
                    </>
                  )}

                  {/* Nurse Details */}
                  {selectedUser.role === "nurse" && (
                    <>
                      <div className="flex justify-between items-center py-3 px-4 text-sm">
                        <span className="text-slate-500 font-medium">Shift Preference</span>
                        <span className="text-slate-800 font-semibold capitalize">{selectedUser.shiftType || "Day Shift"}</span>
                      </div>
                    </>
                  )}

                  <div className="flex justify-between items-center py-3 px-4 text-sm">
                    <span className="text-slate-500 font-medium">Application Date</span>
                    <span className="text-slate-800 font-semibold">
                      {new Date(selectedUser.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setIsDetailModalOpen(false)}
                className="px-4 py-2 border border-slate-200 text-slate-700 bg-white hover:bg-slate-50 rounded-xl text-sm font-semibold transition-colors"
              >
                Close
              </button>
              <button
                type="button"
                onClick={async () => {
                  setIsDetailModalOpen(false);
                  await handleReject(selectedUser._id, selectedUser.fullName);
                }}
                className="px-4 py-2 bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 rounded-xl text-sm font-bold transition-colors"
              >
                Reject Application
              </button>
              <button
                type="button"
                onClick={async () => {
                  setIsDetailModalOpen(false);
                  await handleApprove(selectedUser._id, selectedUser.fullName);
                }}
                className="px-4 py-2 bg-[#698bf4] text-white hover:bg-[#5a7dec] rounded-xl text-sm font-bold transition-colors shadow-sm"
              >
                Approve Application
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminApprovals;
