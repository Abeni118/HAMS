import { useState, useEffect } from "react";
import { 
  FileText, Search, Plus, Loader2, Download, Eye, Trash2, 
  X, UploadCloud, File, AlertCircle, FileJson, Stethoscope 
} from "lucide-react";
import { useReportStore } from "../../store/useReportStore";
import { usePatientStore } from "../../store/usePatientStore";
import toast from "react-hot-toast";

const categories = ["Lab Result", "Prescription", "Imaging", "Clinical Note", "Diagnostics", "Other"];

const ReportsPage = () => {
  const { 
    reports, isFetchingReports, isDownloading, isUploading, isUpdating,
    fetchDoctorReports, downloadReport, deleteReport, uploadReportFile, createReport 
  } = useReportStore();

  const { patients, fetchDoctorPatients } = usePatientStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  
  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    patientId: "", title: "", category: "Clinical Note", diagnosis: "", 
    symptoms: "", recommendations: "", prescription: "", notes: "", 
    department: "General", status: "Final"
  });
  const [fileToUpload, setFileToUpload] = useState(null);

  useEffect(() => {
    fetchDoctorReports();
    fetchDoctorPatients();
  }, [fetchDoctorReports, fetchDoctorPatients]);

  const filteredReports = reports.filter(r => {
    const matchesSearch = r.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          r.patientId?.fullName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "All" || r.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Max 10MB
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size must be less than 10MB");
      return;
    }
    setFileToUpload(file);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!formData.patientId || !formData.title) {
      toast.error("Patient and Title are required");
      return;
    }

    let fileData = null;
    if (fileToUpload) {
      fileData = await uploadReportFile(fileToUpload);
      if (!fileData) return; // Upload failed, toast already shown
    }

    const reportPayload = {
      ...formData,
      ...(fileData && { fileUrl: fileData.fileUrl, fileType: fileData.fileType, size: fileData.size })
    };

    const success = await createReport(reportPayload);
    if (success) {
      setShowCreateModal(false);
      setFormData({
        patientId: "", title: "", category: "Clinical Note", diagnosis: "", 
        symptoms: "", recommendations: "", prescription: "", notes: "", 
        department: "General", status: "Final"
      });
      setFileToUpload(null);
    }
  };

  const openViewModal = (report) => {
    setSelectedReport(report);
    setShowViewModal(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Medical Reports</h1>
          <p className="text-sm text-slate-500 mt-1">Create, manage, and share diagnostic reports for your patients.</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="px-5 py-2.5 bg-[#698bf4] text-white rounded-xl text-sm font-medium hover:bg-[#5a7dec] transition-colors flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" /> Create Report
        </button>
      </div>

      {/* Stats & Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex gap-4 items-center px-4 w-full md:w-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-[#698bf4]">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Reports</p>
              <p className="text-lg font-bold text-slate-800">{reports.length}</p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search reports..." 
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#698bf4] focus:ring-1 focus:ring-[#698bf4]" 
            />
          </div>
          <select 
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-[#698bf4] focus:ring-1 focus:ring-[#698bf4]"
          >
            <option value="All">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500 font-bold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Report Details</th>
                <th className="px-6 py-4">Patient</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isFetchingReports ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#698bf4]" />
                  </td>
                </tr>
              ) : filteredReports.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                    No reports found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredReports.map((report) => (
                  <tr key={report._id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-indigo-50 text-[#698bf4] flex items-center justify-center shrink-0">
                          {report.category === 'Imaging' ? <FileJson className="w-5 h-5"/> : <FileText className="w-5 h-5" />}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{report.title}</p>
                          <p className="text-xs text-slate-500 line-clamp-1">{report.diagnosis || report.notes || 'No description'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <img src={report.patientId?.profilePic || "/avatar.png"} alt="pt" className="w-6 h-6 rounded-full object-cover" />
                        <span className="font-medium text-slate-700">{report.patientId?.fullName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md text-xs font-medium border border-slate-200">
                        {report.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {formatDate(report.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        report.status === "Final" ? "bg-green-50 text-green-700 border-green-200" :
                        report.status === "Pending Review" ? "bg-amber-50 text-amber-700 border-amber-200" :
                        "bg-slate-50 text-slate-700 border-slate-200"
                      }`}>
                        {report.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openViewModal(report)} className="p-1.5 text-slate-400 hover:text-[#698bf4] hover:bg-indigo-50 rounded-lg" title="View Details">
                          <Eye className="w-4 h-4" />
                        </button>
                        {report.fileUrl && (
                          <button 
                            disabled={isDownloading} 
                            onClick={() => downloadReport(report._id, `${report.title}.pdf`)} 
                            className="p-1.5 text-slate-400 hover:text-[#698bf4] hover:bg-indigo-50 rounded-lg" title="Download"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        )}
                        <button onClick={() => deleteReport(report._id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Report Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden my-auto relative flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#698bf4]" /> Create Medical Report
              </h2>
              <button onClick={() => {setShowCreateModal(false); setFileToUpload(null);}} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"><X className="w-5 h-5" /></button>
            </div>
            
            <form onSubmit={handleCreateSubmit} className="p-6 overflow-y-auto max-h-[70vh] space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Select Patient *</label>
                  <select 
                    required 
                    value={formData.patientId} 
                    onChange={e => setFormData({...formData, patientId: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#698bf4] outline-none"
                  >
                    <option value="" disabled>Select a patient...</option>
                    {patients.map(p => <option key={p._id} value={p._id}>{p.fullName}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Category *</label>
                  <select 
                    required 
                    value={formData.category} 
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#698bf4] outline-none"
                  >
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Report Title *</label>
                <input 
                  required type="text" placeholder="e.g. Annual Blood Panel"
                  value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#698bf4] outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Diagnosis</label>
                  <input 
                    type="text" placeholder="Primary diagnosis"
                    value={formData.diagnosis} onChange={e => setFormData({...formData, diagnosis: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#698bf4] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Status</label>
                  <select 
                    value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#698bf4] outline-none"
                  >
                    <option value="Final">Final</option>
                    <option value="Pending Review">Pending Review</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Clinical Notes & Findings</label>
                <textarea 
                  rows="3" placeholder="Detailed observations..."
                  value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#698bf4] outline-none"
                />
              </div>

              {/* File Upload Area */}
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Attach Document (Optional)</label>
                <div className="w-full border-2 border-dashed border-slate-300 rounded-xl p-6 bg-slate-50 hover:bg-slate-100 transition-colors text-center relative">
                  <input 
                    type="file" 
                    onChange={handleFileChange}
                    accept=".pdf,.jpg,.jpeg,.png,.webp"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                  />
                  {!fileToUpload ? (
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-3 shadow-sm border border-slate-200">
                        <UploadCloud className="w-6 h-6 text-[#698bf4]" />
                      </div>
                      <p className="text-sm font-bold text-slate-700">Click or drag file to upload</p>
                      <p className="text-xs text-slate-500 mt-1">PDF, JPG, PNG (Max 10MB)</p>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-10 h-10 bg-indigo-50 text-[#698bf4] rounded-lg flex items-center justify-center">
                        <File className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-bold text-slate-800 line-clamp-1">{fileToUpload.name}</p>
                        <p className="text-xs text-slate-500">{(fileToUpload.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 flex gap-3 border-t border-slate-100">
                <button type="button" onClick={() => {setShowCreateModal(false); setFileToUpload(null);}} className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-medium transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isUpdating || isUploading} className="flex-[2] py-2.5 px-4 bg-[#698bf4] hover:bg-[#5a7dec] text-white rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-70">
                  {(isUpdating || isUploading) ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Plus className="w-4 h-4"/> Create & Save Report</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Report Modal */}
      {showViewModal && selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden relative">
            <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 bg-indigo-100 text-[#698bf4] rounded text-[10px] font-bold uppercase tracking-wider border border-indigo-200">
                    {selectedReport.category}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">{formatDate(selectedReport.createdAt)}</span>
                </div>
                <h2 className="text-xl font-bold text-slate-800">{selectedReport.title}</h2>
              </div>
              <button onClick={() => setShowViewModal(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"><X className="w-5 h-5" /></button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <img src={selectedReport.patientId?.profilePic || "/avatar.png"} alt="pt" className="w-12 h-12 rounded-full border border-slate-200" />
                <div>
                  <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-0.5">Patient</p>
                  <p className="font-bold text-slate-800">{selectedReport.patientId?.fullName}</p>
                </div>
              </div>

              {selectedReport.diagnosis && (
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1"><Stethoscope className="w-3.5 h-3.5"/> Diagnosis</p>
                  <p className="text-sm text-slate-800 bg-red-50/50 p-3 rounded-lg border border-red-100">{selectedReport.diagnosis}</p>
                </div>
              )}

              {selectedReport.notes && (
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Clinical Notes</p>
                  <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">{selectedReport.notes}</p>
                </div>
              )}

              {selectedReport.fileUrl && (
                <div className="pt-4 border-t border-slate-100">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Attached Document</p>
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-[#698bf4]/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-100 text-[#698bf4] rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800 line-clamp-1">{selectedReport.title} Document</p>
                        <p className="text-xs text-slate-500">{selectedReport.size || 'Unknown Size'}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => downloadReport(selectedReport._id, `${selectedReport.title}.pdf`)}
                      disabled={isDownloading}
                      className="px-4 py-2 text-sm font-medium text-[#698bf4] bg-indigo-50 hover:bg-[#698bf4] hover:text-white rounded-lg transition-colors flex items-center gap-2"
                    >
                      {isDownloading ? <Loader2 className="w-4 h-4 animate-spin"/> : <Download className="w-4 h-4" />} Download
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default ReportsPage;
