import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { toast } from 'react-toastify';
import Loader from "../Loader";

// const port = "http://localhost:5000";
const port  = "https://signal-cipher.vercel.app";

function MultipleQuestions() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useAuth0();

  const [questions, setQuestions] = useState([]);
  const [ans1, setAns1] = useState("");
  const [ans2, setAns2] = useState("");
  const [ans3, setAns3] = useState("");
  const [verify1, setVerify1] = useState(null);
  const [verify2, setVerify2] = useState(null);
  const [verify3, setVerify3] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const [isSolved2, setIsSolved2] = useState(false);
  const [isSolved3, setIsSolved3] = useState(false);
  const [isSolved4, setIsSolved4] = useState(false);
  const [verifying, setVerifying] = useState({ q2: false, q3: false, q4: false });

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

        if (!solved.includes(1)) {
          toast.error("Please solve Question 1 before accessing this page.");
          navigate("/page-one");
        }
      } catch (err) {
        console.error("Error verifying access:", err);
      }
    }
  };

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const questionNumbers = [2, 3, 4];
      const fetchedQuestions = [];

      for (let i = 0; i < questionNumbers.length; i++) {
        const response = await axios.get(`${port}/Fetch_Question`, {
          params: { Q_Num: questionNumbers[i], userEmail: user.email },
        });
        fetchedQuestions.push(response.data);
      }

      setQuestions(fetchedQuestions);
    } catch (err) {
      console.error("Error fetching questions:", err);
      toast.error("Failed to load questions");
    } finally {
      setLoading(false);
    }
  };

  const LoadUser = async () => {
    if (isAuthenticated && user?.email) {
      try {
        const response = await axios.get(`${port}/getUserInfo`, {
          params: { email: user.email },
        });

        setUserInfo(response.data);
        const solved = response.data.Qns_Solved || [];
        setIsSolved2(solved.includes(2));
        setIsSolved3(solved.includes(3));
        setIsSolved4(solved.includes(4));
      } catch (err) {
        console.error("Error loading user info:", err);
      }
    }
  };

  const handleVerify = async (questionNo, answer) => {
    if (!answer.trim()) {
      toast.warning("Please enter an answer before verifying.");
      return;
    }

    if (!isAuthenticated || !user?.email) {
      toast.error("User authentication failed. Please log in.");
      return;
    }

    const qKey = `q${questionNo}`;
    setVerifying(prev => ({ ...prev, [qKey]: true }));

    try {
      const response = await fetch(`${port}/validateAnswer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Qno: questionNo,
          submittedAns: answer,
          userEmail: user.email,
        }),
      });

      const data = await response.json();
      if (questionNo === 2) {
        setVerify1(data.isCorrect);
        toast[data.isCorrect ? 'success' : 'error'](data.isCorrect ? "✅ Correct!" : "❌ Incorrect");
      }
      if (questionNo === 3) {
        setVerify2(data.isCorrect);
        toast[data.isCorrect ? 'success' : 'error'](data.isCorrect ? "✅ Correct!" : "❌ Incorrect");
      }
      if (questionNo === 4) {
        setVerify3(data.isCorrect);
        toast[data.isCorrect ? 'success' : 'error'](data.isCorrect ? "✅ Correct!" : "❌ Incorrect");
      }

      await LoadUser();
    } catch (err) {
      console.error("Error verifying answer:", err);
      toast.error("There was an error verifying the answer. Please try again.");
    } finally {
      setVerifying(prev => ({ ...prev, [qKey]: false }));
    }
  };

  useEffect(() => {
    if (!isLoading && isAuthenticated && user?.email) {
      checkAccess();
      fetchQuestions();
      LoadUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isAuthenticated, user]);

  const handleNext = async () => {
    await LoadUser();
    const requiredQuestions = [2, 3, 4];
    const isVal = requiredQuestions.every((q) =>
      userInfo?.Qns_Solved.includes(q)
    );

    if (isVal) {
      navigate("/page-three");
    } else {
      toast.warning("Please ensure all answers are correct before proceeding.");
    }
  };

  const handlePrevious = () => navigate(-1);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader label="Loading questions..." />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-fade-in pt-24 pb-16">
      <h1 className="text-3xl sm:text-4xl font-bold text-gradient text-center mb-8">
        Answer the Questions
      </h1>

      {/* Question 2 */}
      <div className="card animate-scale-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-2xl font-bold">
            <span className="text-accent">2.</span> {questions[0]?.Q_Title}
          </h2>
          <span className={isSolved2 ? "badge-success" : "badge-warning"}>
            {isSolved2 ? "✓ Solved" : "Not solved"}
          </span>
        </div>
        
        <p className="text-text-secondary mb-6">{questions[0]?.Q_Des}</p>

        {/* Media Link - if exists */}
        {questions[0]?.Q_Img && (
          <div className="mb-8">
            <a
              href={questions[0].Q_Img}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 w-full sm:w-auto justify-center sm:justify-start"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform duration-300">
                🎬
              </span>
              <div className="flex flex-col text-left">
                <span className="text-xs opacity-90 font-normal leading-tight">Click to open:</span>
                <span className="text-base font-bold leading-tight">View Media</span>
              </div>
              <span className="ml-2 text-xl group-hover:translate-x-1 transition-transform duration-300">
                →
              </span>
            </a>
            <p className="text-xs text-gray-400 mt-2 italic">Opens in new tab • No download needed</p>
          </div>
        )}

        {/* Answer Input */}
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Your answer"
            value={ans1}
            onChange={(e) => setAns1(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleVerify(2, ans1)}
            className="input-field flex-1"
            disabled={verifying.q2}
          />
          <button
            onClick={() => handleVerify(2, ans1)}
            className="btn-primary sm:w-auto"
            disabled={verifying.q2}
          >
            {verifying.q2 ? <Loader label="" /> : 'Verify'}
          </button>
        </div>
      </div>

      {/* Question 3 */}
      <div className="card animate-scale-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-2xl font-bold">
            <span className="text-accent">3.</span> {questions[1]?.Q_Title}
          </h2>
          <span className={isSolved3 ? "badge-success" : "badge-warning"}>
            {isSolved3 ? "✓ Solved" : "Not solved"}
          </span>
        </div>
        
        <p className="text-text-secondary mb-6">{questions[1]?.Q_Des}</p>

        {/* Media Link - if exists */}
        {questions[1]?.Q_Img && (
          <div className="mb-6">
            <a
              href={questions[1].Q_Img}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 w-full sm:w-auto justify-center sm:justify-start"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform duration-300">
                🎵
              </span>
              <div className="flex flex-col text-left">
                <span className="text-xs opacity-90 font-normal leading-tight">Click to open:</span>
                <span className="text-base font-bold leading-tight">View Media</span>
              </div>
              <span className="ml-2 text-xl group-hover:translate-x-1 transition-transform duration-300">
                →
              </span>
            </a>
            <p className="text-xs text-gray-400 mt-2 italic">Opens in new tab • No download needed</p>
          </div>
        )}

        {/* Answer Input */}
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Your answer"
            value={ans2}
            onChange={(e) => setAns2(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleVerify(3, ans2)}
            className="input-field flex-1"
            disabled={verifying.q3}
          />
          <button
            onClick={() => handleVerify(3, ans2)}
            className="btn-primary sm:w-auto"
            disabled={verifying.q3}
          >
            {verifying.q3 ? <Loader label="" /> : 'Verify'}
          </button>
        </div>
      </div>

      {/* Question 4 */}
      <div className="card animate-scale-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-2xl font-bold">
            <span className="text-accent">4.</span> {questions[2]?.Q_Title}
          </h2>
          <span className={isSolved4 ? "badge-success" : "badge-warning"}>
            {isSolved4 ? "✓ Solved" : "Not solved"}
          </span>
        </div>
        
        <p className="text-text-secondary mb-6">{questions[2]?.Q_Des}</p>

        {/* Media Link - if exists */}
        {questions[2]?.Q_Img && (
          <div className="mb-6">
            <a
              href={questions[2].Q_Img}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-3 px-5 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 w-full sm:w-auto justify-center sm:justify-start"
            >
              <span className="text-2xl group-hover:scale-110 transition-transform duration-300">
                🖼️
              </span>
              <div className="flex flex-col text-left">
                <span className="text-xs opacity-90 font-normal leading-tight">Click to open:</span>
                <span className="text-base font-bold leading-tight">View Media</span>
              </div>
              <span className="ml-2 text-xl group-hover:translate-x-1 transition-transform duration-300">
                →
              </span>
            </a>
            <p className="text-xs text-gray-400 mt-2 italic">Opens in new tab • No download needed</p>
          </div>
        )}

        {/* Answer Input */}
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Your answer"
            value={ans3}
            onChange={(e) => setAns3(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleVerify(4, ans3)}
            className="input-field flex-1"
            disabled={verifying.q4}
          />
          <button
            onClick={() => handleVerify(4, ans3)}
            className="btn-primary sm:w-auto"
            disabled={verifying.q4}
          >
            {verifying.q4 ? <Loader label="" /> : 'Verify'}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between gap-4 pt-4">
        <button onClick={handlePrevious} className="btn-secondary">
          ← Previous
        </button>
        <button onClick={handleNext} className="btn-primary">
          Next →
        </button>
      </div>
    </div>
  );
}

export default MultipleQuestions;