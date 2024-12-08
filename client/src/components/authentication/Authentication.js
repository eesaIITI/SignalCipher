import React, { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import "./Authentication.css";
import axios from "axios";

const Authentication = () => {
  const { isAuthenticated, isLoading, user } = useAuth0();
  const navigate = useNavigate();

  const storeUserInfo = async () => {
    try {
      const response = await axios.post('http://localhost:5000/Userinfo', {
        UserEmail: user.email,
        UserName: user.name
      });
      console.log(response.data.message);
      navigate("/page-one");
    } catch (error) {
      console.error('Error storing user info:', error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      storeUserInfo();
    }
  }, [isAuthenticated, navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="authentication">
      <div className="auth-content">
        <h1 className="head">Welcome to the Quiz App</h1>
        <p className="para">Please log in using the button below to access the quiz.</p>
        <button className="center-button">Start Quiz</button>
        
      </div>
    </div>
  );
};

export default Authentication;
