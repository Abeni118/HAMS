import { useState, useEffect } from "react";
import { 
  Users, Search, Filter, Loader2, User, Activity, Clock, 
  FileText, Calendar, Plus, X, Stethoscope, FileJson, Pill
} from "lucide-react";
import { usePatientStore } from "../../store/usePatientStore";
import toast from "react-hot-toast";

const PatientsPage = () => {
  const { 
    patients, selectedPatient, patientHistory, patientReports,
    isLoadingPatients, isLoadingDetails, isUpdatingConsultation,
    fetchDoctorPatients, fetchPatientDetails, clearSelectedPatient,
    createConsultation, deleteConsultation
  } = usePatientStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("overview"); // overview, consultations, history, reports
  
  // Consultation form state
  const [showConsultForm, setShowConsultForm] = useState(false);
  const [consultForm, setConsultForm] = useState({
    diagnosis: "",
    symptoms: "",
    prescriptions: "",
    recommendations: "",
    followUpDate: "",
    notes: ""
  });

  useEffect(() => {
    fetchDoctorPatients();
  }, [fetchDoctorPatients]);

  const filteredPatients = patients.filter(p => 
    p.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePatientClick = (patient) => {
    fetchPatientDetails(patient._id);
    setActiveTab("overview");
  };

  const handleConsultSubmit = async (e) => {
    e.preventDefault();
    if (!consultForm.diagnosis || !consultForm.symptoms) {
      toast.error("Diagnosis and symptoms are required");
      return;
    }
    
    // Convert symptoms string to array
    const dataToSubmit = {
      ...consultForm,
      patientId: selectedPatient._id,
      symptoms: consultForm.symptoms.split(',').map(s => s.trim())
    };

    const success = await createConsultation(dataToSubmit);
    if (success) {
      setShowConsultForm(false);
      setConsultForm({
        diagnosis: "", symptoms: "", prescriptions: "", 
        recommendations: "", followUpDate: "", notes: ""
      });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString || dateString === "N/A") return "N/A";
    const date = new Date(dateString);
    return isNaN(date) ? dateString : date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">My Patients</h1>
          <p className="text-sm text-slate-500 mt-1">Manage records, consultations, and history for your assigned patients.</p>
        </div>
      </div>

      {/* Stats & Search */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex gap-4 items-center px-4 w-full md:w-auto">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center text-[#698bf4]">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase">Total Patients</p>
              <p className="text-lg font-bold text-slate-800">{patients.length}</p>
            </div>
          </div>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by patient name..." 
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#698bf4] focus:ring-1 focus:ring-[#698bf4]" 
            />
          </div>
        </div>
      </div>

      {/* Patients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoadingPatients ? (
          [...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 p-6 h-[180px] animate-pulse">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-slate-200"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))
        ) : filteredPatients.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-500">No patients found.</div>
        ) : (
          filteredPatients.map((patient) => (
            <div 
              key={patient._id} 
              onClick={() => handlePatientClick(patient)}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 hover:shadow-md hover:border-[#698bf4]/30 transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-4 mb-4">
                <img 
                  src={patient.profilePic || "/avatar.png"} 
                  alt={patient.fullName} 
                  className="w-14 h-14 rounded-full object-cover border border-slate-100"
                />
                <div>
                  <h3 className="font-bold text-slate-800 group-hover:text-[#698bf4] transition-colors">{patient.fullName}</h3>
                  <p className="text-xs text-slate-500">{patient.age ? `${patient.age} yrs • ` : ''}{patient.gender || 'Unknown'}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-slate-100">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Blood Type</p>
                  <p className="text-sm font-semibold text-slate-700">{patient.bloodType || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Last Visit</p>
                  <p className="text-sm font-semibold text-slate-700">{formatDate(patient.lastAppointment)}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Patient Detail Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl overflow-hidden my-auto relative min-h-[600px] flex flex-col">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
              <div className="flex items-center gap-5">
                <img 
                  src={selectedPatient.profilePic || "/avatar.png"} 
                  alt={selectedPatient.fullName} 
                  className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-sm"
                />
                <div>
                  <h2 className="text-xl font-bold text-slate-800 pr-8">{selectedPatient.fullName}</h2>
                  <div className="flex items-center gap-3 mt-1 text-sm font-medium text-slate-500">
                    <span>{selectedPatient.gender || 'Unknown'}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                    <span>DOB: {selectedPatient.dateOfBirth || 'N/A'}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                    <span>Blood: <strong className="text-red-500">{selectedPatient.bloodType || 'N/A'}</strong></span>
                  </div>
                </div>
              </div>
              <button 
                onClick={clearSelectedPatient}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-slate-200 bg-white px-6">
              {[
                { id: "overview", label: "Overview", icon: User },
                { id: "consultations", label: "Consultations", icon: Stethoscope },
                { id: "history", label: "Appointments", icon: Calendar },
                { id: "reports", label: "Reports", icon: FileJson },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-4 text-sm font-bold border-b-2 transition-colors ${
                    activeTab === tab.id 
                      ? "border-[#698bf4] text-[#698bf4]" 
                      : "border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <tab.icon className="w-4 h-4" /> {tab.label}
                </button>
              ))}
            </div>

            {/* Modal Body */}
            <div className="p-6 bg-slate-50/30 flex-1 overflow-y-auto">
              {isLoadingDetails ? (
                <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-[#698bf4]" /></div>
              ) : (
                <>
                  {/* OVERVIEW TAB */}
                  {activeTab === "overview" && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                          <h4 className="flex items-center gap-2 font-bold text-slate-800 mb-4">
                            <Activity className="w-4 h-4 text-red-500" /> Allergies
                          </h4>
                          {selectedPatient.allergies?.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {selectedPatient.allergies.map((a, i) => (
                                <span key={i} className="px-2.5 py-1 bg-red-50 text-red-700 rounded-md text-xs font-bold border border-red-100">{a}</span>
                              ))}
                            </div>
                          ) : <p className="text-sm text-slate-500">No known allergies</p>}
                        </div>

                        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                          <h4 className="flex items-center gap-2 font-bold text-slate-800 mb-4">
                            <Pill className="w-4 h-4 text-blue-500" /> Current Medications
                          </h4>
                          {selectedPatient.currentMedications?.length > 0 ? (
                            <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
                              {selectedPatient.currentMedications.map((m, i) => <li key={i}>{m}</li>)}
                            </ul>
                          ) : <p className="text-sm text-slate-500">No current medications</p>}
                        </div>
                        
                        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm md:col-span-2">
                          <h4 className="flex items-center gap-2 font-bold text-slate-800 mb-4">
                            <Stethoscope className="w-4 h-4 text-indigo-500" /> Medical Conditions
                          </h4>
                          {selectedPatient.medicalConditions?.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {selectedPatient.medicalConditions.map((c, i) => (
                                <span key={i} className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-md text-xs font-bold border border-indigo-100">{c}</span>
                              ))}
                            </div>
                          ) : <p className="text-sm text-slate-500">No pre-existing conditions reported</p>}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* CONSULTATIONS TAB */}
                  {activeTab === "consultations" && (
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <h3 className="font-bold text-slate-800">Clinical Notes</h3>
                        <button 
                          onClick={() => setShowConsultForm(!showConsultForm)}
                          className="px-4 py-2 bg-[#698bf4] text-white text-sm font-medium rounded-lg hover:bg-[#5a7dec] transition-colors flex items-center gap-2"
                        >
                          {showConsultForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                          {showConsultForm ? "Cancel" : "New Note"}
                        </button>
                      </div>

                      {showConsultForm && (
                        <form onSubmit={handleConsultSubmit} className="bg-white p-6 rounded-xl border border-[#698bf4]/30 shadow-sm space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Diagnosis *</label>
                              <input required value={consultForm.diagnosis} onChange={e => setConsultForm({...consultForm, diagnosis: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-1 focus:ring-[#698bf4] outline-none" placeholder="e.g. Acute Bronchitis" />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Symptoms * (comma separated)</label>
                              <input required value={consultForm.symptoms} onChange={e => setConsultForm({...consultForm, symptoms: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-1 focus:ring-[#698bf4] outline-none" placeholder="e.g. Cough, Fever" />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Prescriptions</label>
                            <input value={consultForm.prescriptions} onChange={e => setConsultForm({...consultForm, prescriptions: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-1 focus:ring-[#698bf4] outline-none" placeholder="Medication details..." />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Clinical Notes</label>
                            <textarea value={consultForm.notes} onChange={e => setConsultForm({...consultForm, notes: e.target.value})} rows="3" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-1 focus:ring-[#698bf4] outline-none" placeholder="Additional observations..."></textarea>
                          </div>
                          <button disabled={isUpdatingConsultation} type="submit" className="px-5 py-2.5 bg-slate-800 text-white text-sm font-medium rounded-lg hover:bg-slate-700 transition-colors flex items-center justify-center gap-2">
                            {isUpdatingConsultation ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Consultation"}
                          </button>
                        </form>
                      )}

                      <div className="space-y-4">
                        {patientHistory.consultations.length === 0 ? (
                          <div className="text-center py-8 text-slate-500">No consultation records found.</div>
                        ) : (
                          patientHistory.consultations.map(c => (
                            <div key={c._id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative group">
                              <button onClick={() => deleteConsultation(c._id)} className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-red-600 bg-slate-50 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"><X className="w-4 h-4"/></button>
                              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-3 uppercase tracking-wider">
                                <Clock className="w-3.5 h-3.5" /> {formatDate(c.createdAt)}
                              </div>
                              <h4 className="font-bold text-slate-800 text-lg mb-2">{c.diagnosis || 'General Consultation'}</h4>
                              <div className="flex flex-wrap gap-2 mb-4">
                                {c.symptoms.map((s, i) => <span key={i} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-xs font-medium">{s}</span>)}
                              </div>
                              {c.prescriptions && <p className="text-sm text-slate-700 mb-2"><strong>Rx:</strong> {c.prescriptions}</p>}
                              {c.notes && <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">{c.notes}</p>}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}

                  {/* HISTORY TAB */}
                  {activeTab === "history" && (
                    <div className="space-y-4">
                      {patientHistory.appointments.length === 0 ? (
                        <div className="text-center py-8 text-slate-500">No appointment history.</div>
                      ) : (
                        patientHistory.appointments.map(apt => (
                          <div key={apt._id} className="bg-white p-4 rounded-xl border border-slate-200 flex justify-between items-center">
                            <div>
                              <p className="font-bold text-slate-800">{apt.date} at {apt.timeSlot}</p>
                              <p className="text-sm text-slate-500">Dept: {apt.department}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${
                              apt.status === "Completed" ? "bg-blue-50 text-blue-700 border-blue-200" :
                              apt.status === "Approved" ? "bg-green-50 text-green-700 border-green-200" :
                              "bg-slate-100 text-slate-600 border-slate-200"
                            }`}>{apt.status}</span>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {/* REPORTS TAB */}
                  {activeTab === "reports" && (
                    <div className="space-y-4">
                      {patientReports.length === 0 ? (
                        <div className="text-center py-8 text-slate-500">No medical reports available.</div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {patientReports.map(report => (
                            <div key={report._id} className="bg-white p-4 rounded-xl border border-slate-200 flex items-start gap-4">
                              <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-[#698bf4] shrink-0">
                                <FileText className="w-5 h-5" />
                              </div>
                              <div>
                                <h4 className="font-bold text-slate-800 text-sm">{report.title}</h4>
                                <p className="text-xs text-slate-500 mt-0.5">{report.category} • {formatDate(report.createdAt)}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default PatientsPage;
