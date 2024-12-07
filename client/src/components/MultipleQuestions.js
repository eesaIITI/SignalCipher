import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./PageTwo.css"


function MultipleQuestions() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [verification, setVerification] = useState({}); // Track correctness for each question
  const [showError, setShowError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/api/questions/three")
      .then((res) => res.json())
      .then((data) => setQuestions(data))
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (id, value) => {
    setAnswers({ ...answers, [id]: value });
  };

  const handleSubmit = () => {
    Promise.all(
      questions.map((question) =>
        fetch("http://localhost:5000/api/checkAnswer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            questionId: question._id.$oid,
            selectedOption: answers[question._id.$oid],
          }),
        }).then((res) => res.json())
      )
    ).then((results) => {
      const newVerification = results.reduce((acc, result, index) => {
        acc[questions[index]._id.$oid] = result.isCorrect;
        return acc;
      }, {});
      setVerification(newVerification);

      const allCorrect = results.every((res) => res.isCorrect);
      if (allCorrect) {
        navigate("/page-three");
      } else {
        setShowError(true); // Show the error message if answers are not all correct
      }
    });
  };

  const handlePrevious = () => {
    navigate(-1); // Navigate to the previous page
  };

  if (questions.length === 0) return <div>Loading...</div>;

  return (
    <div>
      <h1>Answer the Questions</h1>
      {questions.map((question) => (
        <div key={question._id.$oid}>
          <h2>{question.Q_Title}</h2>
          <p>{question.Q_Des}</p>
          <img
            src={question.Q_Img}
            alt="Question"
            style={{
              maxWidth: "100%",
              maxHeight: "200px",
              display: "block",
              margin: "20px auto",
            }}
          />
          <input
            type="text"
            placeholder="Your answer"
            onChange={(e) => handleChange(question._id.$oid, e.target.value)}
            style={{
              
              padding: "10px",
              marginBottom: "10px",
              marginTop: "10px",
            }}
          />
          {verification[question._id.$oid] && (
            <p style={{ color: "green", fontWeight: "bold" }}>✅ Correct</p>
          )}
          {verification[question._id.$oid] === false && (
            <p style={{ color: "red", fontWeight: "bold" }}>❌ Incorrect</p>
          )}
        </div>
      ))}
      <div>
        <button onClick={handlePrevious} style={{ padding: "10px 20px", marginRight: "10px" }}>
          Previous
        </button>
        <button onClick={handleSubmit} className = "next-button">
          Next
        </button>
      </div>
      {showError && <p style={{ color: "red" }}>Some answers are incorrect! Try again.</p>}
    </div>
  );
}

export default MultipleQuestions;
