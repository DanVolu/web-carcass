import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null); // State for success message
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null); // Reset success message on new submission

    try {
      // Send POST request to the registration endpoint
      const response = await axios.post("http://localhost:7000/api/v1/auth/register", {
        username,
        email,
        password,
        repeat_password: repeatPassword,
      });

      // Check for successful registration
      if (response.status === 201) {
        setSuccess("Registration successful! You can now log in."); // Set success message
        setTimeout(() => {
          navigate("/login"); // Redirect to login after a short delay
        }, 2000);
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
        <h2 className="text-2xl font-bold text-center text-black dark:text-white">Register</h2>

        {/* Display success message */}
        {success && <div className="text-green-500 text-center">{success}</div>}

        {/* Display error message */}
        {error && <div className="text-red-500 text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-black dark:text-white">Username:</label>
            <input
              type="text"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="mt-1 block w-full p-2 border border-slate-300 dark:border-zinc-950 bg-slate-50 dark:bg-zinc-900 text-black dark:text-white rounded-md focus:ring focus:ring-blue-300"
              required
            />
          </div>
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
          <div>
            <label className="block text-sm font-medium text-black dark:text-white">Confirm Password:</label>
            <input
              type="password"
              name="repeatPassword"
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.target.value)}
              className="mt-1 block w-full p-2 border border-slate-300 dark:border-zinc-950 bg-slate-50 dark:bg-zinc-900 text-black dark:text-white rounded-md focus:ring focus:ring-blue-300"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 mt-4 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p className="text-sm text-center text-gray-600">
          Already have an account? <a href="/login" className="text-blue-600 hover:underline">Login here</a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
