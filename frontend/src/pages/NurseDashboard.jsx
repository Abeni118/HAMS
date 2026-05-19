import { useAuthStore } from "../store/useAuthStore";
import { Users, Activity, FileText, ClipboardList } from "lucide-react";

const NurseDashboard = () => {
  const { authUser } = useAuthStore();

  const stats = [
    { title: "Patients in Queue", value: "12", icon: Users, color: "bg-blue-500" },
    { title: "Vitals Recorded", value: "45", icon: Activity, color: "bg-emerald-500" },
    { title: "Pending Tasks", value: "8", icon: ClipboardList, color: "bg-amber-500" },
    { title: "Reports Filed", value: "14", icon: FileText, color: "bg-purple-500" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold text-slate-800">Welcome Nurse {authUser?.fullName}</h1>
        <p className="text-slate-500 mt-1">Here is your shift overview.</p>
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
          Patient Queue
        </h2>
        <div className="flex flex-col items-center justify-center h-48 text-slate-400">
          <Users className="w-12 h-12 mb-3 text-slate-300" />
          <p>No patients currently in queue.</p>
        </div>
      </div>
    </div>
  );
};

export default NurseDashboard;
