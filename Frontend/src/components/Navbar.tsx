import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext"; // Import AuthContext

const Navbar: React.FC = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext); // Access auth state
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsLoggedIn(false); // Update auth state
    localStorage.removeItem("token"); // Clear stored auth token
    navigate("/login"); // Redirect to login page
  };

  return (
    <nav className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center">
      {/* Left side navigation */}
      <div className="flex items-center space-x-4">
        <Link to="/" className="text-lg font-semibold hover:underline">
          Home
        </Link>
        <Link to="/items" className="text-lg font-semibold hover:underline">
          Items
        </Link>
      </div>

      {/* Right side user menu */}
      <div className="relative">
        <button
          onClick={() => setIsUserMenuOpen((prev) => !prev)}
          className="flex items-center space-x-2 bg-blue-800 px-3 py-2 rounded-full hover:bg-blue-700 focus:outline-none"
        >
          <span className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-black font-bold">
            {isLoggedIn ? "U" : "?"} {/* User initials or generic icon */}
          </span>
        </button>

        {/* Dropdown menu */}
        {isUserMenuOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white text-black rounded-lg shadow-lg">
            {isLoggedIn ? (
              <>
                <Link
                  to="/settings"
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
