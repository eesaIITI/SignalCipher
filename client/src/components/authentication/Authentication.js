import React, { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import "./Authentication.css"; // New CSS file for styling
import axios from "axios"; 

const Authentication = () => {
  const { isAuthenticated, isLoading , user} = useAuth0();
  const navigate = useNavigate();
  const storeUserInfo = async () => {
    try {
      const response = await axios.post('http://localhost:5000/Userinfo', {
        UserEmail: user.email,
        UserName: user.name
      });
      console.log(response.data.message); // Log the response message from the server
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
        <p className="para">Please log in using the button in the navbar to access the quiz.</p>
      </div>
    </div>
  );
};

export default Authentication;
