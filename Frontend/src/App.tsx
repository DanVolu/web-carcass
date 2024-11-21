import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Components
import Navbar from "./components/Navbar";

import { AuthProvider } from "./contexts/AuthContext";
import ProtectedLayout from "./layouts/ProtectedLayout";

// Pages Forms
import MainPage from "./pages/HomePage";
import LoginForm from "./forms/LoginForm";
import RegisterForm from "./forms/RegisterForm";
import SettingsPage from "./pages/SettingsPage";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />

          {/* Protect routes inside the ProtectedLayout */}
          <Route element={<ProtectedLayout />}>
            <Route path="/" element={<MainPage />} />
          </Route>

          {/* Protect settings route for admin users */}
          <Route element={<ProtectedLayout requiredRoles={["admin"]} />}>
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
