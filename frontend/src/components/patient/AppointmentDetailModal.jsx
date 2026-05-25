import { useEffect } from "react";
import {
  X, Calendar, Clock, User, Building, FileText,
  Hash, CheckCircle2, XCircle, AlertCircle, Loader2,
  Phone, Mail, Stethoscope
} from "lucide-react";
import { useAppointmentStore } from "../../store/useAppointmentStore";

const statusConfig = {
  Approved:  { style: "bg-green-50 text-green-700 border-green-200",  Icon: CheckCircle2 },
  Pending:   { style: "bg-yellow-50 text-yellow-700 border-yellow-200", Icon: AlertCircle },
  Cancelled: { style: "bg-red-50 text-red-700 border-red-200",         Icon: XCircle },
  Completed: { style: "bg-blue-50 text-blue-700 border-blue-200",       Icon: CheckCircle2 },
};

const Field = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3 py-3 border-b border-slate-100 last:border-0">
    <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 mt-0.5">
      <Icon className="w-4 h-4 text-[#698bf4]" />
    </div>
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">{label}</p>
      <p className="text-sm font-semibold text-slate-800">{value || <span className="text-slate-400 font-normal italic">Not provided</span>}</p>
    </div>
  </div>
);

const AppointmentDetailModal = ({ isOpen, onClose }) => {
  const { selectedAppointment: apt, detailLoading, clearSelectedAppointment } = useAppointmentStore();

  // ESC key closes modal
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  // Clear data when closed
  useEffect(() => {
    if (!isOpen) clearSelectedAppointment();
  }, [isOpen, clearSelectedAppointment]);

  if (!isOpen) return null;

  const status = apt?.status;
  const cfg = statusConfig[status] || statusConfig.Pending;
  const StatusIcon = cfg.Icon;

  const formatDate = (str) => {
    if (!str) return null;
    const d = new Date(str);
    return isNaN(d) ? str : d.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  };

  const formatDateTime = (str) => {
    if (!str) return null;
    const d = new Date(str);
    return isNaN(d) ? str : d.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
      aria-label="Appointment details"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Panel */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Appointment Details</h2>
            {apt && (
              <p className="text-xs text-slate-400 mt-0.5 font-mono">ID: {apt._id}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">

          {/* Loading */}
          {detailLoading && (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-500">
              <Loader2 className="w-8 h-8 animate-spin text-[#698bf4]" />
              <p className="text-sm">Loading appointment details…</p>
            </div>
          )}

          {/* Error / empty */}
          {!detailLoading && !apt && (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-slate-400">
              <AlertCircle className="w-10 h-10 text-slate-300" />
              <p className="text-sm font-medium">Appointment information unavailable.</p>
            </div>
          )}

          {/* Content */}
          {!detailLoading && apt && (
            <div className="space-y-6">

              {/* Status Badge */}
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-bold ${cfg.style}`}>
                <StatusIcon className="w-4 h-4" />
                {status}
              </div>

              {/* Cancelled notice */}
              {status === "Cancelled" && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-red-500 mb-1">Cancellation Notice</p>
                  <p className="text-sm text-red-700">
                    {apt.notes && apt.notes.trim()
                      ? apt.notes
                      : "This appointment was cancelled. No reason provided."}
                  </p>
                </div>
              )}

              {/* Doctor Section */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Doctor</p>
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="w-12 h-12 rounded-full bg-white border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center text-slate-400 text-lg font-bold">
                    {apt.doctorId?.profilePic
                      ? <img src={apt.doctorId.profilePic} alt="Doctor" className="w-full h-full object-cover" />
                      : apt.doctorId?.fullName?.charAt(0) || "D"}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">Dr. {apt.doctorId?.fullName || "Unknown"}</p>
                    <p className="text-sm text-[#698bf4] font-medium">{apt.doctorId?.specialization || apt.department}</p>
                  </div>
                </div>
              </div>

              {/* Appointment Info */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Appointment Info</p>
                <div className="bg-white border border-slate-100 rounded-xl divide-y divide-slate-100 px-4">
                  <Field icon={Building}   label="Department"   value={apt.department} />
                  <Field icon={Calendar}   label="Date"         value={formatDate(apt.date)} />
                  <Field icon={Clock}      label="Time Slot"    value={apt.timeSlot} />
                  <Field icon={FileText}   label="Reason / Notes" value={apt.notes} />
                </div>
              </div>

              {/* Patient Info */}
              {apt.patientId && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Patient</p>
                  <div className="bg-white border border-slate-100 rounded-xl divide-y divide-slate-100 px-4">
                    <Field icon={User}   label="Full Name" value={apt.patientId.fullName} />
                    <Field icon={Mail}   label="Email"     value={apt.patientId.email} />
                    <Field icon={Phone}  label="Phone"     value={apt.patientId.phoneNumber} />
                  </div>
                </div>
              )}

              {/* Timestamps */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Record</p>
                <div className="bg-white border border-slate-100 rounded-xl divide-y divide-slate-100 px-4">
                  <Field icon={Hash}     label="Appointment ID" value={apt._id} />
                  <Field icon={Calendar} label="Created"        value={formatDateTime(apt.createdAt)} />
                  <Field icon={Calendar} label="Last Updated"   value={formatDateTime(apt.updatedAt)} />
                </div>
              </div>

            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 shrink-0 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetailModal;
