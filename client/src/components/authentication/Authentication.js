import React, { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from 'react-toastify';

const Authentication = () => {
  const { isAuthenticated, isLoading, user } = useAuth0();
  const navigate = useNavigate();
  
  // const port = "http://localhost:5000";
  const port  = "https://signal-cipher.vercel.app";

  const storeUserInfo = async () => {
    try {
      const response = await axios.post(`${port}/Userinfo`, {
        UserEmail: user.email,
        UserName : user.name
      });
      console.log(response.data.message);
    } catch (error) {
      console.error('Error storing user info:', error);
      toast.error('Failed to store user information');
    }
  };

  const HandleStart = () => {
    if (!isAuthenticated) {
      toast.warning("Please Login to Start");
    } else {
      // Navigate directly to the first page without showing rules
      navigate("/page-one");
    }
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      storeUserInfo();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-12 animate-fade-in">
      <div className="card max-w-2xl w-full text-center animate-scale-in">
        <h1 className="text-3xl sm:text-4xl font-bold text-gradient mb-6">
          Welcome {user ? user.name : "to SignalCipher"}!
        </h1>
        <p className="text-text-secondary text-base sm:text-lg leading-relaxed mb-8">
          "Your journey into the enigmatic world of SignalCipher begins here. Decode, solve, and conquer!"
        </p>
        <button
          className="btn-primary w-full sm:w-auto"
          onClick={HandleStart}
        >
          Start Quiz
        </button>
      </div>
    </div>
  );
};

export default Authentication;