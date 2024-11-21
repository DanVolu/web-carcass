import axios from "axios";
import React, { useState } from "react";

const SettingsPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let response;
      if (email) {
        response = await axios.get(
          `http://localhost:7000/api/v1/users/user/${email}`,
          { withCredentials: true }
        );
      } else {
        response = await axios.get("http://localhost:7000/api/v1/users/users", {
          withCredentials: true,
        });
      }

      if (response.status === 200) {
        const users = Array.isArray(response.data.data)
          ? response.data.data
          : [response.data.data];
        setUsers(users);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddAdmin = async (userEmail: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.put(
        `http://localhost:7000/api/v1/users/user/${userEmail}/add-admin`,
        {},
        { withCredentials: true }
      );

      if (response.status === 200) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.email === userEmail ? { ...user, roles: [...user.roles, "admin"] } : user
          )
        );
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveAdmin = async (userEmail: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.put(
        `http://localhost:7000/api/v1/users/user/${userEmail}/remove-admin`,
        {},
        { withCredentials: true }
      );

      if (response.status === 200) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.email === userEmail
              ? { ...user, roles: user.roles.filter((role: string) => role !== "admin") }
              : user
          )
        );
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold mb-6">Admin Settings</h1>

        <form onSubmit={handleSearch} className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Search user by email (optional)"
              className="w-full px-3 py-2 border rounded"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full px-3 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </form>

        {error && <p className="text-red-500">{error}</p>}

        {users.length > 0 ? (
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-4">User List</h2>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-4 py-2 text-left">Email</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Role</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 px-4 py-2">{user.email}</td>
                    <td className="border border-gray-300 px-4 py-2">{user.roles.join(", ")}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      {user.roles.includes("admin") ? (
                        <button
                          onClick={() => handleRemoveAdmin(user.email)}
                          disabled={loading}
                          className="w-full px-3 py-2 text-white bg-red-600 rounded hover:bg-red-700"
                        >
                          {loading ? "Removing..." : "Remove admin"}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleAddAdmin(user.email)}
                          disabled={loading}
                          className="w-full px-3 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
                        >
                          {loading ? "Adding..." : "Add admin"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600 mt-6">No users found.</p>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;
