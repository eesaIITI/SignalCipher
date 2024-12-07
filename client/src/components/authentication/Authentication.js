import React, { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import "./Authentication.css"; // New CSS file for styling

const Authentication = () => {
  const { isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/page-one");
    }
  }, [isAuthenticated, navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="authentication">
      <div className="auth-content">
        <h1 className="head">Welcome to the Quiz App</h1>
        <p className="para">Please log in using the button in the navbar to access the quiz.</p>
      </div>
    </div>
  );
};

export default Authentication;
