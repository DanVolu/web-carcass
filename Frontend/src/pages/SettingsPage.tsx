import React, { useState } from "react";

const SettingsPage: React.FC = () => {
  const [showPersonalInfo, setShowPersonalInfo] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold mb-6">Settings</h1>

        {/* Personal Information Section */}
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-medium">Personal Information</h2>
            <button
              onClick={() => setShowPersonalInfo(!showPersonalInfo)}
              className="text-blue-600"
            >
              {showPersonalInfo ? "Hide" : "Edit"}
            </button>
          </div>
          {showPersonalInfo && (
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <button className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
                Save Changes
              </button>
            </div>
          )}
        </div>

        {/* Change Password Section */}
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-medium">Change Password</h2>
            <button
              onClick={() => setShowChangePassword(!showChangePassword)}
              className="text-blue-600"
            >
              {showChangePassword ? "Hide" : "Change"}
            </button>
          </div>
          {showChangePassword && (
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Current Password</label>
                <input
                  type="password"
                  placeholder="Enter current password"
                  className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">New Password</label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                <input
                  type="password"
                  placeholder="Confirm new password"
                  className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <button className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
                Change Password
              </button>
            </div>
          )}
        </div>

        {/* Notifications Settings Section */}
        <div className="mb-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-medium">Notification Settings</h2>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="text-blue-600"
            >
              {showNotifications ? "Hide" : "Configure"}
            </button>
          </div>
          {showNotifications && (
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email Notifications
                </label>
                <input type="checkbox" className="mr-2" />
                <span>Receive email notifications</span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Push Notifications
                </label>
                <input type="checkbox" className="mr-2" />
                <span>Enable push notifications</span>
              </div>
              <button className="mt-4 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
                Save Notifications Settings
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
