import { useState, useEffect } from "react";
import { 
  Calendar as CalendarIcon, Clock, Users, CheckCircle2, 
  XCircle, Plus, CalendarDays, User, Loader2, X, RefreshCw
} from "lucide-react";
import { useScheduleStore } from "../../store/useScheduleStore";
import { useAuthStore } from "../../store/useAuthStore";
import toast from "react-hot-toast";

const SchedulePage = () => {
  const { authUser } = useAuthStore();
  const { 
    schedules, appointments, fetchSchedules, fetchAppointments, 
    createSlot, deleteSlot, approveAppointment, rejectAppointment, 
    completeAppointment, rescheduleAppointment,
    isLoadingSchedules, isLoadingAppointments, isUpdating
  } = useScheduleStore();

  const [activeTab, setActiveTab] = useState("appointments"); // "appointments" or "schedule"
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  // New Slot State
  const [newSlot, setNewSlot] = useState({ date: selectedDate, startTime: "09:00", endTime: "10:00" });
  
  // Reschedule Modal State
  const [rescheduleModal, setRescheduleModal] = useState({ isOpen: false, appointment: null });
  const [rescheduleData, setRescheduleData] = useState({ date: "", timeSlot: "" });

  useEffect(() => {
    fetchSchedules();
    fetchAppointments();
  }, [fetchSchedules, fetchAppointments]);

  // Derived Stats
  const todayAppointments = appointments.filter(a => a.date === new Date().toISOString().split('T')[0]);
  const pendingAppointments = appointments.filter(a => a.status === "Pending");
  const upcomingAppointments = appointments.filter(a => a.status === "Approved");

  const handleCreateSlot = async (e) => {
    e.preventDefault();
    if (!newSlot.date || !newSlot.startTime || !newSlot.endTime) {
      toast.error("Please fill all fields");
      return;
    }
    await createSlot(newSlot);
    setNewSlot({ date: selectedDate, startTime: "09:00", endTime: "10:00" });
  };

  const handleRescheduleSubmit = async (e) => {
    e.preventDefault();
    if (!rescheduleData.date || !rescheduleData.timeSlot) {
      toast.error("Please provide new date and time");
      return;
    }
    const success = await rescheduleAppointment(rescheduleModal.appointment._id, rescheduleData);
    if (success) {
      setRescheduleModal({ isOpen: false, appointment: null });
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "Pending": return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "Approved": return "bg-green-50 text-green-700 border-green-200";
      case "Completed": return "bg-blue-50 text-blue-700 border-blue-200";
      case "Cancelled": return "bg-red-50 text-red-700 border-red-200";
      default: return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Doctor Schedule</h1>
          <p className="text-sm text-slate-500 mt-1">Welcome back, Dr. {authUser?.fullName?.split(' ')[1] || 'Doctor'}</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab("appointments")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === "appointments" ? "bg-white text-[#698bf4] shadow-sm" : "text-slate-600 hover:text-slate-800"}`}
          >
            Appointments
          </button>
          <button 
            onClick={() => setActiveTab("schedule")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === "schedule" ? "bg-white text-[#698bf4] shadow-sm" : "text-slate-600 hover:text-slate-800"}`}
          >
            My Availability
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-[#698bf4] flex items-center justify-center">
            <CalendarIcon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Today's Total</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">{todayAppointments.length}</h3>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Upcoming</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">{upcomingAppointments.length}</h3>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-yellow-50 text-yellow-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pending</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">{pendingAppointments.length}</h3>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <CalendarDays className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Slots</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">{schedules.length}</h3>
          </div>
        </div>
      </div>

      {activeTab === "appointments" ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-800">Patient Appointments</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {isLoadingAppointments ? (
              <div className="p-8 text-center text-slate-500 flex justify-center"><Loader2 className="w-6 h-6 animate-spin" /></div>
            ) : appointments.length === 0 ? (
              <div className="p-12 text-center text-slate-500">No appointments scheduled.</div>
            ) : (
              appointments.map((apt) => (
                <div key={apt._id} className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:bg-slate-50 transition-colors">
                  <div className="flex gap-4 items-center">
                    <img 
                      src={apt.patientId?.profilePic || "/avatar.png"} 
                      alt="Patient" 
                      className="w-12 h-12 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <h4 className="font-bold text-slate-800">{apt.patientId?.fullName || "Unknown Patient"}</h4>
                      <div className="flex items-center gap-3 text-xs font-medium text-slate-500 mt-1">
                        <span className="flex items-center gap-1"><CalendarIcon className="w-3.5 h-3.5" /> {apt.date}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {apt.timeSlot}</span>
                      </div>
                      {apt.notes && <p className="text-xs text-slate-400 mt-1">Note: {apt.notes}</p>}
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusColor(apt.status)}`}>
                      {apt.status}
                    </span>
                    
                    {apt.status === "Pending" && (
                      <div className="flex gap-2">
                        <button onClick={() => approveAppointment(apt._id)} className="p-2 text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors" title="Approve">
                          <CheckCircle2 className="w-5 h-5" />
                        </button>
                        <button onClick={() => rejectAppointment(apt._id)} className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors" title="Reject">
                          <XCircle className="w-5 h-5" />
                        </button>
                      </div>
                    )}

                    {apt.status === "Approved" && (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => {
                            setRescheduleData({ date: apt.date, timeSlot: apt.timeSlot });
                            setRescheduleModal({ isOpen: true, appointment: apt });
                          }} 
                          className="px-3 py-2 text-sm font-medium text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors flex items-center gap-2"
                        >
                          <RefreshCw className="w-4 h-4" /> Reschedule
                        </button>
                        <button 
                          onClick={() => completeAppointment(apt._id)} 
                          className="px-3 py-2 text-sm font-medium text-white bg-[#698bf4] hover:bg-[#5a7dec] rounded-lg transition-colors shadow-sm"
                        >
                          Mark Complete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar Builder */}
          <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 self-start">
            <h2 className="text-lg font-bold text-slate-800 mb-6">Add Availability</h2>
            <form onSubmit={handleCreateSlot} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Date</label>
                <input 
                  type="date" 
                  value={newSlot.date}
                  onChange={(e) => setNewSlot({...newSlot, date: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#698bf4]"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Start Time</label>
                  <input 
                    type="time" 
                    value={newSlot.startTime}
                    onChange={(e) => setNewSlot({...newSlot, startTime: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#698bf4]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">End Time</label>
                  <input 
                    type="time" 
                    value={newSlot.endTime}
                    onChange={(e) => setNewSlot({...newSlot, endTime: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#698bf4]"
                    required
                  />
                </div>
              </div>
              <button 
                type="submit" 
                disabled={isUpdating}
                className="w-full py-2.5 mt-2 bg-slate-800 text-white rounded-xl text-sm font-medium hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
              >
                {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Add Slot
              </button>
            </form>
          </div>

          {/* Schedule View */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-[#698bf4]" />
                Upcoming Slots
              </h2>
            </div>
            <div className="p-6">
              {isLoadingSchedules ? (
                <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-[#698bf4]" /></div>
              ) : schedules.length === 0 ? (
                <div className="text-center py-12 text-slate-500">No availability slots created yet.</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {schedules.map((slot) => (
                    <div key={slot._id} className="p-4 rounded-xl border border-slate-200 bg-white shadow-sm flex flex-col relative group">
                      <button 
                        onClick={() => deleteSlot(slot._id)}
                        className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-100 hover:bg-red-50 rounded-md"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <div className="flex items-center gap-2 font-bold text-slate-800 mb-2">
                        <CalendarIcon className="w-4 h-4 text-[#698bf4]" />
                        {slot.date}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600 mb-3">
                        <Clock className="w-4 h-4" />
                        {slot.startTime} - {slot.endTime}
                      </div>
                      <div className={`mt-auto inline-flex px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${slot.isAvailable ? 'bg-green-50 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                        {slot.isAvailable ? "Available" : "Booked"}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {rescheduleModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-800">Reschedule Appointment</h3>
              <button onClick={() => setRescheduleModal({ isOpen: false, appointment: null })} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5"/></button>
            </div>
            <form onSubmit={handleRescheduleSubmit} className="p-6 space-y-4">
              <div className="bg-slate-50 p-4 rounded-xl mb-6">
                <p className="text-sm font-medium text-slate-700">Patient: {rescheduleModal.appointment.patientId?.fullName}</p>
                <p className="text-xs text-slate-500">Current: {rescheduleModal.appointment.date} at {rescheduleModal.appointment.timeSlot}</p>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">New Date</label>
                <input 
                  type="date" 
                  value={rescheduleData.date}
                  onChange={(e) => setRescheduleData({...rescheduleData, date: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#698bf4]"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">New Time Slot</label>
                <input 
                  type="time" 
                  value={rescheduleData.timeSlot}
                  onChange={(e) => setRescheduleData({...rescheduleData, timeSlot: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#698bf4]"
                  required
                />
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setRescheduleModal({ isOpen: false, appointment: null })} className="flex-1 px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 text-sm font-medium text-white bg-[#698bf4] hover:bg-[#5a7dec] rounded-xl transition-colors shadow-sm">Confirm Reschedule</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default SchedulePage;
