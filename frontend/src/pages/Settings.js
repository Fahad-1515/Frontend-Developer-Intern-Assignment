import React from 'react';

const Settings = () => {
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <div className="space-y-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-medium mb-2">Profile Settings</h3>
          <p className="text-gray-600">Update your name, email, and profile picture.</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-medium mb-2">Notification Preferences</h3>
          <p className="text-gray-600">Configure email and push notifications.</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-medium mb-2">Calendar Integration</h3>
          <p className="text-gray-600">Connect to Google Calendar and configure sync settings.</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-medium mb-2">Security</h3>
          <p className="text-gray-600">Change password and manage two-factor authentication.</p>
        </div>
      </div>
      
      <div className="mt-8">
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 mr-3">
          Save Changes
        </button>
        <button className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default Settings;
