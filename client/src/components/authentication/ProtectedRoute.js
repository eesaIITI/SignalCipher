import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element }) => {
  const { isAuthenticated, isLoading, user } = useAuth0();

  // ✅ List of allowed admin emails
  const adminEmails = [
    "ee230002051@iiti.ac.in",
    "piyushraj07092005@gmail.com",
  ]; 

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // If not logged in → redirect to "/"
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // ✅ If user is not in the admin list → redirect or show message
  if (!adminEmails.includes(user?.email)) {
    return (
      <div
        style={{
          textAlign: "center",
          marginTop: "20vh",
          fontSize: "1.2rem",
          color: "#ff4444",
        }}
      >
        <h2>Access Denied 🚫</h2>
        <p>You are not authorized to view this page.</p>
      </div>
    );
  }

  // ✅ If user is authenticated and authorized → allow access
  return element;
};

export default ProtectedRoute;
