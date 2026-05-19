import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { authUser, isCheckingAuth } = useAuthStore();

  if (isCheckingAuth) {
    return null; // Will be handled by the global loader in App.jsx
  }

  if (!authUser) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(authUser.role)) {
    // Redirect to their specific dashboard if they try to access unauthorized roles
    return <Navigate to={`/${authUser.role}`} replace />;
  }

  return children;
};

export default ProtectedRoute;
