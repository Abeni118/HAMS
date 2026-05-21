import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import HealthcareLoader from "./components/HealthcareLoader";
import AppRoutes from "./routes/AppRoutes";

function App() {
  const { checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <HealthcareLoader className="w-20 h-20 text-[#698bf4]" />
      </div>
    );
  }

  return (
    <>
      <AppRoutes />
      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
}

export default App;
