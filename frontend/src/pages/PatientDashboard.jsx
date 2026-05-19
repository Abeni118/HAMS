import { useAuthStore } from "../store/useAuthStore";
import { Calendar, Clock, FileText, Activity } from "lucide-react";

const PatientDashboard = () => {
  const { authUser } = useAuthStore();

  const stats = [
    { title: "Upcoming Appointments", value: "2", icon: Calendar, color: "bg-blue-500" },
    { title: "Past Visits", value: "14", icon: Clock, color: "bg-emerald-500" },
    { title: "Lab Reports", value: "3", icon: FileText, color: "bg-purple-500" },
    { title: "Prescriptions", value: "5", icon: Activity, color: "bg-amber-500" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold text-slate-800">Welcome back, {authUser?.fullName}!</h1>
        <p className="text-slate-500 mt-1">Here is a summary of your health dashboard.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white ${stat.color} mr-4 shadow-md`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium">{stat.title}</p>
              <h3 className="text-2xl font-bold text-slate-800">{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 min-h-[300px]">
        <h2 className="text-lg font-semibold text-slate-800 border-b border-slate-100 pb-4 mb-4">
          Upcoming Appointments
        </h2>
        <div className="flex flex-col items-center justify-center h-48 text-slate-400">
          <Calendar className="w-12 h-12 mb-3 text-slate-300" />
          <p>You have no appointments today.</p>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;
