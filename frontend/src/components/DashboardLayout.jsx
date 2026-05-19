import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 font-sans text-slate-800">
      <Sidebar />
      {/* Main Wrapper */}
      <div className="flex-1 flex flex-col h-screen ml-64 overflow-hidden">
        <Navbar />
        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto bg-slate-50 relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
