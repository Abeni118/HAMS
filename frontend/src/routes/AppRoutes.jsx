import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

import ProtectedRoute from "../components/ProtectedRoute";
import DashboardLayout from "../components/DashboardLayout";

// Auth Pages
import LoginPage from "../pages/LoginPage";
import SignUpPage from "../pages/SignUpPage";

import PatientDashboard from "../pages/PatientDashboard";
import AppointmentsPage from "../pages/patient/AppointmentsPage";
import ProfilePage from "../pages/patient/ProfilePage";
import ReportsPage from "../pages/patient/ReportsPage";
import SettingsPage from "../pages/patient/SettingsPage";

import DoctorDashboard from "../pages/DoctorDashboard";
import SchedulePage from "../pages/doctor/SchedulePage";
import PatientsPage from "../pages/doctor/PatientsPage";
import DoctorReportsPage from "../pages/doctor/ReportsPage";
import DoctorProfilePage from "../pages/doctor/ProfilePage";
import DoctorSettingsPage from "../pages/doctor/SettingsPage";
import NurseDashboard from "../pages/NurseDashboard";
import VitalsPage from "../pages/nurse/VitalsPage";
import QueuePage from "../pages/nurse/QueuePage";
import NurseReportsPage from "../pages/nurse/ReportsPage";
import NurseSettingsPage from "../pages/nurse/SettingsPage";
import NurseProfilePage from "../pages/nurse/ProfilePage";
import AdminDashboard from "../pages/AdminDashboard";

const AppRoutes = () => {
  const { authUser } = useAuthStore();

  return (
    <Routes>
      {/* Root Route - Redirects to appropriate dashboard or login */}
      <Route 
        path="/" 
        element={
          authUser ? <Navigate to={`/${authUser.role}`} replace /> : <Navigate to="/login" replace />
        } 
      />

      {/* Auth Routes */}
      <Route 
        path="/login" 
        element={!authUser ? <LoginPage /> : <Navigate to={`/${authUser.role}`} replace />} 
      />
      <Route 
        path="/signup" 
        element={!authUser ? <SignUpPage /> : <Navigate to={`/${authUser.role}`} replace />} 
      />

      {/* Protected Dashboard Layout */}
      <Route element={<DashboardLayout />}>
        
        {/* Patient Routes */}
        <Route 
          path="/patient/*" 
          element={
            <ProtectedRoute allowedRoles={["patient"]}>
              <Routes>
                <Route path="" element={<PatientDashboard />} />
                <Route path="appointments" element={<AppointmentsPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="reports" element={<ReportsPage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Routes>
            </ProtectedRoute>
          } 
        />

        {/* Doctor Routes */}
        <Route 
          path="/doctor/*" 
          element={
            <ProtectedRoute allowedRoles={["doctor"]}>
              <Routes>
                <Route path="" element={<DoctorDashboard />} />
                <Route path="schedule" element={<SchedulePage />} />
                <Route path="patients" element={<PatientsPage />} />
                <Route path="reports" element={<DoctorReportsPage />} />
                <Route path="profile" element={<DoctorProfilePage />} />
                <Route path="settings" element={<DoctorSettingsPage />} />
                {/* Add more doctor routes here */}
              </Routes>
            </ProtectedRoute>
          } 
        />

        {/* Nurse Routes */}
        <Route 
          path="/nurse/*" 
          element={
            <ProtectedRoute allowedRoles={["nurse"]}>
              <Routes>
                <Route path="" element={<NurseDashboard />} />
                <Route path="vitals" element={<VitalsPage />} />
                <Route path="queue" element={<QueuePage />} />
                <Route path="reports" element={<NurseReportsPage />} />
                <Route path="profile" element={<NurseProfilePage />} />
                <Route path="settings" element={<NurseSettingsPage />} />
                {/* Add more nurse routes here */}
              </Routes>
            </ProtectedRoute>
          } 
        />

        {/* Admin Routes */}
        <Route 
          path="/admin/*" 
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <Routes>
                <Route path="" element={<AdminDashboard />} />
                {/* Add more admin routes here */}
              </Routes>
            </ProtectedRoute>
          } 
        />

      </Route>

      {/* Catch-all route for 404s */}
      <Route 
        path="*" 
        element={
          authUser ? <Navigate to={`/${authUser.role}`} replace /> : <Navigate to="/login" replace />
        } 
      />
    </Routes>
  );
};

export default AppRoutes;
