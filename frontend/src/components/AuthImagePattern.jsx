import { CalendarCheck, Stethoscope, Activity, Users, ClipboardList, BarChart3 } from "lucide-react";

const AuthImagePattern = () => {
  // Grid layout mapping to match the 3x3 icon grid
  const gridCells = [
    { id: 1, icon: CalendarCheck, active: false },
    { id: 2, icon: null, active: false },
    { id: 3, icon: Stethoscope, active: false },
    { id: 4, icon: null, active: false },
    { id: 5, icon: Activity, active: true },
    { id: 6, icon: Users, active: false },
    { id: 7, icon: ClipboardList, active: false },
    { id: 8, icon: null, active: false },
    { id: 9, icon: BarChart3, active: false },
  ];

  return (
    <div className="hidden lg:flex flex-col items-center justify-center bg-slate-200/50 p-12 relative overflow-hidden">
      <div className="max-w-md w-full text-center z-10 relative">
        <div className="grid grid-cols-3 gap-4 mb-12 p-8">
          {gridCells.map((cell) => (
            <div
              key={cell.id}
              className={`aspect-square rounded-2xl flex items-center justify-center transition-all ${
                cell.active
                  ? "bg-[#8ea7f7] shadow-lg shadow-[#698bf4]/20 scale-105"
                  : "bg-slate-300/50"
              }`}
            >
              {cell.icon && (
                <cell.icon className={`w-8 h-8 ${cell.active ? "text-[#1d3557]" : "text-[#5a7dec]"}`} />
              )}
            </div>
          ))}
        </div>
        
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-slate-800">Hospital Appointment Management</h2>
          <p className="text-slate-500 max-w-sm mx-auto">
            Securely access your dashboard, manage appointments, and view critical health data all in one place.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthImagePattern;
