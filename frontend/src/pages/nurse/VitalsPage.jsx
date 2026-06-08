import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useNurseStore } from "../../store/useNurseStore";
import { Activity, Search, Plus, Save, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";

const VitalsPage = () => {
  const { vitals, isFetchingVitals, fetchVitals, recordVitals, isRecordingVitals, patients, fetchPatients, isFetchingPatients } = useNurseStore();
  const [patientIdSearch, setPatientIdSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [patientSearchTerm, setPatientSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredPatients = (patients || []).filter(p => {
    if (!p) return false;
    const term = (patientSearchTerm || "").toLowerCase();
    return (
      p.fullName?.toLowerCase()?.includes(term) ||
      p.email?.toLowerCase()?.includes(term) ||
      p.medicalRecordNumber?.toLowerCase()?.includes(term)
    );
  });

  const location = useLocation();
  const prefilledPatientId = location.state?.patientId || "";
  
  const [formData, setFormData] = useState({
    patientId: prefilledPatientId,
    bloodPressure: "",
    temperature: "",
    heartRate: "",
    oxygenLevel: "",
    weight: "",
    height: "",
    bloodSugar: "",
    notes: ""
  });

  const selectedPatient = (patients || []).find(p => p && p._id === formData.patientId);

  const handleSearch = (e) => {
    e.preventDefault();
    if (patientIdSearch.trim()) {
      const term = patientIdSearch.toLowerCase().trim();
      // Only find exact or partial matches locally to resolve the ID securely
      const matchedPatient = (patients || []).find(p => 
        p && (
          p.fullName?.toLowerCase()?.includes(term) ||
          p.email?.toLowerCase()?.includes(term) ||
          p.medicalRecordNumber?.toLowerCase()?.includes(term)
        )
      );
      
      if (matchedPatient) {
        fetchVitals(matchedPatient._id);
      } else {
        toast.error("No patient found matching that search");
        // Clear vitals if no match
        useNurseStore.setState({ vitals: [] });
      }
    }
  };

  const handleRecordVitals = async (e) => {
    e.preventDefault();
    if (!formData.patientId) {
      toast.error("Please select a patient");
      return;
    }
    const success = await recordVitals(formData);
    if (success) {
      setShowForm(false);
      setFormData({
        patientId: formData.patientId, // Keep patient ID for continuous entry
        bloodPressure: "",
        temperature: "",
        heartRate: "",
        oxygenLevel: "",
        weight: "",
        height: "",
        bloodSugar: "",
        notes: ""
      });
      fetchVitals(formData.patientId);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Patient Vitals</h1>
          <p className="text-slate-500 mt-1">Record and monitor patient vitals.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-[#698bf4] text-white px-4 py-2 rounded-xl hover:bg-[#5879e2] transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Record Vitals</span>
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h2 className="text-lg font-semibold text-slate-800 border-b border-slate-100 pb-4 mb-4">
            New Vitals Entry
          </h2>
          <form onSubmit={handleRecordVitals} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-1 relative" ref={dropdownRef}>
                <label className="text-sm font-medium text-slate-700">Patient</label>
                <div 
                  className={`w-full px-4 py-2 border border-slate-200 rounded-xl flex items-center justify-between ${prefilledPatientId ? 'bg-slate-100 cursor-not-allowed' : 'bg-white cursor-pointer focus-within:ring-2 focus-within:ring-[#698bf4] focus-within:border-transparent'}`}
                  onClick={() => !prefilledPatientId && setIsDropdownOpen(!isDropdownOpen)}
                >
                  <span className={`truncate ${!selectedPatient ? 'text-slate-400' : 'text-slate-800'}`}>
                    {selectedPatient ? `${selectedPatient.fullName} (${selectedPatient.email})` : "Select a patient"}
                  </span>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </div>
                
                {isDropdownOpen && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 flex flex-col">
                    <div className="p-2 border-b border-slate-100">
                      <div className="relative">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <input
                          type="text"
                          className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-[#698bf4]"
                          placeholder="Search name, email, MRN..."
                          value={patientSearchTerm}
                          onChange={(e) => setPatientSearchTerm(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    </div>
                    <div className="overflow-y-auto">
                      {isFetchingPatients ? (
                        <div className="p-4 text-center text-sm text-slate-500">Loading patients...</div>
                      ) : filteredPatients.length > 0 ? (
                        filteredPatients.map(p => (
                          <div 
                            key={p._id}
                            className="px-4 py-3 hover:bg-slate-50 cursor-pointer border-b border-slate-50 last:border-0"
                            onClick={() => {
                              setFormData({ ...formData, patientId: p._id });
                              setIsDropdownOpen(false);
                              setPatientSearchTerm("");
                            }}
                          >
                            <div className="font-medium text-slate-800 truncate">{p.fullName}</div>
                            <div className="text-xs text-slate-500 flex justify-between">
                              <span className="truncate mr-2">{p.email}</span>
                              {p.medicalRecordNumber && <span className="flex-shrink-0">MRN: {p.medicalRecordNumber}</span>}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-sm text-slate-500">
                          {patients.length === 0 ? "No patient accounts available" : "No patients match your search."}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Blood Pressure</label>
                <input 
                  type="text" 
                  name="bloodPressure" 
                  value={formData.bloodPressure} 
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#698bf4] focus:border-transparent outline-none"
                  placeholder="e.g. 120/80"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Heart Rate (bpm)</label>
                <input 
                  type="number" 
                  name="heartRate" 
                  value={formData.heartRate} 
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#698bf4] focus:border-transparent outline-none"
                  placeholder="e.g. 72"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Temperature (°C)</label>
                <input 
                  type="number" 
                  name="temperature" 
                  step="0.1"
                  value={formData.temperature} 
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#698bf4] focus:border-transparent outline-none"
                  placeholder="e.g. 36.5"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Oxygen Level (%)</label>
                <input 
                  type="number" 
                  name="oxygenLevel" 
                  value={formData.oxygenLevel} 
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#698bf4] focus:border-transparent outline-none"
                  placeholder="e.g. 98"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Weight (kg)</label>
                <input 
                  type="number" 
                  name="weight" 
                  step="0.1"
                  value={formData.weight} 
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#698bf4] focus:border-transparent outline-none"
                  placeholder="e.g. 70"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Height (cm)</label>
                <input 
                  type="number" 
                  name="height" 
                  value={formData.height} 
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#698bf4] focus:border-transparent outline-none"
                  placeholder="e.g. 175"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">Blood Sugar (mg/dL)</label>
                <input 
                  type="number" 
                  name="bloodSugar" 
                  value={formData.bloodSugar} 
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#698bf4] focus:border-transparent outline-none"
                  placeholder="e.g. 100"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Notes</label>
              <textarea 
                name="notes" 
                value={formData.notes} 
                onChange={handleChange}
                rows="2"
                className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#698bf4] focus:border-transparent outline-none resize-none"
                placeholder="Any additional observations..."
              ></textarea>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button 
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={isRecordingVitals}
                className="flex items-center gap-2 bg-[#698bf4] text-white px-6 py-2 rounded-xl hover:bg-[#5879e2] transition-colors disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{isRecordingVitals ? "Saving..." : "Save Vitals"}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-4 mb-4 gap-4">
          <h2 className="text-lg font-semibold text-slate-800">Vitals History</h2>
          <form onSubmit={handleSearch} className="relative w-full sm:w-64">
            <input 
              type="text" 
              value={patientIdSearch}
              onChange={(e) => setPatientIdSearch(e.target.value)}
              placeholder="Search patient by name, email, or medical record number" 
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#698bf4] focus:border-transparent outline-none text-sm"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          </form>
        </div>

        {isFetchingVitals ? (
          <div className="flex items-center justify-center h-48 text-[#698bf4]">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : vitals.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-500 text-sm">
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">BP</th>
                  <th className="pb-3 font-medium">Heart Rate</th>
                  <th className="pb-3 font-medium">Temp</th>
                  <th className="pb-3 font-medium">O2 Level</th>
                  <th className="pb-3 font-medium">Recorded By</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {vitals.map((record) => (
                  <tr key={record._id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                    <td className="py-4 text-slate-800">{new Date(record.createdAt).toLocaleString()}</td>
                    <td className="py-4 font-medium text-slate-700">{record.bloodPressure || "-"}</td>
                    <td className="py-4 text-slate-700">{record.heartRate ? `${record.heartRate} bpm` : "-"}</td>
                    <td className="py-4 text-slate-700">{record.temperature ? `${record.temperature}°C` : "-"}</td>
                    <td className="py-4 text-slate-700">{record.oxygenLevel ? `${record.oxygenLevel}%` : "-"}</td>
                    <td className="py-4 text-slate-600">{record.nurseId?.fullName || "Unknown"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-48 text-slate-400">
            <Activity className="w-12 h-12 mb-3 text-slate-300" />
            <p>No vitals records found. Search by patient ID to view history.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VitalsPage;
