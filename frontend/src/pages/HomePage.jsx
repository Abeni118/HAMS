import { Link } from "react-router-dom";
import { 
  HeartPulse, CalendarCheck, ShieldCheck, Users, 
  Stethoscope, Clock, Phone, Mail, MapPin, ArrowRight,
  Activity, Shield, Laptop, ClipboardList, BedDouble
} from "lucide-react";
import { motion } from "framer-motion";

// Animation Variants
const fadeUpVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const HomePage = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-slate-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#698bf4] rounded-xl flex items-center justify-center text-white shadow-sm">
                <HeartPulse className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800 leading-tight">Arba Minch</h1>
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">General Hospital</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#about" className="text-sm font-medium text-slate-600 hover:text-[#698bf4] transition-colors">About</a>
              <a href="#features" className="text-sm font-medium text-slate-600 hover:text-[#698bf4] transition-colors">Features</a>
              <a href="#departments" className="text-sm font-medium text-slate-600 hover:text-[#698bf4] transition-colors">Departments</a>
              <a href="#contact" className="text-sm font-medium text-slate-600 hover:text-[#698bf4] transition-colors">Contact</a>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-[#698bf4] transition-colors hidden sm:block">
                Log In
              </Link>
              <Link to="/signup" className="px-5 py-2.5 bg-[#698bf4] text-white text-sm font-medium rounded-xl hover:bg-[#5a7dec] transition-all shadow-sm shadow-[#698bf4]/30 hover:shadow-md hover:-translate-y-0.5">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative pt-24 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-white to-blue-50/50 -z-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div 
            className="text-center max-w-3xl mx-auto space-y-8"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div variants={fadeUpVariant} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider mb-4">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              Modern Healthcare System
            </motion.div>
            <motion.h1 variants={fadeUpVariant} className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
              Arba Minch <span className="text-[#698bf4]">General Hospital</span>
            </motion.h1>
            <motion.p variants={fadeUpVariant} className="text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              A Modern Hospital Appointment Management System designed to improve healthcare access, appointment scheduling, patient communication, and hospital operations.
            </motion.p>
            <motion.div variants={fadeUpVariant} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link to="/login" className="w-full sm:w-auto px-8 py-3.5 bg-[#698bf4] text-white text-base font-bold rounded-xl hover:bg-[#5a7dec] transition-all shadow-lg shadow-[#698bf4]/30 hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2">
                Get Started <ArrowRight className="w-5 h-5" />
              </Link>
              <a href="#about" className="w-full sm:w-auto px-8 py-3.5 bg-white text-slate-700 text-base font-bold rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center justify-center hover:-translate-y-1 shadow-sm hover:shadow-md">
                Learn More
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ABOUT HOSPITAL */}
      <section id="about" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              className="space-y-6"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
              variants={fadeUpVariant}
            >
              <h2 className="text-3xl font-bold text-slate-900">About Arba Minch General Hospital</h2>
              <div className="w-20 h-1.5 bg-[#698bf4] rounded-full" />
              <p className="text-slate-600 leading-relaxed text-lg">
                We are a public general hospital dedicated to serving Arba Minch and the surrounding communities. Our mission is to provide exceptional healthcare services while embracing modern healthcare delivery systems.
              </p>
              <p className="text-slate-600 leading-relaxed">
                Our newly integrated Hospital Management System significantly improves our operational efficiency, focusing directly on enhancing:
              </p>
              <ul className="space-y-3 pt-2">
                {["Appointment booking & tracking", "Comprehensive patient management", "Optimized doctor workflows", "Efficient nurse queue management", "Streamlined hospital administration"].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                    <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                      <CheckCircleIcon className="w-4 h-4" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div 
              className="relative"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="aspect-square md:aspect-[4/3] bg-slate-100 rounded-3xl overflow-hidden shadow-2xl relative z-10 border border-slate-200">
                <img src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2000&auto=format&fit=crop" alt="Hospital Building" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-[#698bf4]/10 rounded-full blur-3xl -z-10" />
              <div className="absolute -top-8 -right-8 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl -z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* SYSTEM FEATURES */}
      <section id="features" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl font-bold text-slate-900">Role-Based System Features</h2>
            <p className="text-slate-600">Our comprehensive management system provides dedicated portals tailored to the specific needs of patients and hospital staff.</p>
          </div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeUpVariant}>
              <FeatureCard 
                title="Patient Portal" 
                icon={<UserIcon className="w-6 h-6" />}
                color="bg-blue-50 text-blue-600 border-blue-200"
                features={["Book appointments", "View medical reports", "Real-time notifications", "Medical history tracking"]}
              />
            </motion.div>
            <motion.div variants={fadeUpVariant}>
              <FeatureCard 
                title="Doctor Portal" 
                icon={<Stethoscope className="w-6 h-6" />}
                color="bg-indigo-50 text-indigo-600 border-indigo-200"
                features={["Schedule management", "Upload medical reports", "Patient records access", "Real-time queue alerts"]}
              />
            </motion.div>
            <motion.div variants={fadeUpVariant}>
              <FeatureCard 
                title="Nurse Portal" 
                icon={<Activity className="w-6 h-6" />}
                color="bg-emerald-50 text-emerald-600 border-emerald-200"
                features={["Patient queue management", "Vitals tracking", "Triage notes", "Automated doctor handoff"]}
              />
            </motion.div>
            <motion.div variants={fadeUpVariant}>
              <FeatureCard 
                title="Admin Portal" 
                icon={<Shield className="w-6 h-6" />}
                color="bg-purple-50 text-purple-600 border-purple-200"
                features={["Hospital analytics", "User management", "Department control", "System audit logs"]}
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl font-bold text-slate-900">How It Works</h2>
            <p className="text-slate-600">A simple, streamlined process from booking to receiving healthcare services.</p>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-start relative">
            <div className="hidden md:block absolute top-12 left-10 right-10 h-0.5 bg-slate-100 -z-10" />
            
            {[
              { step: 1, title: "Create account", icon: <Users className="w-6 h-6" /> },
              { step: 2, title: "Login securely", icon: <ShieldCheck className="w-6 h-6" /> },
              { step: 3, title: "Book appointment", icon: <CalendarCheck className="w-6 h-6" /> },
              { step: 4, title: "Get notifications", icon: <HeartPulse className="w-6 h-6" /> },
              { step: 5, title: "Receive care", icon: <Stethoscope className="w-6 h-6" /> },
            ].map((s, i) => (
              <motion.div 
                key={i} 
                className="flex flex-col items-center text-center w-full md:w-1/5 mb-8 md:mb-0"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <motion.div 
                  className="w-24 h-24 rounded-full bg-white border-4 border-slate-50 shadow-xl shadow-slate-200/50 flex items-center justify-center text-[#698bf4] mb-6 relative"
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-slate-800 text-white text-sm font-bold flex items-center justify-center border-4 border-white">{s.step}</span>
                  {s.icon}
                </motion.div>
                <h3 className="font-bold text-slate-800">{s.title}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOSPITAL STATISTICS */}
      <section className="py-20 bg-[#698bf4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatCard value="45+" label="Doctors" />
            <StatCard value="10k+" label="Patients" />
            <StatCard value="12" label="Departments" />
            <StatCard value="25k+" label="Appointments" />
          </div>
        </div>
      </section>

      {/* DEPARTMENTS SECTION */}
      <section id="departments" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl font-bold text-slate-900">Our Departments</h2>
            <p className="text-slate-600">Comprehensive healthcare services provided by specialized departments.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: "Cardiology", icon: <HeartPulse className="w-8 h-8" /> },
              { name: "Pediatrics", icon: <Users className="w-8 h-8" /> },
              { name: "Neurology", icon: <Activity className="w-8 h-8" /> },
              { name: "Emergency", icon: <ShieldCheck className="w-8 h-8" /> },
              { name: "General Medicine", icon: <Stethoscope className="w-8 h-8" /> },
              { name: "Laboratory", icon: <ClipboardList className="w-8 h-8" /> },
            ].map((dept, i) => (
              <motion.div 
                key={i} 
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center cursor-pointer"
                whileHover={{ scale: 1.03, y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" }}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <div className="w-16 h-16 mx-auto bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-[#698bf4] group-hover:bg-blue-50 transition-colors mb-4">
                  {dept.icon}
                </div>
                <h3 className="font-bold text-slate-800 text-sm">{dept.name}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
            <h2 className="text-3xl font-bold text-slate-900">Why Choose Us</h2>
            <p className="text-slate-600">The advantages of using our integrated Hospital Appointment Management System.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <WhyCard 
              icon={<ShieldCheck className="w-8 h-8" />} 
              title="Secure healthcare system" 
              desc="Bank-level security protecting sensitive patient records and medical history."
            />
            <WhyCard 
              icon={<Laptop className="w-8 h-8" />} 
              title="Online appointment management" 
              desc="Book, reschedule, or cancel your hospital visits instantly from your home."
            />
            <WhyCard 
              icon={<Activity className="w-8 h-8" />} 
              title="Fast communication" 
              desc="Real-time notifications keeping patients, nurses, and doctors synchronized."
            />
            <WhyCard 
              icon={<Users className="w-8 h-8" />} 
              title="Role-based healthcare workflow" 
              desc="Dedicated interfaces ensuring each staff member has the right tools."
            />
            <WhyCard 
              icon={<BedDouble className="w-8 h-8" />} 
              title="Modern hospital management" 
              desc="Replacing paper-based queues with intelligent digital triage and tracking."
            />
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section id="contact" className="py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <h2 className="text-3xl font-bold">Contact Arba Minch General Hospital</h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 pt-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-[#698bf4]">
                <MapPin className="w-6 h-6" />
              </div>
              <div className="text-left">
                <p className="text-sm text-slate-400">Location</p>
                <p className="font-bold">Arba Minch, Ethiopia</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-[#698bf4]">
                <Phone className="w-6 h-6" />
              </div>
              <div className="text-left">
                <p className="text-sm text-slate-400">Phone</p>
                <p className="font-bold">+251 91 123 4567</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-[#698bf4]">
                <Mail className="w-6 h-6" />
              </div>
              <div className="text-left">
                <p className="text-sm text-slate-400">Email</p>
                <p className="font-bold">info@arbaminchhospital.gov.et</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-[#698bf4]" />
            <span className="font-bold text-white tracking-wider">HAMS</span>
          </div>
          <div className="text-sm text-center md:text-left">
            &copy; {new Date().getFullYear()} Arba Minch General Hospital System. All rights reserved.
          </div>
          <div className="flex gap-6 text-sm font-medium">
            <Link to="/privacy" className="hover:text-[#698bf4] transition-colors cursor-pointer">Privacy</Link>
            <Link to="/terms" className="hover:text-[#698bf4] transition-colors cursor-pointer">Terms</Link>
            <Link to="/login" className="hover:text-[#698bf4] transition-colors cursor-pointer">Login</Link>
          </div>
        </div>
      </footer>

    </div>
  );
};

// Subcomponents for cleaner code
const CheckCircleIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const UserIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const FeatureCard = ({ title, icon, features, color }) => (
  <motion.div 
    className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm"
    whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
    transition={{ duration: 0.2 }}
  >
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border mb-6 ${color}`}>
      {icon}
    </div>
    <h3 className="text-xl font-bold text-slate-800 mb-4">{title}</h3>
    <ul className="space-y-3">
      {features.map((f, i) => (
        <li key={i} className="flex items-start gap-2 text-sm text-slate-600 font-medium">
          <CheckCircleIcon className="w-4 h-4 text-[#698bf4] mt-0.5 shrink-0" />
          {f}
        </li>
      ))}
    </ul>
  </motion.div>
);

const StatCard = ({ value, label }) => (
  <motion.div 
    className="text-center p-6 bg-white/10 rounded-3xl backdrop-blur-sm border border-white/20"
    initial={{ opacity: 0, scale: 0.5 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ type: "spring", stiffness: 100, damping: 15 }}
  >
    <div className="text-4xl md:text-5xl font-extrabold text-white mb-2">{value}</div>
    <div className="text-blue-100 font-medium uppercase tracking-wider text-sm">{label}</div>
  </motion.div>
);

const WhyCard = ({ icon, title, desc }) => (
  <motion.div 
    className="flex gap-4 p-6 rounded-2xl bg-white transition-colors border border-transparent"
    whileHover={{ scale: 1.02, backgroundColor: "#f8fafc", borderColor: "#f1f5f9" }}
  >
    <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-[#698bf4] flex items-center justify-center shrink-0">
      {icon}
    </div>
    <div>
      <h3 className="font-bold text-slate-800 text-lg mb-2">{title}</h3>
      <p className="text-slate-600 leading-relaxed text-sm">{desc}</p>
    </div>
  </motion.div>
);

export default HomePage;
