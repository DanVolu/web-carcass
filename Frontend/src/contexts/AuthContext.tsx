import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

// Define the AuthContext props interface
interface AuthContextProps {
  user: string | null; // User email
  roles: string[]; // Array of user roles
  setUser: (email: string | null, roles?: string[]) => void;
  loading: boolean; // To track if authentication status is being determined
  refresh: boolean; // Trigger to refresh components
  setRefresh: () => void; // Function to toggle refresh
}

// Create the AuthContext with default values
export const AuthContext = createContext<AuthContextProps>({
  user: null,
  roles: [],
  setUser: () => {},
  loading: true,
  refresh: false,
  setRefresh: () => {},
});

// AuthProvider component to provide user context throughout the app
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<string | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refresh, setRefreshState] = useState(false);

  const setRefresh = () => setRefreshState((prev) => !prev);

  useEffect(() => {
    // On initial load, make a request to the backend to check if the user is authenticated
    axios
      .get("http://localhost:7000/api/v1/auth/status", { withCredentials: true })
      .then((response) => {
        if (response.data?.authorized) {
          setUser(response.data?.data?.email);
          setRoles(response.data?.data?.roles || []); // Set roles from the response
        } else {
          setUser(null);
          setRoles([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching user status:", error);
        setUser(null);
        setRoles([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [refresh]); // Refresh the status when the `refresh` state changes

  return (
    <AuthContext.Provider
      value={{ user, roles, setUser: (email, roles) => {
        setUser(email);
        setRoles(roles || []);
        setRefresh(); // Trigger refresh on user change
      }, loading, refresh, setRefresh }}
    >
      {children}
    </AuthContext.Provider>
  );
};
