import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import "./Authentication.css";
import axios from "axios";

const Authentication = () => {
  const { isAuthenticated, isLoading, user } = useAuth0();
  const navigate = useNavigate();
  const [showRules, setShowRules] = useState(false);

  const storeUserInfo = async () => {
    try {
      const response = await axios.post('http://localhost:5000/Userinfo', {
        UserEmail: user.email,
        UserName: user.name
      });
      console.log(response.data.message);
     
    } catch (error) {
      console.error('Error storing user info:', error);
    }
  };

  const HandleStart =() =>{
    if(!isAuthenticated)
    {
      alert("Please Login to Start");
    }
    else{
      setShowRules(true);

    }


  }
  const handleProceed = () => {
    setShowRules(false); // Hide rules popup
    navigate("/page-one"); // Navigate to the next page
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
        <p className="para">
          This is EESA's event of dont know bruh me just coded
        </p>
        <button
          className="center-button"
          onClick={HandleStart} // Show rules before proceeding
        >
          Start Quiz
        </button>
      </div>

      {/* Rules Popup */}
      {showRules && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h2 className="popup-header">Rules</h2>
            <ul className="popup-rules">
              <li>Rule 1: No cheating during the quiz.</li>
              <li>Rule 2: Each question has a time limit.</li>
              <li>Rule 3: Complete the quiz in one session.</li>
              <li>Rule 4: Your progress will not be saved.</li>
            </ul>
            <div className="popup-actions">
              <button
                className="popup-cancel"
                onClick={() => setShowRules(false)}
              >
                Back
              </button>
              <button className="popup-proceed" onClick={handleProceed}>
                Proceed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Authentication;
