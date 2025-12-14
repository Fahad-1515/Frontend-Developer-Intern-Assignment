// In your API service file (e.g., src/services/api.js)
import axios from "axios";

// This is the key line - it will read from Vercel's environment
const API_URL = process.env.REACT_APP_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
