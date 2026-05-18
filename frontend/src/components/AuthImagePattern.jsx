const AuthImagePattern = ({ title, subtitle }) => {
  return (
    <div className="hidden lg:flex items-center justify-center bg-indigo-50 p-12 relative overflow-hidden">
      {/* Decorative background shapes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-indigo-200/30 blur-3xl"></div>
        <div className="absolute top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-indigo-300/20 blur-3xl"></div>
        <div className="absolute -bottom-[10%] left-[20%] w-[60%] h-[60%] rounded-full bg-indigo-100/40 blur-3xl"></div>
      </div>

      <div className="max-w-md text-center z-10 relative">
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className={`aspect-square rounded-2xl bg-indigo-600/10 ${
                [0, 2, 4, 6, 8].includes(i) ? "animate-pulse" : ""
              } flex items-center justify-center`}
            >
              {[0, 2, 4, 6, 8].includes(i) && (
                <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
              )}
            </div>
          ))}
        </div>
        <h2 className="text-3xl font-bold mb-4 text-slate-800">{title}</h2>
        <p className="text-slate-600">{subtitle}</p>
      </div>
    </div>
  );
};

export default AuthImagePattern;
