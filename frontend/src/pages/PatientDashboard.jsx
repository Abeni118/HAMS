import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useDashboardStore } from "../store/useDashboardStore";
import { Calendar, Clock, FileText, Activity, Loader2, MoreVertical } from "lucide-react";

const PatientDashboard = () => {
  const { authUser } = useAuthStore();
  const { stats, upcomingSchedule, isLoadingStats, isLoadingUpcoming, fetchAll } = useDashboardStore();

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const displayStats = [
    { title: "Upcoming Appointments", value: stats?.upcomingAppointments || 0, icon: Calendar, color: "bg-blue-500" },
    { title: "Past Visits", value: stats?.completedVisits || 0, icon: Clock, color: "bg-emerald-500" },
    { title: "Lab Reports", value: stats?.reportsCount || 0, icon: FileText, color: "bg-purple-500" },
    { title: "Pending Approvals", value: stats?.pendingAppointments || 0, icon: Activity, color: "bg-amber-500" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold text-slate-800">Welcome back, {authUser?.fullName}!</h1>
        <p className="text-slate-500 mt-1">Here is a summary of your health dashboard.</p>
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
          Upcoming Appointments
        </h2>
        {isLoadingUpcoming ? (
          <div className="flex justify-center items-center h-48"><Loader2 className="w-8 h-8 animate-spin text-[#698bf4]" /></div>
        ) : upcomingSchedule && upcomingSchedule.length > 0 ? (
          <div className="space-y-4">
            {upcomingSchedule.map((apt) => (
              <div key={apt._id} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-indigo-50 flex items-center justify-center text-[#698bf4] font-bold">
                    {apt.doctorId?.profilePic ? (
                      <img src={apt.doctorId.profilePic} alt="" className="w-full h-full object-cover" />
                    ) : (
                      apt.doctorId?.fullName?.charAt(0) || "D"
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800">Dr. {apt.doctorId?.fullName}</h4>
                    <p className="text-xs text-slate-500">{apt.department}</p>
                  </div>
                </div>
                <div className="text-right flex items-center gap-6">
                  <div>
                    <p className="text-sm font-bold text-slate-800">{apt.date}</p>
                    <p className="text-xs text-slate-500">{apt.timeSlot}</p>
                  </div>
                  <button className="text-slate-400 hover:text-[#698bf4] transition-colors"><MoreVertical className="w-5 h-5"/></button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-48 text-slate-400">
            <Calendar className="w-12 h-12 mb-3 text-slate-300" />
            <p>You have no appointments scheduled.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientDashboard;
