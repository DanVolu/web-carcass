import axios from "axios";
import React, { useState, useEffect } from "react";

const SettingsPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<any[]>([]); // User list
  const [admins, setAdmins] = useState<any[]>([]); // Admin list
  const [isAdminListVisible, setIsAdminListVisible] = useState(false); // Track visibility of admin list

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault(); // Prevent form submission if the event is passed
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

  const fetchAdmins = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get("http://localhost:7000/api/v1/users/admins", {
        withCredentials: true,
      });

      if (response.status === 200) {
        setAdmins(response.data.data);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred while fetching admins.");
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
        // Update the users list to reflect the admin addition
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user.email === userEmail ? { ...user, roles: [...user.roles, "admin"] } : user
          )
        );

        // Fetch updated admin list
        fetchAdmins();
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
        // Update admin list and user list after admin removal
        fetchAdmins(); // Refresh the admins list
        handleSearch(); // Refresh the users list
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchAdmins();
    handleSearch();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-semibold mb-6 text-center text-gray-800">Admin Settings</h1>

        <form onSubmit={handleSearch} className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-600">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Search user by email (optional)"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition duration-200"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </form>

        {error && <p className="text-red-500 text-center">{error}</p>}

        {/* Display the user list */}
        {users.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">User List</h2>
            <table className="w-full border-collapse table-auto rounded-lg shadow-md">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-4 py-2 text-left text-sm text-gray-700">Email</th>
                  <th className="px-4 py-2 text-left text-sm text-gray-700">Role</th>
                  <th className="px-4 py-2 text-left text-sm text-gray-700">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={index} className="border-b">
                    <td className="px-4 py-2">{user.email}</td>
                    <td className="px-4 py-2">{user.roles.join(", ")}</td>
                    <td className="px-4 py-2">
                      {user.roles.includes("admin") ? (
                        <button
                          onClick={() => handleRemoveAdmin(user.email)}
                          disabled={loading}
                          className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:bg-red-300 transition duration-200"
                        >
                          {loading ? "Removing..." : "Remove admin"}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleAddAdmin(user.email)}
                          disabled={loading}
                          className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition duration-200"
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
        )}

        {/* Admin List Toggle */}
        <div className="mt-6 text-center">
          <button
            onClick={() => setIsAdminListVisible((prev) => !prev)}
            className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition duration-200"
          >
            {isAdminListVisible ? "Hide Admin List" : "Show Admin List"}
          </button>
        </div>

        {/* Collapsible Admin List */}
        <div className={`transition-all duration-300 ${isAdminListVisible ? "max-h-full" : "max-h-0 overflow-hidden"}`}>
          {isAdminListVisible && admins.length > 0 && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Admin List</h2>
              <table className="w-full border-collapse table-auto rounded-lg shadow-md">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm text-gray-700">Email</th>
                    <th className="px-4 py-2 text-left text-sm text-gray-700">Role</th>
                    <th className="px-4 py-2 text-left text-sm text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.map((admin, index) => (
                    <tr key={index} className="border-b">
                      <td className="px-4 py-2">{admin.email}</td>
                      <td className="px-4 py-2">{admin.roles.join(", ")}</td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => handleRemoveAdmin(admin.email)}
                          disabled={loading}
                          className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:bg-red-300 transition duration-200"
                        >
                          {loading ? "Removing..." : "Remove admin"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
