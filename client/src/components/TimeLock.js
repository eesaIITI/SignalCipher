import React, { useState, useEffect } from "react";

const TimeLock = ({ children }) => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem("adminBypass") === "true");
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      
      // Convert current local time to IST (UTC + 5:30)
      const utc = now.getTime() + now.getTimezoneOffset() * 60000;
      const istNow = new Date(utc + 3600000 * 5.5);

      // Set target time to 5:30 PM (17:30:00) IST today
      const targetTime = new Date(istNow);
      targetTime.setHours(12, 01, 0);

      // Calculate difference in milliseconds
      const difference = targetTime - istNow;

      if (difference <= 0) {
        // If time has passed, unlock the site
        setIsUnlocked(true);
      } else {
        // Otherwise, update the timer
        setIsUnlocked(false);
        setTimeLeft({
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    // Run the calculation immediately, then update every 1 second
    calculateTime();
    const intervalId = setInterval(calculateTime, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const handleAdminBypass = () => {
    const password = prompt("Enter Admin Password:");
    
    if (!password) return; 

    // Simply check the exact password string
    if (password === "eesaadmin890") {
      localStorage.setItem("adminBypass", "true");
      setIsAdmin(true);
    } else {
      alert("Incorrect Password!");
    }
  };

  // If the time has passed or the admin has logged in, show the main App
  if (isUnlocked || isAdmin) {
    return children;
  }

  // Helper function to format numbers like '09' instead of '9'
  const formatTime = (time) => String(time).padStart(2, "0");

  // The Lock Screen UI with the Timer
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0a] text-white relative">
      <h1 className="text-4xl md:text-6xl font-bold mb-8 text-center">
        SignalCipher
      </h1>
      
      <p className="text-xl md:text-2xl text-blue-400 mb-8">
        The event will begin at 6:30 PM IST.
      </p>

      {/* Countdown Timer Container */}
      <div className="flex space-x-4 md:space-x-8 text-center items-center">
        <div className="flex flex-col items-center">
          <span className="text-5xl md:text-7xl font-mono font-bold bg-gray-900 px-6 py-4 rounded-lg shadow-lg">
            {formatTime(timeLeft.hours)}
          </span>
          <span className="text-sm md:text-base text-gray-500 mt-3 uppercase tracking-widest">Hours</span>
        </div>
        
        <span className="text-5xl md:text-7xl font-bold text-gray-600 mb-8">:</span>
        
        <div className="flex flex-col items-center">
          <span className="text-5xl md:text-7xl font-mono font-bold bg-gray-900 px-6 py-4 rounded-lg shadow-lg">
            {formatTime(timeLeft.minutes)}
          </span>
          <span className="text-sm md:text-base text-gray-500 mt-3 uppercase tracking-widest">Minutes</span>
        </div>
        
        <span className="text-5xl md:text-7xl font-bold text-gray-600 mb-8">:</span>
        
        <div className="flex flex-col items-center">
          <span className="text-5xl md:text-7xl font-mono font-bold bg-gray-900 px-6 py-4 rounded-lg shadow-lg">
            {formatTime(timeLeft.seconds)}
          </span>
          <span className="text-sm md:text-base text-gray-500 mt-3 uppercase tracking-widest">Seconds</span>
        </div>
      </div>

      {/* Invisible Admin Button in the bottom right corner */}
      <button
        onClick={handleAdminBypass}
        className="absolute bottom-4 right-4 opacity-0 hover:opacity-20 text-white px-4 py-2 rounded transition-opacity cursor-default hover:cursor-pointer"
      >
        Admin
      </button>
    </div>
  );
};

export default TimeLock;
