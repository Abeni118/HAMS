import { motion } from "framer-motion";

const HealthcareLoader = ({ className = "w-16 h-16 text-[#698bf4]" }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <motion.div
        className={className}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full stroke-current stroke-[2] drop-shadow-sm">
          <motion.path
            d="M21.5 12H17.5L15.5 19.5L11 3.5L8.5 15L7 12H2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
        </svg>
      </motion.div>
      <motion.div 
        className="text-sm font-bold text-slate-500 tracking-widest uppercase"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        Loading System
      </motion.div>
    </div>
  );
};

export default HealthcareLoader;
