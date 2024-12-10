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
              <li>Rule 1:The competition is open to all registered participants. To participate, kindly complete the registration by filling out the provided Google form: [Google form link]
              </li>
              <li>Rule 2: Participants may enter the competition either individually or as part of a team, with team sizes ranging from 1 to 2 members.
              </li>
              <li>Rule 3:All flags in the competition <a style={{color:'black'}}>must follow the format: eesa{"{flag}"} </a>, (note that flag means answer)
              </li>
              <li>Rule 4: Sharing solutions, flags, or hints with other participants or teams is strictly prohibited.
              </li>
              <li>Rule 5:Participants are free to use internet sources or any AI tool during the competition.
              </li>
              <li>Rule 6:The competition will run from 13/12/2024 to 3/1/2025. Ensure that all submissions are made within this time frame.
              </li>
              <li>Rule 7:Participants are required to solve the questions at the earliest. Teams that submit solutions earlier will receive higher rankings.
              </li>
              <li>Rule 8:In case of any queries, participants are encouraged to reach out through EESA’s official Instagram page or via Gmail.

              </li>
              <li style={{color:'black'}} >Incase of any issues Please Refresh The Page

</li>
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
