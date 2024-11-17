// src/App.tsx
import React, { ReactNode } from "react";
import {
  Route,
  RouterProvider,
  createRoutesFromElements,
  createBrowserRouter,
} from "react-router-dom";

// Pages
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import MainPage from "./pages/HomePage";
import SettingsPage from "./pages/SettingsPage";

import Navbar from "./components/Navbar"; // Import Navbar
import { AuthProvider } from "./contexts/AuthContext"; // Import AuthProvider

// Layout component
interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Navbar /> {/* Navbar always present */}
      <main className="mt-16">{children}</main> {/* Offset for Navbar height */}
    </>
  );
};

// Create the router with routes
const routes = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route
        path="/"
        element={
          <Layout>
            <MainPage /> {/* Main entry point for your app */}
          </Layout>
        }
      />
      <Route
        path="/register"
        element={
          <Layout>
            <RegisterPage />
          </Layout>
        }
      />
      <Route
        path="/login"
        element={
          <Layout>
            <LoginPage />
          </Layout>
        }
      />
            <Route
        path="/settings"
        element={
          <Layout>
            <SettingsPage />
          </Layout>
        }
      />
      <Route
        path="/items"
        element={
          <Layout>
            <div>Items Page (To be implemented)</div>
          </Layout>
        }
      />
    </>
  )
);

// Main App component
export default function App() {
  return (
    <AuthProvider> {/* Wrap App with AuthProvider */}
      <RouterProvider router={routes} />
    </AuthProvider>
  );
}
