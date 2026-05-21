import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useDashboardStore } from "../store/useDashboardStore";
import { Users, Calendar, Activity, ClipboardList, Loader2 } from "lucide-react";

const DoctorDashboard = () => {
  const { authUser } = useAuthStore();
  const { stats, fetchDoctorDashboardStats, isLoadingStats } = useDashboardStore();

  useEffect(() => {
    fetchDoctorDashboardStats();
  }, [fetchDoctorDashboardStats]);

  const displayStats = [
    { title: "Today's Patients", value: stats?.todaysPatients || 0, icon: Users, color: "bg-blue-500" },
    { title: "Total Appointments", value: stats?.totalAppointments || 0, icon: Calendar, color: "bg-emerald-500" },
    { title: "Pending Reports", value: stats?.pendingReports || 0, icon: ClipboardList, color: "bg-amber-500" },
    { title: "Surgeries", value: stats?.surgeries || 0, icon: Activity, color: "bg-purple-500" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold text-slate-800">Welcome Dr. {authUser?.fullName}</h1>
        <p className="text-slate-500 mt-1">Here is your daily overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayStats.map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${stat.color} mr-4 shadow-md`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium">{stat.title}</p>
              <h3 className="text-2xl font-bold text-slate-800">
                {isLoadingStats ? <Loader2 className="w-5 h-5 animate-spin text-slate-400" /> : stat.value}
              </h3>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 min-h-[300px]">
        <h2 className="text-lg font-semibold text-slate-800 border-b border-slate-100 pb-4 mb-4">
          Today's Schedule
        </h2>
        <div className="flex flex-col items-center justify-center h-48 text-slate-400">
          <Calendar className="w-12 h-12 mb-3 text-slate-300" />
          <p>Your schedule will appear here.</p>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
