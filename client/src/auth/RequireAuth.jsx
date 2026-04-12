import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import loadingSpinner from "../components/loadingSpinner";

export default function RequireAuth({ children }) {
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return <loadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login-required" replace />;
  }

  return children;
}
