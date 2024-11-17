import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

// Define the AuthContext props interface
interface AuthContextProps {
  user: string | null; // This will hold the user's email
  setUser: (email: string | null) => void;
}

// Create the AuthContext with default values
export const AuthContext = createContext<AuthContextProps>({
  user: null,
  setUser: () => {},
});

// AuthProvider component to provide user context throughout the app
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<string | null>(null);

  useEffect(() => {
    // On initial load, make a request to the backend to check if the user is authenticated
    axios
      .get("http://localhost:7000/api/v1/auth/status", { withCredentials: true }) // Ensure the request includes cookies
      .then((response) => {
        if (response.data?.authorized) {
          setUser(response.data?.data?.email); // Set the user email if authenticated
        } else {
          setUser(null); // If not authenticated, clear the user
        }
      })
      .catch((error) => {
        console.error("Error fetching user status:", error);
        setUser(null); // Clear the user if there's an error (e.g., invalid or expired token)
      });
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
