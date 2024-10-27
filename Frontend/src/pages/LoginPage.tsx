import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Send POST request to the login endpoint
      const response = await axios.post("http://localhost:7000/api/v1/auth/login", {
        email,
        password,
      });

      // Handle successful login
      if (response.status === 200) {
        // Store the token in localStorage (optional)
        localStorage.setItem('token', response.data.token); // Ensure your API returns a token
        navigate("/register"); // Redirect to the register page after successful login
      }
    } catch (err: any) {
      // Handle error response
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("An error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 dark:bg-zinc-700">
      <div className="w-full max-w-md p-8 space-y-6 bg-slate-200 dark:bg-zinc-800 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-black dark:text-white">Login</h2>

        {/* Display error message */}
        {error && <div className="text-red-500 text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-black dark:text-white">Email:</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full p-2 border border-slate-300 dark:border-zinc-950 bg-slate-50 dark:bg-zinc-900 text-black dark:text-white rounded-md focus:ring focus:ring-blue-300"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-black dark:text-white">Password:</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full p-2 border border-slate-300 dark:border-zinc-950 bg-slate-50 dark:bg-zinc-900 text-black dark:text-white rounded-md focus:ring focus:ring-blue-300"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 mt-4 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="text-sm text-center text-gray-600">
          Don't have an account? <a href="/register" className="text-blue-600 hover:underline">Register here</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
