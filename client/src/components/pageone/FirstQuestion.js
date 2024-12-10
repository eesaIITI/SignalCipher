import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios"
import "./PageOne.css";
const port  = "https://signal-cipher-l7jty86nf-eesa-webteams-projects.vercel.app";

function FirstQuestion() {
  const [question, setQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [showError, setShowError] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [userInfo, setUserInfo] = useState(null);
  const [isSolved, setIsSolved] = useState(false);

  // Function to fetch questions
  const fetchQuestions = async (userEmail, Q_Num) => {
    try {
      const response = await fetch(
        `${port}/Fetch_Question?userEmail=${userEmail}&Q_Num=${Q_Num}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setQuestion(data);
    } catch (err) {
      console.error("Error fetching question:", err);
    }
  };

  // Verify answer
  const handleVerify = () => {
    if (!selectedOption) {
      setShowError("Please enter an answer");
      return;
    }

    if (!isAuthenticated || !user?.email) {
      setShowError("User authentication failed. Please log in.");
      return;
    }

    fetch(`${port}/validateAnswer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        Qno: '1',
        submittedAns: selectedOption,
        userEmail: user.email,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.isCorrect) {
          setIsCorrect(true);
          setIsVerified(true);
          setShowError(null);
          setIsSolved(true);
        } else {
          setIsCorrect(false);
          setShowError("Incorrect answer! Please try again.");
        }
      })
      .catch((err) => {
        setShowError("There was an error. Please try again.");
        console.error("Error checking answer:", err);
      });
  };

  //getting user info
  const LoadUser = async () => {
    if (isAuthenticated && user?.email) {
      try {
        const response = await axios.get(`${port}/getUserInfo`, {
          params: { email: user.email },
        });
  
        setUserInfo(response.data); 
        setIsSolved(response.data.Qns_Solved.includes(1));
        
      } catch (err) {
        console.error('Error loading user info:', err);
      }
    }
  };

  // Fetch question when user is ready
  useEffect(() => {
    if (!isLoading && isAuthenticated && user?.email) {
      fetchQuestions(user.email, "1");
    }
    LoadUser();
  }, [isLoading, isAuthenticated, user]);

  const handleNext = async () => {
    await LoadUser();
    if (!userInfo) {
      console.log("userInfo is not loaded yet.");
      return;
    }
  
    const isVal = userInfo.Qns_Solved.includes(1); 
    
    if (isVal) {
      navigate("/page-two");
    } else {
      setShowError("Please verify your answer first.");
    }
  };
  
  // Loading state
  if (isLoading || !question) return <div className="loading">Loading...</div>;

  return (
    <div className="question-container">
      <div className="question-box">
        <div className="question-header">
        <div style={{margin:"auto"}}><h1 className="question-title"><span style={{color:"orange"}}>1. </span>{question.Q_Title}</h1> </div>  
          <span className={isSolved ? "solved" : "unsolved"}>
            {isSolved ? "Solved!" : "Not solved"}
          </span>
        </div>
        <p className="question-description">{question.Q_Des}</p>

        <div className="input-verify-container">
          <div className="input-button-group">
            <input
              type="text"
              placeholder="Your answer"
              value={selectedOption}
              onChange={(e) => setSelectedOption(e.target.value)}
              className="answer-input"
            />
            <button onClick={handleVerify} className="verify-button">
              Verify
            </button>
          </div>
        </div>

        {isCorrect && <p className="correct-message">✅ Correct Answer</p>}
        {showError && !isCorrect && <p className="error-message">{showError}</p>}
      </div>
      <div className="next-button-container">
        <button
          onClick={handleNext}
          className="next-button"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default FirstQuestion;
