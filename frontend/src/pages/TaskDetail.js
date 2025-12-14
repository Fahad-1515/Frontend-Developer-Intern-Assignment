// frontend/src/pages/TaskDetail.js
import React from 'react';
import { useParams } from 'react-router-dom';

const TaskDetail = () => {
  const { id } = useParams();
  
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Task Details</h1>
      <p className="text-gray-600">Task ID: {id}</p>
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <p>Task detail view will be implemented here.</p>
        <p className="mt-2 text-sm text-gray-500">
          This page will show complete details of a specific task.
        </p>
      </div>
    </div>
  );
};

export default TaskDetail;
