import { useState, useEffect } from "react";
import { X, Calendar as CalendarIcon, Clock, FileText, Loader2, ChevronDown } from "lucide-react";
import { useAppointmentStore } from "../../store/useAppointmentStore";

const RescheduleAppointmentModal = ({ isOpen, onClose, appointment }) => {
  const { rescheduleAppointment, isUpdatingStatus } = useAppointmentStore();
  
  const [formData, setFormData] = useState({
    date: "",
    timeSlot: "",
    reason: "",
  });

  useEffect(() => {
    if (isOpen && appointment) {
      setFormData({
        date: appointment.date || "",
        timeSlot: appointment.timeSlot || "",
        reason: "",
      });
    }
  }, [isOpen, appointment]);

  if (!isOpen || !appointment) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await rescheduleAppointment(appointment._id, {
      date: formData.date,
      timeSlot: formData.timeSlot,
      notes: formData.reason ? `${appointment.notes || ""} [Reschedule Reason: ${formData.reason}]`.trim() : appointment.notes,
    });
    if (success) onClose();
  };

  const timeSlots = [
    "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", 
    "11:00 AM", "11:30 AM", "01:00 PM", "01:30 PM", 
    "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
  ];

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
        
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" 
          aria-hidden="true" 
          onClick={onClose} 
        />

        {/* Modal Panel */}
        <div className="relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all sm:my-8 w-full sm:max-w-lg border border-slate-100">
          
          <div className="bg-white px-6 pb-4 pt-6 sm:p-6 sm:pb-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-2xl font-bold leading-6 text-gray-900">
                  Reschedule Appointment
                </h3>
                <p className="text-sm text-gray-500 mt-1">Select a new date and time for your visit</p>
              </div>
              <button
                type="button"
                className="rounded-full bg-white p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#698bf4]"
                onClick={onClose}
              >
                <span className="sr-only">Close</span>
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>

            <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Current Appointment</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-800">Dr. {appointment.doctorId?.fullName}</p>
                  <p className="text-sm text-slate-600">{appointment.department}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-800">{appointment.date}</p>
                  <p className="text-sm text-slate-500">{appointment.timeSlot}</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="space-y-5">
                {/* Date & Time Row */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">New Date</label>
                    <div className="relative rounded-2xl shadow-sm">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                        <CalendarIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        min={new Date().toISOString().split("T")[0]}
                        className="block w-full rounded-xl border-0 py-2.5 pl-11 pr-4 text-gray-900 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-inset focus:ring-[#698bf4] sm:text-sm sm:leading-6 bg-gray-50 hover:bg-white transition-colors"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">New Time</label>
                    <div className="relative rounded-2xl shadow-sm">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                        <Clock className="h-5 w-5 text-gray-400" />
                      </div>
                      <select
                        value={formData.timeSlot}
                        onChange={(e) => setFormData({ ...formData, timeSlot: e.target.value })}
                        className="block w-full rounded-xl border-0 py-2.5 pl-11 pr-10 text-gray-900 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-inset focus:ring-[#698bf4] sm:text-sm sm:leading-6 appearance-none bg-gray-50 hover:bg-white transition-colors"
                        required
                      >
                        <option value="" disabled>Select time</option>
                        {timeSlots.map((time) => (
                          <option key={time} value={time}>{time}</option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reason */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Reason for Rescheduling <span className="text-gray-400 font-normal">(Optional)</span></label>
                  <div className="relative rounded-2xl shadow-sm">
                    <div className="pointer-events-none absolute top-3 left-0 flex items-start pl-4">
                      <FileText className="h-5 w-5 text-gray-400" />
                    </div>
                    <textarea
                      value={formData.reason}
                      onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                      placeholder="Why do you need to change this appointment?"
                      rows="3"
                      className="block w-full rounded-xl border-0 py-2.5 pl-11 pr-4 text-gray-900 ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-inset focus:ring-[#698bf4] sm:text-sm sm:leading-6 bg-gray-50 hover:bg-white transition-colors resize-none placeholder:text-gray-400"
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-5 border-t border-gray-100">
                <button
                  type="button"
                  className="mt-3 inline-flex w-full justify-center rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto transition-colors"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingStatus}
                  className="inline-flex w-full justify-center items-center gap-2 rounded-xl bg-[#698bf4] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#5a7dec] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#698bf4] sm:w-auto transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isUpdatingStatus ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Confirming...</>
                  ) : (
                    "Confirm Reschedule"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RescheduleAppointmentModal;
