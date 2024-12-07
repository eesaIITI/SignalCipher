import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./PageTwo.css";

function MultipleQuestions() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [verification, setVerification] = useState({});
  const [showError, setShowError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/questions/three")
      .then((res) => res.json())
      .then((data) => setQuestions(data))
      .catch((err) => {
        console.error("Error fetching questions:", err);
        setShowError("Failed to load questions. Please try again.");
      });
  }, []);

  const handleChange = (id, value) => {
    setAnswers({ ...answers, [id]: value });
  };

  const handleVerify = (questionId) => {
    if (!answers[questionId]) {
      setShowError("Please enter an answer before verifying.");
      return;
    }

    fetch("http://localhost:5000/api/checkAnswer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        questionId: questionId,
        selectedOption: answers[questionId],
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setVerification({ ...verification, [questionId]: data.isCorrect });
        setShowError(null);
      })
      .catch((err) => {
        console.error("Error checking answer:", err);
        setShowError("There was an error. Please try again.");
      });
  };

  const handleSubmit = () => {
    const allAnswered = questions.every((question) => answers[question._id.$oid]);
    const allVerified = questions.every((question) => verification[question._id.$oid] !== undefined);

    if (!allAnswered || !allVerified) {
      setShowError("Please answer and verify all questions before proceeding.");
      return;
    }

    const allCorrect = Object.values(verification).every((v) => v === true);
    if (allCorrect) {
      navigate("/page-three");
    } else {
      setShowError("Some answers are incorrect! Please verify all answers and try again.");
    }
  };

  const handlePrevious = () => {
    navigate(-1);
  };

  if (questions.length === 0) return <div className="loading">Loading...</div>;

  return (
    <div className="question-container">
      <h1>Answer the Questions</h1>
      {questions.map((question) => (
        <div key={question._id.$oid} className="question-box">
          <div className="question-content">
            <h2>{question.Q_Title}</h2>
            <p>{question.Q_Des}</p>
            <img
              src={question.Q_Img}
              alt="Question"
              className="question-image"
            />
          </div>
          <div className="input-verify-container">
            <input
              type="text"
              placeholder="Your answer"
              value={answers[question._id.$oid] || ""}
              onChange={(e) => handleChange(question._id.$oid, e.target.value)}
              className="answer-input"
              aria-label={`Answer for ${question.Q_Title}`}
            />
            <button 
              onClick={() => handleVerify(question._id.$oid)} 
              className="verify-button"
            >
              Verify
            </button>
          </div>
          {verification[question._id.$oid] !== undefined && (
            <p className={`feedback ${verification[question._id.$oid] ? 'correct' : 'incorrect'}`}>
              {verification[question._id.$oid] ? '✅ Correct' : '❌ Incorrect'}
            </p>
          )}
        </div>
      ))}
      <div className="navigation-container">
        <button onClick={handlePrevious} className="navigation-button">
          Previous
        </button>
        <button onClick={handleSubmit} className="navigation-button">
          Next
        </button>
      </div>
      {showError && (
        <p className="feedback incorrect">
          {showError}
        </p>
      )}
    </div>
  );
}

export default MultipleQuestions;

