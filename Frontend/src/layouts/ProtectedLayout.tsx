import { useContext, useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

export default function ProtectedLayout() {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (!user) {
      // Redirect to login if user is not logged in
      navigate("/");
    }
  }, [user, navigate]);

  return <Outlet />;
}
