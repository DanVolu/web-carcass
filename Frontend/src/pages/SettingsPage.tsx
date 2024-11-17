import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import axios from "axios";

const SettingsPage: React.FC = () => {
  const { setIsLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const [userData, setUserData] = useState<{ email: string; nickname: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Added state for error handling

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login"); // Redirect if no token is found
          return;
        }

        const response = await axios.get("http://localhost:7000/api/v1/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`, // Pass token in Authorization header
          },
        });

        setUserData(response.data); // Set user data from response
      } catch (error) {
        console.error("Failed to fetch user data:", error);
        setError("Unable to fetch user data. Please try again.");
        navigate("/login"); // Redirect to login if fetching fails
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear token
    setIsLoggedIn(false); // Update global state
    navigate("/login"); // Redirect to login page
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-100 dark:bg-zinc-700">
        <p className="text-lg text-black dark:text-white">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 dark:bg-zinc-700">
      <div className="w-full max-w-md p-8 bg-slate-200 dark:bg-zinc-800 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-black dark:text-white mb-6">
          Settings
        </h2>

        {error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : (
          userData && (
            <div className="space-y-4">
              {/* Display user details */}
              <div>
                <label className="block text-sm font-medium text-black dark:text-white">Email:</label>
                <p className="text-black dark:text-white mt-1">{userData.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-black dark:text-white">Nickname:</label>
                <p className="text-black dark:text-white mt-1">{userData.nickname}</p>
              </div>

              {/* Logout button */}
              <button
                onClick={handleLogout}
                className="w-full py-2 mt-4 text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Logout
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default SettingsPage;
