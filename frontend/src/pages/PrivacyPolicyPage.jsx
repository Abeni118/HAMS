import { ShieldCheck, Lock, Activity, Database, FileText } from "lucide-react";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      <nav className="bg-white border-b border-slate-100 py-4 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6">
          <Link to="/" className="text-[#698bf4] font-bold hover:underline">← Back to Home</Link>
        </div>
      </nav>

      <div className="flex-1 max-w-4xl mx-auto w-full px-6 py-12 space-y-12">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-indigo-50 text-[#698bf4] rounded-2xl flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900">Privacy Policy</h1>
          <p className="text-lg text-slate-500">How we protect your medical data at Arba Minch General Hospital.</p>
        </div>

        <div className="bg-white p-8 md:p-10 rounded-3xl border border-slate-200 shadow-sm space-y-10">
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <FileText className="w-6 h-6 text-[#698bf4]" /> Information Collection
            </h2>
            <p className="text-slate-600 leading-relaxed">
              We collect essential information to provide you with secure healthcare services. This includes:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li><strong>Account Information:</strong> Name, contact details, role, and credentials.</li>
              <li><strong>Appointment Information:</strong> Scheduling details, assigned doctors, and triage data.</li>
              <li><strong>Healthcare Information:</strong> Vitals, medical reports, clinical notes, and allergies.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Lock className="w-6 h-6 text-[#698bf4]" /> Data Protection & Security
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Security is our highest priority. We protect your medical information using strict protocols:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li><strong>Secure Authentication:</strong> We utilize encrypted JSON Web Tokens (JWT) stored securely.</li>
              <li><strong>Protected Medical Information:</strong> Patient records are stored in encrypted databases.</li>
              <li><strong>Role-Based Access:</strong> Doctors, nurses, and admins only see data explicitly permitted for their role.</li>
              <li><strong>Protected APIs:</strong> All data transfers are authenticated and sanitized.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Database className="w-6 h-6 text-[#698bf4]" /> Hospital Data Usage
            </h2>
            <p className="text-slate-600 leading-relaxed">
              Your data is exclusively used for hospital operations. We use it to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li>Streamline <strong>appointment management</strong> and queue triage.</li>
              <li>Facilitate real-time <strong>healthcare communication</strong> between your doctor and nurse.</li>
              <li>Improve overall <strong>hospital operations</strong> and resource allocation.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Activity className="w-6 h-6 text-[#698bf4]" /> User Rights
            </h2>
            <p className="text-slate-600 leading-relaxed">
              You maintain full control over your digital footprint within our system. You have the right to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-slate-600">
              <li><strong>Update Profile:</strong> Edit your contact and demographic information at any time.</li>
              <li><strong>Secure Account Control:</strong> Manage your passwords and notification settings directly from your dashboard.</li>
            </ul>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicyPage;
