import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import SettingsPage from "./pages/SettingsPage"; // Import the SettingsPage
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedLayout from "./layouts/ProtectedLayout"; // Import ProtectedLayout

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protect routes inside the ProtectedLayout */}
          <Route element={<ProtectedLayout />}>
            <Route path="/" element={<div>Welcome to the Home Page!</div>} />
            <Route path="/profile" element={<div>Profile Page</div>} /> {/* Example Protected Route */}
            <Route path="/settings" element={<SettingsPage />} /> {/* New Settings Route */}
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
