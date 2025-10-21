import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { toast } from 'react-toastify';
import Loader from "../Loader";

// const port = "http://localhost:5000";
const port  = "https://signal-cipher.vercel.app";

function LastQuestion() {
  const [question, setQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");
  const [isCorrect, setIsCorrect] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [isSolved5, setIsSolved5] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const { user, isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast.error("Please log in to access the quiz.");
      navigate("/");
    }
  }, [isAuthenticated, isLoading, navigate]);

  const checkAccess = async () => {
    if (isAuthenticated && user?.email) {
      try {
        const response = await axios.get(`${port}/getUserInfo`, {
          params: { email: user.email },
        });
        const solved = response.data.Qns_Solved || [];

        const required = [2, 3, 4];
        const hasAll = required.every((q) => solved.includes(q));

        if (!hasAll) {
          toast.error("Please solve Questions 2, 3, and 4 before accessing this page.");
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

    let tutu = selectedOption.replace(/\s+/g, "").toLowerCase();
    setIsVerifying(true);

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
        toast.success("✅ Correct Answer!");
        await LoadUser();
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
        setIsSolved5(response.data.Qns_Solved.includes(5));
      } catch (err) {
        console.error("Error loading user info:", err);
      }
    }
  };

  useEffect(() => {
    if (!isLoading && isAuthenticated && user?.email) {
      checkAccess();
      fetchQuestions(user.email, "5");
      LoadUser();
    }
  }, [isLoading, isAuthenticated, user]);

  const handleSubmit = async () => {
    await LoadUser();
    if (isSolved5) {
      setShowSuccess(true);
      toast.success("🎉 Congratulations! You've completed SignalCipher!");
    } else {
      toast.warning("Please verify your answer correctly before submitting.");
    }
  };

  const handlePrevious = () => navigate(-1);

  if (!question) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader label="Loading question..." />
      </div>
    );
  }

  return (
    // This new outer div centers everything on the page
    <div className="min-h-screen flex items-center justify-center">
    
      {/* Your original content container */}
      <div className="max-w-4xl w-full px-4 py-8 animate-fade-in">
        {!showSuccess ? (
          <>
            <div className="card animate-scale-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h1 className="text-2xl sm:text-3xl font-bold">
                  <span className="text-accent">5.</span> {question.Q_Title}
                </h1>
                <span className={isSolved5 ? "badge-success" : "badge-warning"}>
                  {isSolved5 ? "✓ Solved" : "Unsolved"}
                </span>
              </div>
              
              <p className="text-text-secondary text-base sm:text-lg leading-relaxed mb-8">
                {question.Q_Des}
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Your answer"
                  onChange={(e) => setSelectedOption(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleVerify()}
                  className="input-field flex-1"
                  aria-label="Your answer"
                  disabled={isVerifying}
                />
                <button 
                  onClick={handleVerify} 
                  className="btn-primary sm:w-auto"
                  disabled={isVerifying}
                >
                  {isVerifying ? <Loader label="" /> : 'Verify'}
                </button>
              </div>
            </div>
            
            <div className="flex justify-between gap-4 mt-6">
              <button onClick={handlePrevious} className="btn-secondary">
                ← Previous
              </button>
              <button onClick={handleSubmit} className="btn-primary">
                Submit
              </button>
            </div>
          </>
        ) : (
          <div className="card text-center animate-scale-in p-8 sm:p-12">
            <div className="text-6xl mb-6">🎉</div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gradient mb-6">
              Congratulations!
            </h1>
            <div className="space-y-4 text-text-secondary text-base sm:text-lg">
              <p>
                You have successfully completed <span className="font-bold text-primary">SignalCipher</span>—well done!
              </p>
              <p>
                Thank you for participating and showcasing your skills. EESA wishes you a{" "}
                <span className="font-semibold text-accent">Happy New Year!</span>
              </p>
              <p>
                Stay tuned for further updates and information about prizes. We will be back soon with more exciting news! 😉
              </p>
              <p className="text-sm italic">Until next time, keep exploring and innovating...</p>
            </div>
          </div>
        )}
      </div>
      
    </div>
  );
}

export default LastQuestion;