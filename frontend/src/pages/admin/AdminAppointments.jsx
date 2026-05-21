import { useEffect, useState } from "react";
import { useAdminStore } from "../../store/useAdminStore";
import { Search, Calendar, Loader2, CheckCircle, XCircle } from "lucide-react";

const AdminAppointments = () => {
  const { appointments, fetchAppointments, isLoadingAppointments, updateAppointment } = useAdminStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const filteredAppointments = appointments.filter(a => {
    const matchesSearch = 
      a.patientId?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      a.doctorId?.fullName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || a.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = async (id, status) => {
    if (window.confirm(`Are you sure you want to mark this appointment as ${status}?`)) {
      await updateAppointment(id, { status });
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 pb-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Hospital Appointments</h1>
          <p className="text-sm text-slate-500 mt-1">Overview of all scheduled hospital consultations and procedures.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex gap-3 flex-wrap">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search patient or doctor..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm w-full sm:w-64 focus:outline-none focus:border-[#698bf4]" 
              />
            </div>
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 outline-none focus:border-[#698bf4]"
            >
              <option value="all">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          {isLoadingAppointments ? (
            <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-[#698bf4]" /></div>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 font-semibold">Patient</th>
                  <th className="px-6 py-4 font-semibold">Doctor</th>
                  <th className="px-6 py-4 font-semibold">Date & Time</th>
                  <th className="px-6 py-4 font-semibold">Type</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAppointments.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-slate-500">No appointments found matching your criteria.</td>
                  </tr>
                ) : (
                  filteredAppointments.map((a) => (
                    <tr key={a._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-800">
                        {a.patientId?.fullName || "Unknown Patient"}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        Dr. {a.doctorId?.fullName || "Unassigned"}
                        {a.doctorId?.specialization && <p className="text-[10px] text-slate-400">{a.doctorId.specialization}</p>}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-700">{new Date(a.date).toLocaleDateString()} at {a.time}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">{a.type || "Consultation"}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 text-[10px] uppercase font-bold rounded-full ${
                          a.status === 'Completed' ? 'bg-green-100 text-green-700' :
                          a.status === 'Approved' ? 'bg-blue-100 text-blue-700' :
                          a.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                          'bg-amber-100 text-amber-700'
                        }`}>
                          {a.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {a.status !== "Cancelled" && a.status !== "Completed" && (
                          <div className="flex justify-end gap-2">
                            {a.status === "Pending" && (
                              <button onClick={() => handleUpdateStatus(a._id, "Approved")} className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors title='Approve'">
                                <CheckCircle className="w-4 h-4" />
                              </button>
                            )}
                            <button onClick={() => handleUpdateStatus(a._id, "Cancelled")} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors title='Cancel'">
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAppointments;
