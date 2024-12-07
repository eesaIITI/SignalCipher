import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./PageThree.css";


function LastQuestion() {
  const [question, setQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [isCorrect, setIsCorrect] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/question/another")
      .then((res) => res.json())
      .then((data) => setQuestion(data))
      .catch((err) => console.error(err));
  }, []);

  const handleSubmit = () => {
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
          setShowSuccess(true); // Show success message
        } else {
          setIsCorrect(false); // Indicate incorrect answer
        }
      })
      .catch((err) => console.error(err));
  };

  const handlePrevious = () => {
    navigate(-1); // Navigate back to the previous page
  };

  if (!question) return <div>Loading...</div>;

  return (
    <div>
      {!showSuccess ? (
        <>
          <h1>{question.Q_Title}</h1>
          <p>{question.Q_Des}</p>
          <img src={question.Q_Img} alt="Question" />
          <br />
          <input
            type="text"
            placeholder="Your answer"
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
          />
          <div>
            <button onClick={handlePrevious}>Previous</button>
            <button onClick={handleSubmit}>Submit</button>
          </div>
          {isCorrect === false && (
            <p style={{ color: "red" }}>Incorrect answer! Please try again.</p>
          )}
        </>
      ) : (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <h1>🎉 Congratulations! 🎉</h1>
          <p style={{ fontSize: "18px", color: "green" }}>
            You have successfully qualified all rounds. Well done!
          </p>
        </div>
      )}
    </div>
  );
}

export default LastQuestion;
