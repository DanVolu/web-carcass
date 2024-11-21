import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

// Define the AuthContext props interface
interface AuthContextProps {
  user: string | null; // User email
  roles: string[]; // Array of user roles
  setUser: (email: string | null, roles?: string[]) => void;
  loading: boolean; // To track if authentication status is being determined
}

// Create the AuthContext with default values
export const AuthContext = createContext<AuthContextProps>({
  user: null,
  roles: [],
  setUser: () => {},
  loading: true,
});

// AuthProvider component to provide user context throughout the app
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<string | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

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
  }, []);

  return (
    <AuthContext.Provider value={{ user, roles, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
