import { useState, useEffect } from "react";
import { useNurseStore } from "../../store/useNurseStore";
import { FileText, Download, Filter, Search } from "lucide-react";

const ReportsPage = () => {
  const { stats, fetchStats } = useNurseStore();
  const [dateRange, setDateRange] = useState("today");

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Nurse Reports</h1>
          <p className="text-slate-500 mt-1">View activity logs and shift reports.</p>
        </div>
        <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
          <Download className="w-5 h-5" />
          <span>Export PDF</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-4 mb-4 gap-4">
          <h2 className="text-lg font-semibold text-slate-800">Activity Summary</h2>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-48">
              <select 
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#698bf4] focus:border-transparent outline-none text-sm appearance-none cursor-pointer bg-white"
              >
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
              <Filter className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
            <p className="text-slate-500 text-sm font-medium mb-1">Vitals Recorded</p>
            <h3 className="text-3xl font-bold text-slate-800">{stats?.vitalsRecordedToday || 0}</h3>
          </div>
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
            <p className="text-slate-500 text-sm font-medium mb-1">Tasks Completed</p>
            <h3 className="text-3xl font-bold text-slate-800">{stats?.tasksCompleted || 0}</h3>
          </div>
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
            <p className="text-slate-500 text-sm font-medium mb-1">Total Vitals History</p>
            <h3 className="text-3xl font-bold text-slate-800">{stats?.totalVitalsRecorded || 0}</h3>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center h-48 text-slate-400 border-t border-dashed border-slate-200 pt-6">
          <FileText className="w-12 h-12 mb-3 text-slate-300" />
          <p>Detailed shift logs will appear here. Select a date range to filter.</p>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
