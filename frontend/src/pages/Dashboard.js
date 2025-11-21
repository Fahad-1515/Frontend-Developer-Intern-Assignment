// frontend/src/pages/Dashboard.js
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 py-6 sm:px-0">
        <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            This is your dashboard. Manage your profile and tasks from here.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              to="/profile"
              className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-300"
            >
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Profile Management
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Update your personal information and preferences
                </p>
              </div>
            </Link>

            <Link
              to="/tasks"
              className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-300"
            >
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Task Management
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Create, view, and manage your tasks
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
