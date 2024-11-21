import { useContext, useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

interface ProtectedLayoutProps {
  requiredRoles?: string[];
}

export default function ProtectedLayout({ requiredRoles }: ProtectedLayoutProps) {
  const navigate = useNavigate();
  const { user, roles, loading } = useContext(AuthContext);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Redirect to login if the user is not authenticated
        navigate("/login");
      } else if (requiredRoles && !requiredRoles.some((role) => roles.includes(role))) {
        // Redirect to home page if user lacks the required roles
        navigate("/");
      }
    }
  }, [user, roles, loading, requiredRoles, navigate]);

  // Show a loading screen until authentication status is resolved
  if (loading) {
    return <div>Loading...</div>;
  }

  return <Outlet />;
}
