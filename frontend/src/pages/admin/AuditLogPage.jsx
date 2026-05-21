import { useEffect, useState } from "react";
import { useAdminStore } from "../../store/useAdminStore";
import { Search, Filter, Loader2, Clock, Check, AlertTriangle, ShieldAlert } from "lucide-react";

const AuditLogPage = () => {
  const { auditLogs, fetchAuditLogs, isLoadingAuditLogs } = useAdminStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  useEffect(() => {
    fetchAuditLogs();
  }, [fetchAuditLogs]);

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = 
      log.actorId?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.entityType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || log.actorRole === filterRole;
    return matchesSearch && matchesRole;
  });

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const currentLogs = filteredLogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getActionIcon = (actionType) => {
    if (actionType.toLowerCase().includes("delete")) return <ShieldAlert className="w-4 h-4 text-red-500" />;
    if (actionType.toLowerCase().includes("update")) return <AlertTriangle className="w-4 h-4 text-amber-500" />;
    return <Check className="w-4 h-4 text-green-500" />;
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 pb-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">System Audit Logs</h1>
          <p className="text-sm text-slate-500 mt-1">Immutable record of all critical system activities and modifications.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-[#698bf4] text-[#698bf4] bg-white rounded-lg text-sm font-medium hover:bg-[#f0f4ff] transition-colors">
          Export CSV
        </button>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex gap-3 flex-wrap">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search user, action, or module..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm w-full sm:w-72 focus:outline-none focus:border-[#698bf4]" 
              />
            </div>
            <select 
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 outline-none focus:border-[#698bf4]"
            >
              <option value="all">All Roles</option>
              <option value="admin">Admins</option>
              <option value="doctor">Doctors</option>
              <option value="nurse">Nurses</option>
              <option value="patient">Patients</option>
            </select>
            <button className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50">
              <Filter className="w-4 h-4" /> More Filters
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          {isLoadingAuditLogs ? (
            <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-[#698bf4]" /></div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 font-semibold w-12"></th>
                  <th className="px-6 py-4 font-semibold">User / Actor</th>
                  <th className="px-6 py-4 font-semibold">Action Type</th>
                  <th className="px-6 py-4 font-semibold">Module</th>
                  <th className="px-6 py-4 font-semibold">IP Address</th>
                  <th className="px-6 py-4 font-semibold">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentLogs.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-slate-500">No logs found matching your criteria.</td>
                  </tr>
                ) : (
                  currentLogs.map((log) => (
                    <tr key={log._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 text-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          log.action.toLowerCase().includes("delete") ? 'bg-red-50' : 
                          log.action.toLowerCase().includes("update") ? 'bg-amber-50' : 'bg-green-50'
                        }`}>
                          {getActionIcon(log.action)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-800">{log.actorId?.fullName || "System"}</p>
                        <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">{log.actorRole}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium text-slate-700 capitalize">{log.action}</span>
                        {log.details && <p className="text-xs text-slate-500 mt-0.5 max-w-xs truncate" title={log.details}>{log.details}</p>}
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2.5 py-1 text-[10px] uppercase font-bold rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                          {log.entityType}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-500 font-mono text-xs">
                        {log.ipAddress}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-600">
                            {new Date(log.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination Footer */}
        {!isLoadingAuditLogs && filteredLogs.length > 0 && (
          <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center text-sm text-slate-500 gap-4">
            <p>Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredLogs.length)} of {filteredLogs.length} logs</p>
            <div className="flex gap-1">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-slate-200 rounded text-slate-600 disabled:text-slate-400 disabled:bg-slate-50 hover:bg-slate-50 transition-colors"
              >
                Previous
              </button>
              
              <div className="flex gap-1 px-2">
                {[...Array(totalPages)].map((_, i) => (
                  <button 
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-8 h-8 flex items-center justify-center rounded transition-colors ${
                      currentPage === i + 1 
                        ? 'bg-[#698bf4] text-white font-medium border border-[#698bf4]' 
                        : 'border border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>

              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-slate-200 rounded text-slate-600 disabled:text-slate-400 disabled:bg-slate-50 hover:bg-slate-50 transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuditLogPage;
