import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import "./PageOne.css";

function FirstQuestion() {
  const [question, setQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [showError, setShowError] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth0();

  useEffect(() => {
    fetch("http://localhost:5000/api/question")
      .then((res) => res.json())
      .then((data) => setQuestion(data))
      .catch((err) => console.error("Error fetching question:", err));
  }, []);

  const handleVerify = () => {
    if (!selectedOption) {
      setShowError("Please enter an answer");
      return;
    }

    if (!isAuthenticated || !user?.email) {
      setShowError("User authentication failed. Please log in.");
      return;
    }

    fetch("http://localhost:5000/api/checkAnswer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        questionId: question._id.$oid,
        selectedOption,
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

  const handleNext = () => {
    if (isCorrect) {
      navigate("/page-two");
    } else {
      setShowError("Please verify your answer first.");
    }
  };

  if (!question) return <div className="loading">Loading...</div>;

  return (
    <div className="question-container">
      <div className="question-box">
        <h1>{question.Q_Title}</h1>
        <p>{question.Q_Des}</p>
        <img src={question.Q_Img} alt="Question" className="question-image" />

        <div className="input-verify-container">
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

        {isCorrect && <p className="correct-message">✅ Correct Answer</p>}
        {showError && !isCorrect && <p className="error-message">{showError}</p>}
      </div>
      
      <div className="next-button-container">
        <button onClick={handleNext} className="next-button" disabled={!isVerified}>
          Next
        </button>
      </div>
    </div>
  );
}

export default FirstQuestion;

