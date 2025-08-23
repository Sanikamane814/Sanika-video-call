

import axios from "axios";
import httpStatus from "http-status";
import { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";


// Create the Auth Context
export const AuthContext = createContext({});

// Axios client instance
const client = axios.create({
  baseURL: "http://localhost:8000/api/v1/users",
});

export const AuthProvider = ({ children }) => {
  const router = useNavigate();
  const [userData, setUserData] = useState({});

  // Register a new user
  const handleRegister = async (name, username, password) => {
    try {
      const response = await client.post("/register", {
        name,
        username,
        password,
      });

      if (response.status === httpStatus.CREATED) {
        return response.data.message;
      }
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  };

  // Login an existing user
  const handleLogin = async (username, password) => {
    try {
      const response = await client.post("/login", {
        username,
        password,
      });

      if (response.status === httpStatus.OK) {
        localStorage.setItem("token", response.data.token);
        router("/home");
      }
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  // Get activity history for the current user
  const getHistoryOfUser = async () => {
    try {
      const response = await client.get("/get_all_activity", {
        params: {
          token: localStorage.getItem("token"),
        },
      });

      return response.data;
    } catch (error) {
      console.error("Fetching history failed:", error);
      throw error;
    }
  };

  // Add meeting code to user history
  const addToUserHistory = async (meetingCode) => {
    try {
      const response = await client.post("/add_to_activity", {
        token: localStorage.getItem("token"),
        meeting_code: meetingCode,
      });

      return response;
    } catch (error) {
      console.error("Adding to history failed:", error);
      throw error;
    }
  };

  // Auth context value
  const value = {
    userData,
    setUserData,
    handleRegister,
    handleLogin,
    getHistoryOfUser,
    addToUserHistory,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};




