import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import "./PageThree.css";

function LastQuestion() {
  const [question, setQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [isCorrect, setIsCorrect] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(null);

  const { user, isAuthenticated, isLoading } = useAuth0();
  const [userInfo, setUserInfo] = useState(null);
  const [isSolved5, setIsSolved5] = useState(false);

  const navigate = useNavigate();

  const fetchQuestions = async (userEmail, Q_Num) => {
    try {
      const response = await fetch(
        `http://localhost:5000/Fetch_Question?userEmail=${userEmail}&Q_Num=${Q_Num}`,
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

  const handleVerify =  () => {
    if (!selectedOption) {
      setShowError("Please enter an answer");
      return;
    }

    if (!isAuthenticated || !user?.email) {
      setShowError("User authentication failed. Please log in.");
      return;
    }

    fetch("http://localhost:5000/validateAnswer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        Qno: '5',
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

  const LoadUser = async () => {
    if (isAuthenticated && user?.email) {
      try {
        const response = await axios.get(`http://localhost:5000/getUserInfo`, {
          params: { email: user.email },
        });
  
        setUserInfo(response.data); 
        setIsSolved5(response.data.Qns_Solved.includes(5));
        
      } catch (err) {
        console.error('Error loading user info:', err);
      }
    }
  };

  useEffect(() => {
    if (!isLoading && isAuthenticated && user?.email) {
      fetchQuestions(user.email, "5");
    }
    LoadUser();
  }, [isLoading, isAuthenticated, user]);

  const handleSubmit = async() => {
   await LoadUser();

   if(isSolved5)
   {
    setShowSuccess(true);
   }
   else{

   }

   
  };

  const handlePrevious = () => {
    navigate(-1);
  };

  if (!question) return <div className="loading">Loading...</div>;

  return (
    <div className="question-container">
      {!showSuccess ? (
        <>
          <div className="question-box">
            <div className="question-header">
            <div style={{margin:"auto"}}>   <h1 className="question-title"><span style={{color:"orange"}}>5.</span>{question.Q_Title}</h1></div>
              <span className={isSolved5 ? "solved" : "unsolved"}>
                {isSolved5 ? "Solved!" : "Unsolved"}
              </span>
            </div>
            <p className="para1">{question.Q_Des}</p>
            <img src={question.Q_Img} alt="Question" className="question-image" />
            <div className="input-verify-container">
              <input
                type="text"
                placeholder="Your answer"
                value={selectedOption}
                onChange={(e) => setSelectedOption(e.target.value)}
                className="answer-input"
                aria-label="Your answer"
              />
              <button onClick={handleVerify} className="verify-button">
                Verify
              </button>
            </div>
            {isCorrect && <p className="correct-message">✅ Correct Answer</p>}
            {showError && <p className="error-message">{showError}</p>}
          </div>
          <div className="button-container">
            <button onClick={handlePrevious} className="previous-button">
              Previous
            </button>
            <button onClick={handleSubmit} className="submit-button" >
              Submit
            </button>
          </div>
        </>
      ) : (
        <div className="success-message">
          <h1>🎉 Congratulations! 🎉</h1>
          <p>You have successfully qualified all rounds. Well done!</p>
        </div>
      )}
    </div>
  );
}

export default LastQuestion;

