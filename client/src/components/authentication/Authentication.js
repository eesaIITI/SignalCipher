import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import "./Authentication.css";
import axios from "axios";

const Authentication = () => {
  const { isAuthenticated, isLoading, user } = useAuth0();
  const navigate = useNavigate();
  const [showRules, setShowRules] = useState(false);
  
  const port  = "https://signal-cipher.vercel.app";

  const storeUserInfo = async () => {
    try {
      const response = await axios.post(`${port}/Userinfo`, {
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
        <h1 className="head">Welcome Adventurer!</h1>
        <p className="para">
        Your journey into the enigmatic world of SignalCipher begins here. Decode, solve, and conquer!"
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
  <div
    className="popup-overlay"
    style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    }}
  >
    <div
      className="popup-content"
      style={{
        backgroundColor: 'white',
        borderRadius: '10px',
        padding: '20px',
        width: '90%',
        maxWidth: '400px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        overflowY: 'auto',
        maxHeight: '90%',
      }}
    >
      <h2
        className="popup-header"
        style={{
          fontSize: '1.5em',
          marginBottom: '15px',
          textAlign: 'center',
        }}
      >
        Rules
      </h2>
      <ul
        className="popup-rules"
        style={{
          listStyleType: 'none',
          padding: 0,
          fontSize: '1em',
          lineHeight: '1.5',
        }}
      >
        <li style={{ marginBottom: '10px' }}>
          Rule 1: The competition is open to all registered participants. To
          participate, kindly complete the registration by filling out the
          provided Google form: [Google form link]
        </li>
        <li style={{ marginBottom: '10px' }}>
          Rule 2: Participants may enter the competition either individually or
          as part of a team, with team sizes ranging from 1 to 2 members.
        </li>
        <li style={{ marginBottom: '10px' }}>
          Rule 3: All flags in the competition{' '}
          <a style={{ color: 'black' }}>must follow the format: eesa{"{flag}"}</a>,
          (note that flag means answer)
        </li>
        <li style={{ marginBottom: '10px' }}>
          Rule 4: Sharing solutions, flags, or hints with other participants or
          teams is strictly prohibited.
        </li>
        <li style={{ marginBottom: '10px' }}>
          Rule 5: Participants are free to use internet sources or any AI tool
          during the competition.
        </li>
        <li style={{ marginBottom: '10px' }}>
          Rule 6: The competition will run from 13/12/2024 to 3/1/2025. Ensure
          that all submissions are made within this time frame.
        </li>
        <li style={{ marginBottom: '10px' }}>
          Rule 7: Participants are required to solve the questions at the
          earliest. Teams that submit solutions earlier will receive higher
          rankings.
        </li>
        <li style={{ marginBottom: '10px' }}>
          Rule 8: In case of any queries, participants are encouraged to reach
          out through EESA’s official Instagram page or via Gmail.
        </li>
        <li style={{ color: 'black', marginBottom: '10px' }}>
          In case of any issues Please Refresh The Page
        </li>
      </ul>
      <div
        className="popup-actions"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '20px',
        }}
      >
        <button
          className="popup-cancel"
          style={{
            backgroundColor: 'lightgray',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '1em',
          }}
          onClick={() => setShowRules(false)}
        >
          Back
        </button>
        <button
          className="popup-proceed"
          style={{
            backgroundColor: '#007BFF',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '1em',
          }}
          onClick={handleProceed}
        >
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
