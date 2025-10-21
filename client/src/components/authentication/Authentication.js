import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from 'react-toastify';

const Authentication = () => {
  const { isAuthenticated, isLoading, user } = useAuth0();
  const navigate = useNavigate();
  const [showRules, setShowRules] = useState(false);
  
  // const port = "http://localhost:5000";
  const port  = "https://signal-cipher.vercel.app";

  const storeUserInfo = async () => {
    try {
      const response = await axios.post(`${port}/Userinfo`, {
        UserEmail: user.email
      });
      console.log(response.data.message);
    } catch (error) {
      console.error('Error storing user info:', error);
      toast.error('Failed to store user information');
    }
  };

  const HandleStart = () => {
    if (!isAuthenticated) {
      toast.warning("Please Login to Start");
    } else {
      setShowRules(true);
    }
  };

  const handleProceed = () => {
    setShowRules(false);
    navigate("/page-one");
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      storeUserInfo();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-12 animate-fade-in">
      <div className="card max-w-2xl w-full text-center animate-scale-in">
        <h1 className="text-3xl sm:text-4xl font-bold text-gradient mb-6">
          Welcome Adventurer!
        </h1>
        <p className="text-text-secondary text-base sm:text-lg leading-relaxed mb-8">
          "Your journey into the enigmatic world of SignalCipher begins here. Decode, solve, and conquer!"
        </p>
        <button
          className="btn-primary w-full sm:w-auto"
          onClick={HandleStart}
        >
          Start Quiz
        </button>
      </div>

      {/* This is the Rules modal you provided */}
      {showRules && (
        <div className="fixed top-16 bottom-16 inset-x-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-surface rounded-2xl shadow-xl max-w-2xl w-full max-h-full overflow-y-auto animate-scale-in">
            <div className="p-6 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gradient mb-6 text-center">
                Rules
              </h2>
              
              <ul className="space-y-4 text-left text-text-secondary">
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold mt-0.5">1</span>
                  <span>
                    The competition is open to all registered participants. To participate, kindly complete the registration by filling out the provided{" "}
                    <a href="https://docs.google.com/forms/d/1LUU6kGp05fOAlpSdTG3MMdgD3HdodRTxCVrASvsIe2w/viewform?edit_requested=true" 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="text-primary hover:underline font-medium">
                      Google form
                    </a>.
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold mt-0.5">2</span>
                  <span>Participants may enter the competition either individually or as part of a team, with team sizes ranging from 1 to 2 members.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold mt-0.5">3</span>
                  <span>
                    All flags in the competition must follow the format: <code className="px-2 py-1 bg-surface-hover rounded font-mono text-sm">eesa{'{'}flag{'}'}</code>, (note that flag means answer)
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold mt-0.5">4</span>
                  <span>Sharing solutions, flags, or hints with other participants or teams is strictly prohibited.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold mt-0.5">5</span>
                  <span>Participants are free to use internet sources or any AI tool during the competition.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold mt-0.5">6</span>
                  <span>The competition will run from Dec 2025 to Jan 2026. Ensure that all submissions are made within this time frame.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold mt-0.5">7</span>
                  <span>Participants are required to solve the questions at the earliest. Teams that submit solutions earlier will receive higher rankings.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold mt-0.5">8</span>
                  <span>In case of any queries, participants are encouraged to reach out through EESA's official Instagram page or via Gmail.</span>
                </li>
                <li className="flex items-start space-x-3 text-warning font-medium">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-warning/10 text-warning flex items-center justify-center text-sm font-bold mt-0.5">!</span>
                  <span>In case of any issues Please Refresh The Page</span>
                </li>
              </ul>
              
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <button
                  className="btn-secondary flex-1"
                  onClick={() => setShowRules(false)}
                >
                  Back
                </button>
                <button
                  className="btn-primary flex-1"
                  onClick={handleProceed}
                >
                  Proceed
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Authentication;