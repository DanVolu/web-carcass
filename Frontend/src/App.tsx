import { Route, RouterProvider, createRoutesFromElements, createBrowserRouter } from "react-router-dom";

// Pages
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";

// Optionally, you can create a HomePage or WelcomePage if needed
// import HomePage from "./pages/HomePage";

// Create the router with routes
const routes = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* You can create a root route that redirects to the LoginPage */}
      <Route path="/" element={<LoginPage />} /> {/* Main entry point for your app */}
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
    </>
  )
);

// Main App component
export default function App() {
  return (
    <RouterProvider router={routes} />
  );
}
