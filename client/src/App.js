import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Authentication from "./components/authentication/Authentication";
import Footer from "./components/footer/Footer";
import FirstQuestion from "./components/pageone/FirstQuestion";
import MultipleQuestions from "./components/pagetwo/MultipleQuestions";
import LastQuestion from "./components/pagethree/LastQuestion";
import UsersList from "./components/UsersList";
import ProtectedRoute from "./components/authentication/ProtectedRoute"; // ✅ import
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
          
          {/* ✅ Protected admin-only route */}
          <Route
            path="/all-users"
            element={<ProtectedRoute element={<UsersList />} />}
          />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
