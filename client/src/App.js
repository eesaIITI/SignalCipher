import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import Authentication from "./components/authentication/Authentication";
import Footer from "./components/footer/Footer";
import FirstQuestion from "./components/pageone/FirstQuestion";
import MultipleQuestions from "./components/pagetwo/MultipleQuestions";
import LastQuestion from "./components/pagethree/LastQuestion";
import UsersList from "./components/UsersList";
import ProtectedRoute from "./components/authentication/ProtectedRoute";
import Toast from "./components/Toast";

const App = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col relative">
        <Navbar />
        <main className="flex-1 relative z-10">
          <Routes>
            <Route path="/" element={<Authentication />} />
            <Route path="/page-one" element={<FirstQuestion />} />
            <Route path="/page-two" element={<MultipleQuestions />} />
            <Route path="/page-three" element={<LastQuestion />} />
            <Route
              path="/all-users"
              element={<ProtectedRoute element={<UsersList />} />}
            />
          </Routes>
        </main>
        <Footer />
        <Toast />
      </div>
    </Router>
  );
};

export default App;
