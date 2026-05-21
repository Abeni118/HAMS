import { useEffect, useState } from "react";
import { Calendar, Clock, Plus, Search, Filter, MoreVertical, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { useAppointmentStore } from "../../store/useAppointmentStore";
import BookAppointmentModal from "../../components/patient/BookAppointmentModal";
import RescheduleAppointmentModal from "../../components/patient/RescheduleAppointmentModal";

const AppointmentsPage = () => {
  const { appointments, fetchAppointments, isFetchingAppointments, updateAppointmentStatus } = useAppointmentStore();
  const [filter, setFilter] = useState("All");
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [rescheduleModalData, setRescheduleModalData] = useState({ isOpen: false, appointment: null });

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const getStatusStyle = (status) => {
    switch (status) {
      case "Approved": return "bg-green-50 text-green-700 border-green-200";
      case "Pending": return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "Cancelled": return "bg-red-50 text-red-700 border-red-200";
      default: return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Approved": return <CheckCircle2 className="w-3.5 h-3.5 mr-1" />;
      case "Pending": return <AlertCircle className="w-3.5 h-3.5 mr-1" />;
      case "Cancelled": return <XCircle className="w-3.5 h-3.5 mr-1" />;
      default: return null;
    }
  };

  const filteredAppointments = appointments.filter((apt) => {
    if (filter === "All") return true;
    if (filter === "Upcoming") return apt.status === "Approved" || apt.status === "Pending";
    if (filter === "Past") return apt.status === "Completed";
    if (filter === "Cancelled") return apt.status === "Cancelled";
    return true;
  });

  const handleCancel = (id) => {
    if(window.confirm("Are you sure you want to cancel this appointment?")) {
      updateAppointmentStatus(id, "Cancelled");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 lg:p-8 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">My Appointments</h1>
          <p className="text-sm text-slate-500 mt-1">Manage and track your medical appointments</p>
        </div>
        <button 
          onClick={() => setIsBookModalOpen(true)}
          className="inline-flex justify-center items-center gap-2 px-5 py-2.5 bg-[#698bf4] text-white rounded-xl text-sm font-semibold hover:bg-[#5a7dec] shadow-md shadow-[#698bf4]/20 transition-all sm:w-auto w-full"
        >
          <Plus className="w-4 h-4" />
          Book Appointment
        </button>
      </div>

      {/* Filters & Actions Section */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Tab Filters */}
        <div className="flex w-full md:w-auto items-center overflow-x-auto hide-scrollbar gap-1">
          {["All", "Upcoming", "Past", "Cancelled"].map((tab) => (
            <button 
              key={tab}
              onClick={() => setFilter(tab)} 
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                filter === tab 
                  ? "bg-[#698bf4] text-white shadow-md shadow-[#698bf4]/20" 
                  : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              {tab === "All" ? "All Appointments" : tab}
            </button>
          ))}
        </div>
        
        {/* Search */}
        <div className="flex items-center w-full md:w-auto gap-3">
          <div className="relative flex-1 md:w-72">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search doctor or dept..." 
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border-transparent rounded-xl text-sm focus:bg-white focus:border-[#698bf4] focus:ring-2 focus:ring-[#698bf4]/20 transition-all" 
            />
          </div>
          <button className="flex items-center justify-center p-2.5 bg-slate-50 text-slate-600 rounded-xl hover:bg-slate-100 transition-colors">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Appointments Cards System */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-start">
        {isFetchingAppointments ? (
          <div className="col-span-full flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#698bf4]"></div>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="col-span-full bg-white rounded-2xl p-12 shadow-sm border border-slate-100 flex flex-col items-center justify-center text-slate-500">
            <Calendar className="w-12 h-12 text-slate-300 mb-4" />
            <p className="text-lg font-medium text-slate-800">No appointments found</p>
            <p className="text-sm text-slate-500 mt-1 mb-6">Click "Book Appointment" to schedule a new visit.</p>
            <button 
              onClick={() => setIsBookModalOpen(true)}
              className="px-6 py-2.5 bg-[#698bf4] text-white rounded-xl text-sm font-semibold hover:bg-[#5a7dec] shadow-md shadow-[#698bf4]/20 transition-all"
            >
              Book Appointment
            </button>
          </div>
        ) : (
          filteredAppointments.map((apt) => (
            <div key={apt._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow group flex flex-col">
              
              <div className="p-6 flex-1">
                {/* Doctor Info */}
                <div className="flex justify-between items-start mb-6">
                  <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-50 border border-slate-200 shrink-0 flex items-center justify-center text-slate-400">
                      {apt.doctorId?.profilePic ? (
                        <img src={apt.doctorId.profilePic} alt={apt.doctorId.fullName} className="w-full h-full object-cover" />
                      ) : (
                        <span className="font-bold text-lg">{apt.doctorId?.fullName?.charAt(0) || "D"}</span>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 leading-tight">Dr. {apt.doctorId?.fullName || "Unknown"}</h3>
                      <p className="text-sm text-[#698bf4] font-medium mt-0.5">{apt.department}</p>
                    </div>
                  </div>
                  <button className="text-slate-400 hover:text-slate-600 p-1 -mr-2">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>

                {/* Time & Date Badge */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex flex-col justify-center">
                    <div className="flex items-center text-slate-500 mb-1">
                      <Calendar className="w-3.5 h-3.5 mr-1.5" />
                      <span className="text-[10px] uppercase font-bold tracking-wider">Date</span>
                    </div>
                    <p className="text-sm font-bold text-slate-800">{apt.date}</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex flex-col justify-center">
                    <div className="flex items-center text-slate-500 mb-1">
                      <Clock className="w-3.5 h-3.5 mr-1.5" />
                      <span className="text-[10px] uppercase font-bold tracking-wider">Time</span>
                    </div>
                    <p className="text-sm font-bold text-slate-800">{apt.timeSlot}</p>
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <span className={`inline-flex w-fit items-center px-3 py-1 text-xs font-bold rounded-full border ${getStatusStyle(apt.status)}`}>
                  {getStatusIcon(apt.status)}
                  {apt.status}
                </span>
                
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {(apt.status === "Approved" || apt.status === "Pending") && (
                    <>
                      <button onClick={() => handleCancel(apt._id)} className="flex-1 sm:flex-none px-4 py-2 text-sm font-semibold text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                        Cancel
                      </button>
                      <button 
                        onClick={() => setRescheduleModalData({ isOpen: true, appointment: apt })}
                        className="flex-1 sm:flex-none px-4 py-2 text-sm font-semibold text-white bg-[#698bf4] hover:bg-[#5a7dec] rounded-xl transition-colors shadow-sm shadow-[#698bf4]/20"
                      >
                        Reschedule
                      </button>
                    </>
                  )}
                  {(apt.status === "Completed" || apt.status === "Cancelled") && (
                    <button className="w-full px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors bg-white">
                      View Details
                    </button>
                  )}
                </div>
              </div>
              
            </div>
          ))
        )}
      </div>

      <BookAppointmentModal 
        isOpen={isBookModalOpen} 
        onClose={() => setIsBookModalOpen(false)} 
      />

      <RescheduleAppointmentModal
        isOpen={rescheduleModalData.isOpen}
        onClose={() => setRescheduleModalData({ isOpen: false, appointment: null })}
        appointment={rescheduleModalData.appointment}
      />
    </div>
  );
};

export default AppointmentsPage;
