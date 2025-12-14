import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { Toaster } from "react-hot-toast";
import { GoogleOAuthProvider } from "@react-oauth/google";

// Components
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Tasks from "./pages/Tasks";
import CalendarView from "./pages/CalendarView";
import TaskDetail from "./pages/TaskDetail";
import Settings from "./pages/Settings";

// Context
import { AuthProvider } from "./contexts/AuthContext";

const queryClient = new QueryClient();

function App() {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-gray-50">
              <Toaster position="top-right" />
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/"
                  element={
                    <Layout>
                      <Dashboard />
                    </Layout>
                  }
                />
                <Route
                  path="/tasks"
                  element={
                    <Layout>
                      <Tasks />
                    </Layout>
                  }
                />
                <Route
                  path="/calendar"
                  element={
                    <Layout>
                      <CalendarView />
                    </Layout>
                  }
                />
                <Route
                  path="/task/:id"
                  element={
                    <Layout>
                      <TaskDetail />
                    </Layout>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <Layout>
                      <Settings />
                    </Layout>
                  }
                />
              </Routes>
            </div>
          </Router>
        </AuthProvider>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
