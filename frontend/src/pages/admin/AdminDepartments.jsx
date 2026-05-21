import { useEffect, useState } from "react";
import { useAdminStore } from "../../store/useAdminStore";
import { Building, Loader2, Plus, X, Edit, Trash2, Search } from "lucide-react";

const AdminDepartments = () => {
  const { departments, fetchDepartments, isLoadingDepartments, createDepartment, deleteDepartment, users, fetchUsers } = useAdminStore();
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    head: "",
    status: "Available",
  });

  useEffect(() => {
    fetchDepartments();
    fetchUsers(); // To get list of doctors for "head" assignment
  }, [fetchDepartments, fetchUsers]);

  const doctors = users.filter(u => u.role === "doctor");

  const filteredDepartments = departments.filter(d => 
    d.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = () => {
    setFormData({ name: "", description: "", head: "", status: "Available" });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...formData };
    if (!payload.head) delete payload.head;
    const success = await createDepartment(payload);
    if (success) setIsModalOpen(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this department?")) {
      await deleteDepartment(id);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 pb-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Department Management</h1>
          <p className="text-sm text-slate-500 mt-1">Configure hospital departments and assign unit heads.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search department..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm w-full sm:w-64 focus:outline-none focus:border-[#698bf4]" 
            />
          </div>
          <button 
            onClick={handleOpenModal}
            className="flex items-center gap-2 px-4 py-2 bg-[#698bf4] text-white rounded-lg text-sm font-medium hover:bg-[#5a7dec]"
          >
            <Plus className="w-4 h-4" /> Add Department
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoadingDepartments ? (
            <div className="col-span-full flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-[#698bf4]" /></div>
          ) : filteredDepartments.length === 0 ? (
            <div className="col-span-full text-center text-slate-500 py-8">No departments found.</div>
          ) : (
            filteredDepartments.map((d) => (
              <div key={d._id} className="border border-slate-200 rounded-xl p-6 hover:shadow-md transition-shadow bg-white relative group">
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleDelete(d._id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="w-12 h-12 rounded-lg bg-indigo-50 flex items-center justify-center text-[#698bf4] mb-4">
                  <Building className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-800 text-lg mb-1">{d.name}</h3>
                <p className="text-sm text-slate-500 mb-4 h-10 line-clamp-2">{d.description || "No description provided."}</p>
                <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">Department Head</p>
                    <p className="text-sm font-medium text-slate-700">{d.head?.fullName || "Not assigned"}</p>
                  </div>
                  <span className={`px-2.5 py-1 text-[10px] uppercase font-bold rounded-full ${
                    d.status === 'Available' ? 'bg-green-100 text-green-700' : 
                    d.status === 'Full' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {d.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Building className="w-5 h-5 text-[#698bf4]"/> Create Department
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Department Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#698bf4] outline-none" placeholder="e.g. Cardiology" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Description</label>
                <textarea rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#698bf4] outline-none"></textarea>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Assign Head (Optional)</label>
                <select value={formData.head} onChange={e => setFormData({...formData, head: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#698bf4] outline-none">
                  <option value="">None</option>
                  {doctors.map(doc => (
                    <option key={doc._id} value={doc._id}>{doc.fullName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Status</label>
                <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-[#698bf4] outline-none">
                  <option value="Available">Available</option>
                  <option value="Full">Full</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>
              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-[#698bf4] text-white text-sm font-medium rounded-xl hover:bg-[#5a7dec] transition-colors shadow-sm">
                  Create Department
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDepartments;
