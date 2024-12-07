import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Authentication from "./components/Authentication";
import Footer from "./components/Footer";
import FirstQuestion from "./components/FirstQuestion";
import MultipleQuestions from "./components/MultipleQuestions";
import LastQuestion from "./components/LastQuestion";
import "./App.css";

const App = () => {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<Authentication />} />
          <Route path="/page-one" element={<FirstQuestion />} />
        <Route path="/page-two" element={<MultipleQuestions />} />
        <Route path="/page-three" element={<LastQuestion />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
