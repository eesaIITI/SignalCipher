import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./PageThree.css";

function LastQuestion() {
  const [question, setQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [isCorrect, setIsCorrect] = useState(null);
  const [isVerified, setIsVerified] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/question/another")
      .then((res) => res.json())
      .then((data) => setQuestion(data))
      .catch((err) => {
        console.error("Error fetching question:", err);
        setShowError("Failed to load question. Please try again.");
      });
  }, []);

  const handleVerify = () => {
    if (!selectedOption) {
      setShowError("Please enter an answer");
      return;
    }

    fetch("http://localhost:5000/api/checkAnswer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        questionId: question._id.$oid,
        selectedOption,
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
        console.error("Error checking answer:", err);
        setShowError("There was an error. Please try again.");
      });
  };

  const handleSubmit = () => {
    if (!isVerified) {
      setShowError("Please verify your answer first.");
      return;
    }

    setShowSuccess(true);
  };

  const handlePrevious = () => {
    navigate(-1);
  };

  if (!question) return <div className="loading">Loading...</div>;

  return (
    <div className="question-container">
      {!showSuccess ? (
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
              aria-label="Your answer"
            />
            <button onClick={handleVerify} className="verify-button">
              Verify
            </button>
            <button onClick={handleSubmit} className="submit-button" disabled={!isVerified}>
              Submit
            </button>
          </div>
          {isCorrect && <p className="correct-message">✅ Correct Answer</p>}
          {showError && <p className="error-message">{showError}</p>}
        </div>
      ) : (
        <div className="success-message">
          <h1>🎉 Congratulations! 🎉</h1>
          <p>You have successfully qualified all rounds. Well done!</p>
        </div>
      )}
      {!showSuccess && (
        <div className="button-container">
          <button onClick={handlePrevious} className="previous-button">
            Previous
          </button>
        </div>
      )}
    </div>
  );
}

export default LastQuestion;

