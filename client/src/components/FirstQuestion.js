import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react"; // Import Auth0 hook
import "./PageOne.css";

function FirstQuestion() {
  const [question, setQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [showError, setShowError] = useState(null); // For showing errors or success
  const [isCorrect, setIsCorrect] = useState(false); // Track correctness of the answer
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth0(); // Get user information from Auth0

  // Fetch the question from the backend when the component mounts
  useEffect(() => {
    fetch("http://localhost:5000/api/question")
      .then((res) => res.json())
      .then((data) => setQuestion(data))
      .catch((err) => console.error("Error fetching question:", err));
  }, []);

  const handleSubmit = () => {
    if (!selectedOption) {
      setShowError("Please enter a right answer");
      return;
    }

    // Check if the user is authenticated and has an email
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
        userEmail: user.email, // Include user's email from Auth0
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.isCorrect) {
          setIsCorrect(true);
          setShowError(null);
          setTimeout(() => navigate("/page-two"), 2000); // Navigate after 2 seconds to allow the user to see the checkmark
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

  if (!question) return <div>Loading...</div>;

  return (
    <div>
      <h1>{question.Q_Title}</h1>
      <p>{question.Q_Des}</p>
      <img
        src={question.Q_Img}
        alt="Question"
        style={{ maxWidth: "100%", maxHeight: "200px", display: "block", margin: "20px auto" }}
      />

      <input
        type="text"
        placeholder="Your answer"
        value={selectedOption}
        onChange={(e) => setSelectedOption(e.target.value)}
        style={{ padding: "10px", marginBottom: "10px" }}
      />

      <button
        onClick={handleSubmit}
         className="next-button"
      >
        Next
      </button>

      {isCorrect && <p style={{ color: "green", fontWeight: "bold" }}>✅ Correct Answer</p>}
      {showError && !isCorrect && <p style={{ color: "red", fontWeight: "bold" }}>{showError}</p>}
    </div>
  );
}

export default FirstQuestion;
