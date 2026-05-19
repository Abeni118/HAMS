import { Loader2 } from "lucide-react";

const Loader = ({ className }) => {
  return (
    <div className="flex items-center justify-center">
      <Loader2 className={`w-10 h-10 animate-spin text-[#698bf4] ${className || ""}`} />
    </div>
  );
};

export default Loader;


