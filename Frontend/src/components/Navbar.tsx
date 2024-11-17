import React, { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom"; // Add Link from react-router-dom

const Navbar: React.FC = () => {
  const { user, setUser } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear token from storage
    setUser(null); // Reset user context
    navigate("/login"); // Redirect to login page
  };

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-blue-600 text-white relative">
      <h1 className="text-lg font-bold">MyApp</h1>
      <div className="flex items-center gap-4">
        {/* Link to Settings Page */}
        {user && (
          <Link to="/settings" className="text-white hover:text-gray-300">
            Settings
          </Link>
        )}
        <div className="relative">
          <div
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-blue-600 cursor-pointer"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            {user ? user.charAt(0).toUpperCase() : "?"}
          </div>
          {dropdownOpen && user && (
            <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md py-2">
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
