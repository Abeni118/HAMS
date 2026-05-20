import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useNurseStore } from "../store/useNurseStore";
import { Users, Activity, FileText, ClipboardList, Clock } from "lucide-react";
import { Link } from "react-router-dom";

const NurseDashboard = () => {
  const { authUser } = useAuthStore();
  const { stats, fetchStats, patientQueue, fetchQueue, isFetchingStats, isFetchingQueue } = useNurseStore();

  useEffect(() => {
    fetchStats();
    fetchQueue();
  }, [fetchStats, fetchQueue]);

  const dashboardStats = [
    { title: "Patients in Queue", value: stats?.patientsInQueue || 0, icon: Users, color: "bg-blue-500" },
    { title: "Vitals Recorded Today", value: stats?.vitalsRecordedToday || 0, icon: Activity, color: "bg-emerald-500" },
    { title: "Tasks Completed", value: stats?.tasksCompleted || 0, icon: ClipboardList, color: "bg-amber-500" },
    { title: "Total Vitals History", value: stats?.totalVitalsRecorded || 0, icon: FileText, color: "bg-purple-500" },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Waiting": return "bg-amber-100 text-amber-700 border-amber-200";
      case "In Progress": return "bg-blue-100 text-blue-700 border-blue-200";
      case "Completed": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "Emergency": return "bg-red-100 text-red-700 border-red-200";
      default: return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold text-slate-800">Welcome Nurse {authUser?.fullName}</h1>
        <p className="text-slate-500 mt-1">Here is your shift overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${stat.color} mr-4 shadow-md`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium">{stat.title}</p>
              <h3 className="text-2xl font-bold text-slate-800">
                {isFetchingStats ? (
                  <span className="loading loading-spinner loading-xs text-slate-400"></span>
                ) : (
                  stat.value
                )}
              </h3>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 min-h-[300px]">
        <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-4">
          <h2 className="text-lg font-semibold text-slate-800">
            Patient Queue
          </h2>
          <Link to="/nurse/queue" className="text-sm font-medium text-[#698bf4] hover:underline">
            View All
          </Link>
        </div>
        
        {isFetchingQueue ? (
          <div className="flex items-center justify-center h-48 text-[#698bf4]">
            <span className="loading loading-spinner loading-md"></span>
          </div>
        ) : patientQueue && patientQueue.length > 0 ? (
          <div className="space-y-4">
            {patientQueue.slice(0, 5).map((patient) => (
              <div key={patient._id} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                    {patient.patientId?.profilePic ? (
                      <img src={patient.patientId.profilePic} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold">
                        {patient.patientId?.fullName?.charAt(0) || "?"}
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800">{patient.patientId?.fullName || "Unknown Patient"}</h4>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(patient.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${getStatusColor(patient.status)}`}>
                    {patient.status}
                  </span>
                  <Link to="/nurse/queue" className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50">
                    Update
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-48 text-slate-400">
            <Users className="w-12 h-12 mb-3 text-slate-300" />
            <p>No patients currently in queue.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NurseDashboard;
