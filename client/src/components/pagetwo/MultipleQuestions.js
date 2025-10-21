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
  // We add pt-24 (padding-top) and pb-16 (padding-bottom) here.
  // You may need to adjust these numbers to perfectly fit your header/footer height.
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

      <div className="space-y-6 mb-6">
        {[
          { des: questions[0]?.A_Des, img: questions[0]?.A_Img, label: 'A' },
          { des: questions[0]?.B_Des, img: questions[0]?.B_Img, label: 'B' },
          { des: questions[0]?.C_Des, img: questions[0]?.C_Img, label: 'C' },
          { des: questions[0]?.D_Des, img: questions[0]?.D_Img, label: 'D' },
          { des: questions[0]?.E_Des, img: questions[0]?.E_Img, label: 'E' },
        ].map((item, idx) => (
          <div key={idx} className="flex flex-col lg:flex-row gap-4 p-4 bg-surface-hover rounded-lg">
            <div className="flex-1">
              <span className="font-semibold text-primary">{item.label}.</span> {item.des}
            </div>
            {item.img && (
              <div className="lg:w-48 flex-shrink-0">
                <img src={item.img} alt={`Option ${item.label}`} className="w-full h-auto rounded" />
              </div>
            )}
          </div>
        ))}
      </div>

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

      <div className="flex flex-wrap gap-4 justify-center mb-6">
        <a
          href="https://drive.google.com/file/d/1bH58YIwupqK4rMcM0JThypm14_4RbVJ5/view?usp=sharing"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary"
        >
          🎵 Audio file
        </a>
        <a
          href="https://drive.google.com/file/d/1pUEF6lFwlNMEUc6gzwCWkeLN2z0iNw7d/view?usp=sharing"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-secondary"
        >
          🐍 Python file
        </a>
      </div>

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

      <div className="space-y-6 mb-6">
        {[
          { des: questions[2]?.A_Des, img: questions[2]?.A_Img, label: 'A' },
          { des: questions[2]?.B_Des, img: questions[2]?.B_Img, label: 'B' },
          { des: questions[2]?.C_Des, img: null, label: 'C' },
        ].map((item, idx) => (
          <div key={idx} className="flex flex-col lg:flex-row gap-4 p-4 bg-surface-hover rounded-lg">
            <div className="flex-1">
              <span className="font-semibold text-primary">{item.label}.</span> {item.des}
            </div>
            {item.img && (
              <div className="lg:w-48 flex-shrink-0">
                <img src={item.img} alt={`Option ${item.label}`} className="w-full h-auto rounded" />
              </div>
            )}
          </div>
        ))}
      </div>

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
