import { useState, useEffect } from "react";
import { FileText, Search, Download, FileJson, Filter, Clock, CheckCircle2, X, Activity, User, Info, Calendar } from "lucide-react";
import { useReportStore } from "../../store/useReportStore";

const ReportsPage = () => {
  const { reports, isFetchingReports, fetchPatientReports, downloadReport, isDownloading } = useReportStore();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All Reports");
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    fetchPatientReports();
  }, [fetchPatientReports]);

  const handleDownload = (e, report) => {
    e.stopPropagation(); // prevent modal opening
    downloadReport(report._id, `${report.title.replace(/\s+/g, "_")}.pdf`);
  };

  const filteredReports = reports.filter((report) => {
    const matchesSearch = 
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      report.doctorId?.fullName?.toLowerCase().includes(searchTerm.toLowerCase());
      
    if (activeFilter === "All Reports") return matchesSearch;
    if (activeFilter === "Lab Results" && report.category === "Lab Result") return matchesSearch;
    if (activeFilter === "Prescriptions" && report.category === "Prescription") return matchesSearch;
    if (activeFilter === "Imaging" && report.category === "Imaging") return matchesSearch;
    
    // Fallback if category precisely matches
    if (report.category === activeFilter) return matchesSearch;
    
    return false;
  });

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown Date";
    return new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Medical Reports</h1>
          <p className="text-sm text-slate-500 mt-1">Access your lab results, prescriptions, and clinical notes</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
          {["All Reports", "Lab Results", "Prescriptions", "Imaging"].map(filter => (
            <button 
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                activeFilter === filter ? "bg-[#e0e7ff] text-[#698bf4]" : "hover:bg-slate-50 text-slate-600"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search reports or doctor..." 
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#698bf4] focus:ring-1 focus:ring-[#698bf4]" 
            />
          </div>
          <button className="flex items-center justify-center p-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isFetchingReports ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 h-[160px] animate-pulse">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-12 h-12 rounded-xl bg-slate-200"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                </div>
              </div>
              <div className="h-10 bg-slate-100 rounded-xl mt-4"></div>
            </div>
          ))
        ) : filteredReports.length === 0 ? (
          <div className="col-span-full py-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-700">No reports found</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-sm">We couldn't find any medical records matching your current filters or search query.</p>
          </div>
        ) : (
          filteredReports.map((report) => (
            <div 
              key={report._id} 
              onClick={() => setSelectedReport(report)}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md hover:border-[#698bf4]/30 transition-all group cursor-pointer"
            >
              <div className="p-5 border-b border-slate-100 flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                  <FileJson className="w-6 h-6 text-[#698bf4]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-800 text-base truncate" title={report.title}>{report.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 truncate">By {report.doctorId?.fullName || "Unknown Doctor"}</p>
                </div>
              </div>
              <div className="p-5 bg-slate-50/50 group-hover:bg-[#f8faff] transition-colors">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Clock className="w-3.5 h-3.5" />
                    {formatDate(report.createdAt)}
                  </div>
                  <span className={`flex items-center gap-1 text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-full border ${
                    report.status === 'Final' 
                      ? 'bg-green-50 text-green-700 border-green-200' 
                      : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                  }`}>
                    {report.status === 'Final' ? <CheckCircle2 className="w-3 h-3" /> : null}
                    {report.status}
                  </span>
                </div>
                
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs font-medium text-slate-400 bg-white px-2 py-1 rounded border border-slate-100">
                    {report.category} • {report.size || "Unknown Size"}
                  </span>
                  <button 
                    onClick={(e) => handleDownload(e, report)}
                    className="p-2 text-[#698bf4] bg-[#e0e7ff] hover:bg-[#698bf4] hover:text-white rounded-lg transition-colors group-hover:scale-105 group-hover:shadow-sm"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}

        <div className="bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300 p-6 flex flex-col items-center justify-center text-center hover:bg-slate-100 transition-colors cursor-pointer min-h-[220px]">
          <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm mb-4">
            <FileText className="w-6 h-6 text-slate-400" />
          </div>
          <h3 className="font-bold text-slate-700 mb-1">Request Past Records</h3>
          <p className="text-xs text-slate-500 max-w-[200px]">Don't see an older report? Request it from the hospital archives.</p>
        </div>
      </div>

      {/* Report Details Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden my-auto relative">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm shrink-0">
                  <FileJson className="w-6 h-6 text-[#698bf4]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800 pr-8 leading-tight">{selectedReport.title}</h2>
                  <div className="flex items-center gap-3 mt-2 text-sm font-medium text-slate-500">
                    <span className="flex items-center gap-1.5"><User className="w-4 h-4" /> {selectedReport.doctorId?.fullName || "Unknown"}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                    <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> {formatDate(selectedReport.createdAt)}</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setSelectedReport(null)}
                className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block mb-1">Category</span>
                  <span className="text-sm font-semibold text-slate-700">{selectedReport.category}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block mb-1">Status</span>
                  <span className={`text-sm font-semibold ${selectedReport.status === 'Final' ? 'text-green-600' : 'text-yellow-600'}`}>
                    {selectedReport.status}
                  </span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block mb-1">Department</span>
                  <span className="text-sm font-semibold text-slate-700">{selectedReport.department}</span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block mb-1">File Size</span>
                  <span className="text-sm font-semibold text-slate-700">{selectedReport.size || "PDF"}</span>
                </div>
              </div>

              {selectedReport.description && (
                <div>
                  <h4 className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-2">
                    <Info className="w-4 h-4 text-[#698bf4]" /> Description
                  </h4>
                  <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                    {selectedReport.description}
                  </p>
                </div>
              )}

              {selectedReport.diagnosis && (
                <div>
                  <h4 className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-2">
                    <Activity className="w-4 h-4 text-[#698bf4]" /> Clinical Diagnosis
                  </h4>
                  <p className="text-sm text-slate-600 leading-relaxed bg-red-50/50 p-4 rounded-xl border border-red-100/50">
                    {selectedReport.diagnosis}
                  </p>
                </div>
              )}

              {selectedReport.notes && (
                <div>
                  <h4 className="flex items-center gap-2 text-sm font-bold text-slate-800 mb-2">
                    <FileText className="w-4 h-4 text-[#698bf4]" /> Additional Notes
                  </h4>
                  <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                    {selectedReport.notes}
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 rounded-b-2xl">
              <button 
                onClick={() => setSelectedReport(null)}
                className="px-5 py-2.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors shadow-sm"
              >
                Close
              </button>
              <button 
                onClick={(e) => handleDownload(e, selectedReport)}
                disabled={isDownloading}
                className="px-5 py-2.5 text-sm font-medium text-white bg-[#698bf4] hover:bg-[#5a7dec] border border-transparent rounded-xl transition-all shadow-sm shadow-[#698bf4]/20 flex items-center gap-2 disabled:opacity-70"
              >
                <Download className="w-4 h-4" />
                {isDownloading ? "Downloading..." : "Download Report"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ReportsPage;
