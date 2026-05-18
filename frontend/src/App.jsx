import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import Loader from "./components/Loader";

import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";

function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <Loader className="w-16 h-16" />
      </div>
    );
  }

  return (
    <>
      <Routes>
        <Route path="/" element={authUser ? <div>Home Page (Protected) - Hello {authUser.fullName} - <button onClick={() => useAuthStore.getState().logout()} className="text-indigo-600 underline">Logout</button></div> : <Navigate to="/login" />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
      </Routes>
      
      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
}

export default App;
