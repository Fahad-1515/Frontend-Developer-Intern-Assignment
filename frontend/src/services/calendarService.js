import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const calendarService = {
  // Connect to Google Calendar
  connectGoogleCalendar: async (accessToken) => {
    const response = await axios.post(
      `${API_URL}/calendar/connect`,
      { accessToken },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  },

  // Sync task with Google Calendar
  syncTask: async (taskId) => {
    const response = await axios.post(
      `${API_URL}/calendar/sync-task/${taskId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  },

  // Get calendar events
  getEvents: async () => {
    const response = await axios.get(`${API_URL}/calendar/events`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  },

  // Google OAuth URL
  getGoogleAuthUrl: () => {
    const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    const redirectUri = encodeURIComponent(
      `${window.location.origin}/auth/google/callback`
    );
    const scope = encodeURIComponent(
      "https://www.googleapis.com/auth/calendar"
    );
    return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&access_type=offline&prompt=consent`;
  },
};

export default calendarService;
