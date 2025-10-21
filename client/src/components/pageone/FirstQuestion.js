import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { toast } from 'react-toastify';
import Loader from "../Loader";

// const port = "http://localhost:5000";
const port  = "https://signal-cipher.vercel.app";

function FirstQuestion() {
  const [question, setQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [isCorrect, setIsCorrect] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isSolved, setIsSolved] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const { user, isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast.error("Please log in to access the quiz.");
      navigate("/");
    }
  }, [isAuthenticated, isLoading, navigate]);

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
      toast.error("Failed to load question");
    }
  };

  const handleVerify = async () => {
    if (!selectedOption.trim()) {
      toast.warning("Please enter an answer");
      return;
    }

    if (!isAuthenticated || !user?.email) {
      toast.error("User authentication failed. Please log in.");
      return;
    }

    setIsVerifying(true);
    try {
      const response = await fetch(`${port}/validateAnswer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Qno: "1",
          submittedAns: selectedOption,
          userEmail: user.email,
        }),
      });

      const data = await response.json();

      if (data.isCorrect) {
        setIsCorrect(true);
        setIsVerified(true);
        setIsSolved(true);
        toast.success("✅ Correct Answer!");
      } else {
        setIsCorrect(false);
        toast.error("Incorrect answer! Please try again.");
      }
    } catch (err) {
      toast.error("There was an error. Please try again.");
      console.error("Error checking answer:", err);
    } finally {
      setIsVerifying(false);
    }
  };

  const LoadUser = async () => {
    if (isAuthenticated && user?.email) {
      try {
        const response = await axios.get(`${port}/getUserInfo`, {
          params: { email: user.email },
        });

        setUserInfo(response.data);
        setIsSolved(response.data.Qns_Solved.includes(1));
      } catch (err) {
        console.error("Error loading user info:", err);
      }
    }
  };

  useEffect(() => {
    if (!isLoading && isAuthenticated && user?.email) {
      fetchQuestions(user.email, "1");
      LoadUser();
    }
  }, [isLoading, isAuthenticated, user]);

  const handleNext = async () => {
    await LoadUser();
    if (!userInfo) {
      toast.error("Loading user data...");
      return;
    }

    const solved = userInfo.Qns_Solved.includes(1);
    if (solved) {
      navigate("/page-two");
    } else {
      toast.warning("Please verify your answer first.");
    }
  };

  if (isLoading || !question) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader label="Loading question..." />
      </div>
    );
  }

  return (
    // This new outer div will center everything on the page
    <div className="min-h-screen flex items-center justify-center">
    
      {/* This is your original container, now a child of the flex container */}
      <div className="max-w-4xl w-full px-4 py-8 animate-fade-in">
        <div className="card animate-scale-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold">
              <span className="text-accent">1.</span> {question.Q_Title}
            </h1>
            <span className={isSolved ? "badge-success" : "badge-warning"}>
              {isSolved ? "✓ Solved" : "Not solved"}
            </span>
          </div>

          <p className="text-text-secondary text-base sm:text-lg leading-relaxed mb-8">
            {question.Q_Des}
          </p>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Your answer"
                value={selectedOption}
                onChange={(e) => setSelectedOption(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleVerify()}
                className="input-field flex-1"
                disabled={isVerifying}
              />
              <button 
                onClick={handleVerify} 
                className="btn-primary sm:w-auto disabled:opacity-50"
                disabled={isVerifying}
              >
                {isVerifying ? <Loader label="" /> : 'Verify'}
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button onClick={handleNext} className="btn-primary">
            Next →
          </button>
        </div>
      </div>

    </div>
  );
}

export default FirstQuestion;