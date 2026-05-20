import { BookOpen, Briefcase, Activity } from "lucide-react";

const NurseProfessionalInfo = ({ formData, handleChange }) => {
  return (
    <>
      {/* Professional Qualifications */}
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
          <BookOpen className="w-5 h-5 text-[#698bf4]" /> Professional Qualifications
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Nursing Level</label>
            <select name="nursingLevel" value={formData.nursingLevel} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#698bf4] outline-none">
              <option value="">Select Level</option>
              <option value="Registered Nurse (RN)">Registered Nurse (RN)</option>
              <option value="Nurse Practitioner (NP)">Nurse Practitioner (NP)</option>
              <option value="Licensed Practical Nurse (LPN)">Licensed Practical Nurse (LPN)</option>
              <option value="Clinical Nurse Specialist (CNS)">Clinical Nurse Specialist (CNS)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Years of Experience</label>
            <input type="number" name="yearsOfExperience" min="0" value={formData.yearsOfExperience} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#698bf4] outline-none" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Certifications</label>
            <input type="text" name="certifications" placeholder="e.g. BLS, ACLS, PALS (comma separated)" value={formData.certifications} onChange={(e) => handleChange({ target: { name: 'certifications', value: e.target.value.split(',').map(s => s.trim()) } })} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#698bf4] outline-none" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Biography / About</label>
            <textarea name="biography" rows="3" placeholder="Brief professional biography..." value={formData.biography} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#698bf4] outline-none"></textarea>
          </div>
        </div>
      </div>

      {/* Hospital Assignment */}
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2 border-b border-slate-100 pb-4">
          <Briefcase className="w-5 h-5 text-[#698bf4]" /> Hospital Assignment
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Assigned Ward / Department</label>
            <select name="assignedWard" value={formData.assignedWard} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#698bf4] outline-none">
              <option value="">Select Ward</option>
              <option value="Intensive Care Unit (ICU)">Intensive Care Unit (ICU)</option>
              <option value="Emergency Department (ER)">Emergency Department (ER)</option>
              <option value="Pediatrics">Pediatrics</option>
              <option value="Maternity">Maternity</option>
              <option value="Surgical Ward">Surgical Ward</option>
              <option value="General Ward">General Ward</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Shift Type</label>
            <select name="shiftType" value={formData.shiftType} onChange={handleChange} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#698bf4] outline-none">
              <option value="">Select Shift</option>
              <option value="Day Shift (07:00 - 15:00)">Day Shift</option>
              <option value="Evening Shift (15:00 - 23:00)">Evening Shift</option>
              <option value="Night Shift (23:00 - 07:00)">Night Shift</option>
              <option value="Rotating">Rotating</option>
            </select>
          </div>
        </div>
      </div>
    </>
  );
};

export default NurseProfessionalInfo;
