import React, { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";


const Navbar: React.FC = () => {
  const { user, roles, setUser } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    axios
      .post("http://localhost:7000/api/v1/auth/logout", {}, { withCredentials: true })
      .then(() => {
        setUser(null); // Clear the user from context
        navigate("/login");
      })
      .catch((error) => {
        console.error("Error logging out:", error);
      });
  };

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-blue-600 text-white relative">
      <Link to={"/"} className="text-lg font-bold">
        MyApp
      </Link>
      <div className="flex items-center gap-4">
        {/* Product route, visible only if user is logged in */}
        {user && (
          <Link to="/products" className="text-white hover:text-gray-300">
            Products
          </Link>
        )}

        {/* Cart Icon, visible only to logged-in users */}
        {user && (
          <Link to="/cart" className="text-white hover:text-gray-300">
            Cart
          </Link>
        )}

        {/* Settings visible to admins */}
        {user && roles.includes("admin") && (
          <Link to="/settings" className="text-white hover:text-gray-300">
            Settings
          </Link>
        )}

        {/* Conditionally render login or user bubble */}
        {user ? (
          <div className="relative">
            <div
              className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-blue-600 cursor-pointer"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              {user.charAt(0).toUpperCase()} {/* Display user initial */}
            </div>
            {dropdownOpen && (
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
        ) : (
          <Link to="/login" className="text-white hover:text-gray-300">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
