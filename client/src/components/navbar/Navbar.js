import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import "./Navbar.css";

const Navbar = () => {
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0();

  return (
    <nav className="navbar">
      <a href="/"> <h2>Quiz App</h2></a>
      <div className="auth-buttons">
        {!isAuthenticated ? (
          <button onClick={() => loginWithRedirect()}>Log In</button>
        ) : (
          <button onClick={() => logout({ returnTo: window.location.origin })}>
            Log Out
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
