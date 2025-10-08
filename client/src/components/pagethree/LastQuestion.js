import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import "./PageThree.css";

const port = "https://signal-cipher.vercel.app";
// const port = "http://localhost:5000";

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

  useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        alert("Please log in to access the quiz.");
        navigate("/"); // redirect to authentication page
      }
    }, [isAuthenticated, isLoading, navigate]);

  // ✅ 1. Access control: user must have solved 2,3,4 before accessing Q5
  const checkAccess = async () => {
    if (isAuthenticated && user?.email) {
      try {
        const response = await axios.get(`${port}/getUserInfo`, {
          params: { email: user.email },
        });
        const solved = response.data.Qns_Solved || [];

        // ✅ required questions before Q5
        const required = [2, 3, 4];
        const hasAll = required.every((q) => solved.includes(q));

        if (!hasAll) {
          alert("Please solve Questions 2, 3, and 4 before accessing this page.");
          navigate("/page-two");
        }
      } catch (err) {
        console.error("Error verifying access:", err);
      }
    }
  };

  const fetchQuestions = async (userEmail, Q_Num) => {
    try {
      const response = await fetch(
        `${port}/Fetch_Question?userEmail=${userEmail}&Q_Num=${Q_Num}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setQuestion(data);
    } catch (err) {
      console.error("Error fetching question:", err);
    }
  };

  const handleVerify = async () => {
    if (!selectedOption) {
      setShowError("Please enter an answer");
      return;
    }

    if (!isAuthenticated || !user?.email) {
      setShowError("User authentication failed. Please log in.");
      return;
    }

    // ✅ Clean answer
    let tutu = selectedOption.replace(/\s+/g, "").toLowerCase();

    try {
      const response = await fetch(`${port}/validateAnswer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Qno: "5",
          submittedAns: tutu,
          userEmail: user.email,
        }),
      });

      const data = await response.json();

      if (data.isCorrect) {
        setIsCorrect(true);
        setIsVerified(true);
        setShowError(null);
        await LoadUser();
      } else {
        setIsCorrect(false);
        setShowError("Incorrect answer! Please try again.");
      }
    } catch (err) {
      setShowError("There was an error. Please try again.");
      console.error("Error checking answer:", err);
    }
  };

  const LoadUser = async () => {
    if (isAuthenticated && user?.email) {
      try {
        const response = await axios.get(`${port}/getUserInfo`, {
          params: { email: user.email },
        });

        setUserInfo(response.data);
        setIsSolved5(response.data.Qns_Solved.includes(5));
      } catch (err) {
        console.error("Error loading user info:", err);
      }
    }
  };

  // ✅ 2. When page loads → check access, load Q5, and user info
  useEffect(() => {
    if (!isLoading && isAuthenticated && user?.email) {
      checkAccess(); // 🔒 ensures 2,3,4 solved
      fetchQuestions(user.email, "5");
      LoadUser();
    }
  }, [isLoading, isAuthenticated, user]);

  const handleSubmit = async () => {
    await LoadUser();
    if (isSolved5) {
      setShowSuccess(true);
    } else {
      setShowError("Please verify your answer correctly before submitting.");
    }
  };

  const handlePrevious = () => navigate(-1);

  if (!question) return <div className="loading">Loading...</div>;

  return (
    <div className="question-container">
      {!showSuccess ? (
        <>
          <div className="question-box">
            <div className="question-header">
              <div style={{ margin: "auto" }}>
                <h1 className="question-title">
                  <span style={{ color: "orange" }}>5.</span> {question.Q_Title}
                </h1>
              </div>
              <span className={isSolved5 ? "solved" : "unsolved"}>
                {isSolved5 ? "Solved!" : "Unsolved"}
              </span>
            </div>
            <p className="para1">{question.Q_Des}</p>

            <div className="input-verify-container">
              <input
                type="text"
                placeholder="Your answer"
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
            <button onClick={handleSubmit} className="submit-button">
              Submit
            </button>
          </div>
        </>
      ) : (
        <div className="success-message">
          <h1>🎉 You have successfully completed SignalCipher—well done! 🎉</h1>
          <p>
            Thank you for participating and showcasing your skills. EESA wishes
            you a <span className="highlight">Happy New Year!</span>
          </p>
          <p>
            Stay tuned for further updates and information about prizes. We will
            be back soon with more exciting news! 😉
          </p>
          <p>Until next time, keep exploring and innovating...</p>
        </div>
      )}
    </div>
  );
}

export default LastQuestion;
