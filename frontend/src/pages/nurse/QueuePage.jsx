import { useEffect } from "react";
import { useNurseStore } from "../../store/useNurseStore";
import { Users, Clock, AlertCircle, CheckCircle } from "lucide-react";

const QueuePage = () => {
  const { patientQueue, isFetchingQueue, fetchQueue, updateQueueStatus } = useNurseStore();

  useEffect(() => {
    fetchQueue();
  }, [fetchQueue]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Waiting": return "bg-amber-100 text-amber-700 border-amber-200";
      case "In Progress": return "bg-blue-100 text-blue-700 border-blue-200";
      case "Completed": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "Emergency": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "Urgent": return <AlertCircle className="w-4 h-4 text-red-500" />;
      case "High": return <Clock className="w-4 h-4 text-amber-500" />;
      case "Normal": return <CheckCircle className="w-4 h-4 text-emerald-500" />;
      default: return null;
    }
  };

  const handleStatusChange = (id, newStatus) => {
    updateQueueStatus(id, newStatus);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold text-slate-800">Patient Queue</h1>
        <p className="text-slate-500 mt-1">Manage current patient flow and triage.</p>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-4">
          <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <Users className="w-5 h-5 text-[#698bf4]" />
            Current Queue ({patientQueue.length})
          </h2>
          <button 
            onClick={fetchQueue}
            className="text-sm text-[#698bf4] hover:underline"
          >
            Refresh
          </button>
        </div>

        {isFetchingQueue ? (
          <div className="flex items-center justify-center h-48 text-[#698bf4]">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : patientQueue.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-slate-100 text-slate-500 text-sm">
                  <th className="pb-3 font-medium">Patient</th>
                  <th className="pb-3 font-medium">Assigned Doctor</th>
                  <th className="pb-3 font-medium">Priority</th>
                  <th className="pb-3 font-medium">Time Added</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {patientQueue.map((entry) => (
                  <tr key={entry._id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-200 overflow-hidden shrink-0">
                          {entry.patientId?.profilePic ? (
                            <img src={entry.patientId.profilePic} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold">
                              {entry.patientId?.fullName?.charAt(0) || "?"}
                            </div>
                          )}
                        </div>
                        <span className="font-medium text-slate-800">{entry.patientId?.fullName || "Unknown Patient"}</span>
                      </div>
                    </td>
                    <td className="py-4 text-slate-600">
                      Dr. {entry.doctorId?.fullName || "Unassigned"}
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-1.5 font-medium text-slate-700">
                        {getPriorityIcon(entry.priority)}
                        <span>{entry.priority}</span>
                      </div>
                    </td>
                    <td className="py-4 text-slate-500">
                      {new Date(entry.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-4">
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${getStatusColor(entry.status)}`}>
                        {entry.status}
                      </span>
                    </td>
                    <td className="py-4 text-right">
                      <select 
                        value={entry.status}
                        onChange={(e) => handleStatusChange(entry._id, e.target.value)}
                        className="bg-slate-50 border border-slate-200 text-slate-700 text-xs rounded-lg focus:ring-[#698bf4] focus:border-[#698bf4] px-2 py-1 outline-none cursor-pointer"
                      >
                        <option value="Waiting">Waiting</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Emergency">Emergency</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-48 text-slate-400">
            <Users className="w-12 h-12 mb-3 text-slate-300" />
            <p>Queue is empty.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QueuePage;
