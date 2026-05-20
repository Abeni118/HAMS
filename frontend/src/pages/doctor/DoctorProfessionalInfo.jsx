import { BookOpen, Briefcase, Clock, AlertCircle } from "lucide-react";

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const DoctorProfessionalInfo = ({ formData, handleChange, handleWorkingDaysToggle }) => {
  return (
    <>
      {/* Professional Qualifications */}
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
          <BookOpen className="w-5 h-5 text-[#698bf4]" /> Professional Qualifications
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Education Level</label>
            <select name="educationLevel" value={formData.educationLevel} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#698bf4] outline-none">
              <option value="">Select Level</option>
              <option value="MBBS">MBBS</option>
              <option value="MD">MD</option>
              <option value="MSc">MSc</option>
              <option value="PhD">PhD</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Degree Name</label>
            <input type="text" name="degree" placeholder="e.g. Doctor of Medicine" value={formData.degree} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#698bf4] outline-none" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Institution/University</label>
            <input type="text" name="institution" placeholder="University name" value={formData.institution} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#698bf4] outline-none" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Graduation Year</label>
            <input type="text" name="graduationYear" placeholder="YYYY" value={formData.graduationYear} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#698bf4] outline-none" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Biography / About</label>
            <textarea name="biography" rows="3" placeholder="Brief professional biography..." value={formData.biography} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#698bf4] outline-none"></textarea>
          </div>
        </div>
      </div>

      {/* Hospital Affiliation & Practice */}
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
          <Briefcase className="w-5 h-5 text-[#698bf4]" /> Clinical Practice Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Specialization</label>
            <input type="text" name="specialization" placeholder="e.g. Cardiology" value={formData.specialization} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#698bf4] outline-none" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Department</label>
            <select name="department" value={formData.department} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#698bf4] outline-none">
              <option value="">Select Department</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Neurology">Neurology</option>
              <option value="Orthopedics">Orthopedics</option>
              <option value="Pediatrics">Pediatrics</option>
              <option value="General Surgery">General Surgery</option>
              <option value="Internal Medicine">Internal Medicine</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Medical License Number</label>
            <input type="text" name="medicalLicenseNumber" placeholder="MD-XXXX-XXXX" value={formData.medicalLicenseNumber} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#698bf4] outline-none" />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Years of Experience</label>
            <input type="number" name="yearsOfExperience" min="0" value={formData.yearsOfExperience} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#698bf4] outline-none" />
          </div>
        </div>
      </div>

      {/* Availability Preferences */}
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
          <Clock className="w-5 h-5 text-[#698bf4]" /> Availability & Scheduling
        </h3>
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Working Days</label>
            <div className="flex flex-wrap gap-3">
              {DAYS_OF_WEEK.map(day => (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleWorkingDaysToggle(day)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                    formData.workingDays.includes(day)
                      ? "bg-indigo-50 border-[#698bf4] text-[#698bf4]"
                      : "bg-slate-50 border-slate-200 text-slate-500 hover:border-slate-300"
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Start Time</label>
              <input type="time" name="consultationStart" value={formData.consultationStart} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#698bf4] outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">End Time</label>
              <input type="time" name="consultationEnd" value={formData.consultationEnd} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#698bf4] outline-none" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Slot Duration (mins)</label>
              <select name="consultationDuration" value={formData.consultationDuration} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#698bf4] outline-none">
                <option value="15">15 Minutes</option>
                <option value="30">30 Minutes</option>
                <option value="45">45 Minutes</option>
                <option value="60">60 Minutes</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                <AlertCircle className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <p className="text-sm font-bold text-red-800">Emergency Availability</p>
                <p className="text-xs text-red-600/80 mt-0.5">Allow hospital admin to assign emergency cases outside scheduled hours.</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" name="emergencyAvailability" checked={formData.emergencyAvailability} onChange={handleChange} className="sr-only peer" />
              <div className="w-11 h-6 bg-red-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
            </label>
          </div>
        </div>
      </div>
    </>
  );
};

export default DoctorProfessionalInfo;
