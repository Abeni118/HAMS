const Input = ({ icon: Icon, ...props }) => {
  return (
    <div className="relative mb-6">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Icon className="w-5 h-5 text-blue-400" />
      </div>
      <input
        {...props}
        className="w-full pl-10 pr-3 py-3 bg-white bg-opacity-50 text-slate-800 rounded-xl border border-blue-100 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 shadow-sm"
      />
    </div>
  );
};

export default Input;


