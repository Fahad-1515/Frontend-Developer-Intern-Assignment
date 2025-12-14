import React from 'react';

const Analytics = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Analytics Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-medium">Tasks Completed</h3>
          <p className="text-3xl font-bold mt-2">24</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-medium">Pending Tasks</h3>
          <p className="text-3xl font-bold mt-2">8</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-medium">Productivity</h3>
          <p className="text-3xl font-bold mt-2">85%</p>
        </div>
      </div>
      <p className="mt-6 text-gray-600">Analytics charts and detailed statistics will be implemented here.</p>
    </div>
  );
};

export default Analytics;
