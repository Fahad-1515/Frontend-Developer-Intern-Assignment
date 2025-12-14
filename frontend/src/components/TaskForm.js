import React, { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import taskService from "../services/taskService";
import calendarService from "../services/calendarService";

const TaskForm = ({ task, onSuccess, onCancel }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: task || {
      title: "",
      description: "",
      priority: "medium",
      reminders: {
        email: true,
        notification: true,
        minutesBefore: 30,
      },
    },
  });

  const [startDate, setStartDate] = useState(
    task?.startTime ? new Date(task.startTime) : new Date()
  );
  const [endDate, setEndDate] = useState(
    task?.endTime
      ? new Date(task.endTime)
      : new Date(Date.now() + 60 * 60 * 1000)
  );
  const [attendees, setAttendees] = useState(task?.attendees || []);
  const [attendeeEmail, setAttendeeEmail] = useState("");
  const [syncWithGoogle, setSyncWithGoogle] = useState(true);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      const taskData = {
        ...data,
        startTime: startDate,
        endTime: endDate,
        attendees,
      };

      let savedTask;

      if (task?._id) {
        savedTask = await taskService.updateTask(task._id, taskData);
        toast.success("Task updated successfully");
      } else {
        savedTask = await taskService.createTask(taskData);
        toast.success("Task created successfully");
      }

      // Sync with Google Calendar
      if (syncWithGoogle) {
        try {
          const calendarResponse = await calendarService.syncTask(
            savedTask._id
          );
          toast.success("Task synced with Google Calendar");

          // Send notifications to attendees
          await taskService.sendNotifications(savedTask._id);
          toast.success("Notifications sent to attendees");
        } catch (calendarError) {
          console.error("Calendar sync error:", calendarError);
          toast.error("Failed to sync with Google Calendar");
        }
      }

      onSuccess(savedTask);
    } catch (error) {
      console.error("Error saving task:", error);
      toast.error(error.message || "Failed to save task");
    } finally {
      setLoading(false);
    }
  };

  const addAttendee = () => {
    if (attendeeEmail && /\S+@\S+\.\S+/.test(attendeeEmail)) {
      setAttendees([
        ...attendees,
        { email: attendeeEmail, responseStatus: "needsAction" },
      ]);
      setAttendeeEmail("");
    }
  };

  const removeAttendee = (index) => {
    setAttendees(attendees.filter((_, i) => i !== index));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Task Title *
        </label>
        <input
          {...register("title", { required: "Title is required" })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter task title"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          {...register("description")}
          rows="3"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter task description"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Start Time *
          </label>
          <DatePicker
            selected={startDate}
            onChange={setStartDate}
            showTimeSelect
            dateFormat="MMMM d, yyyy h:mm aa"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            End Time *
          </label>
          <DatePicker
            selected={endDate}
            onChange={setEndDate}
            showTimeSelect
            dateFormat="MMMM d, yyyy h:mm aa"
            minDate={startDate}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Priority
        </label>
        <select
          {...register("priority")}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Attendees
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="email"
            value={attendeeEmail}
            onChange={(e) => setAttendeeEmail(e.target.value)}
            placeholder="Enter email address"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
          />
          <button
            type="button"
            onClick={addAttendee}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            Add
          </button>
        </div>

        <div className="space-y-2">
          {attendees.map((attendee, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded"
            >
              <span className="text-sm">{attendee.email}</span>
              <button
                type="button"
                onClick={() => removeAttendee(index)}
                className="text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          checked={syncWithGoogle}
          onChange={(e) => setSyncWithGoogle(e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label className="ml-2 block text-sm text-gray-700">
          Sync with Google Calendar
        </label>
      </div>

      <div className="flex gap-3 justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 hover:text-gray-900"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Saving..." : task ? "Update Task" : "Create Task"}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
