import { Scale, ShieldAlert, CheckCircle, FileSignature } from "lucide-react";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <nav className="bg-white border-b border-slate-100 py-4 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6">
          <Link to="/" className="text-[#698bf4] font-bold hover:underline">← Back to Home</Link>
        </div>
      </nav>

      <div className="flex-1 max-w-4xl mx-auto w-full px-6 py-12 space-y-12">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-blue-50 text-[#698bf4] rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Scale className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900">Terms of Service</h1>
          <p className="text-lg text-slate-500">Legal guidelines for using the Arba Minch HAMS platform.</p>
        </div>

        <div className="bg-white p-8 md:p-10 rounded-3xl border border-slate-200 shadow-sm space-y-10">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-[#698bf4]" /> Acceptance of Terms
            </h2>
            <p className="text-slate-600 leading-relaxed">
              By accessing the Hospital Appointment Management System (HAMS), you agree to be bound by these Terms of Service. If you do not agree with any part of these terms, you may not access the service.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <ShieldAlert className="w-6 h-6 text-[#698bf4]" /> Account Responsibility & Access Rules
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>Users are responsible for safeguarding their login credentials.</li>
              <li>You must provide accurate and complete medical and contact information.</li>
              <li>Unauthorized access to other users' data, or attempting to breach role-based access controls, is strictly prohibited.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <FileSignature className="w-6 h-6 text-[#698bf4]" /> Medical Information & Appointment Policy
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li><strong>Medical Usage:</strong> The system stores medical information but does not replace emergency medical services. In an emergency, please visit the hospital immediately.</li>
              <li><strong>Appointments:</strong> Booking an appointment is a commitment. Users should cancel or reschedule promptly if they cannot attend.</li>
              <li><strong>Healthcare Responsibility:</strong> The hospital is responsible for providing care during your visit. The software system facilitates this but is not a healthcare provider itself.</li>
              <li><strong>Privacy Compliance:</strong> All data is managed in compliance with our Privacy Policy and local medical data protection laws.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              Contact Information
            </h2>
            <p className="text-slate-600 leading-relaxed bg-slate-50 p-6 rounded-xl border border-slate-100">
              For legal inquiries regarding these terms, please contact:<br/><br/>
              <strong>Arba Minch General Hospital Legal Department</strong><br/>
              Arba Minch, Ethiopia<br/>
              Phone: +251 91 123 4567<br/>
              Email: legal@arbaminchhospital.gov.et
            </p>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TermsPage;
