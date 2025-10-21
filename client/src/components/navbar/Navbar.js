import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const Navbar = () => {
  // Destructure the authentication state and methods from the Auth0 hook
  const { loginWithRedirect, logout, isAuthenticated } = useAuth0();

  return (
    <nav
      className="
        fixed top-0 left-0 w-full z-50
        flex items-center justify-between
        h-16 px-8
        bg-gray-950/60 backdrop-blur-lg
        shadow-lg shadow-black/20
      "
    >
      {/* Left Side: Title */}
      <a href="/" className="text-decoration-none">
        <h4 className="text-xl md:text-2xl font-bold text-purple-300 hover:text-purple-200 transition-colors">
          SignalCipher: The Hidden Wish
        </h4>
      </a>

      {/* Right Side: Auth Buttons */}
      <div>
        {/*
          This is a ternary operator.
          - If 'isAuthenticated' is true, it renders the "Log Out" button.
          - If 'isAuthenticated' is false, it renders the "Log In" button.
        */}
        {!isAuthenticated ? (
          <button
            onClick={() => loginWithRedirect()}
            className="
              font-semibold text-purple-300
              border-2 border-purple-400
              py-2 px-5 rounded-lg
              hover:bg-purple-400 hover:text-white
              transition-all duration-300 ease-in-out
            "
          >
            Log In
          </button>
        ) : (
          <button
            onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
            className="
              font-semibold text-purple-300
              border-2 border-purple-400
              py-2 px-5 rounded-lg
              hover:bg-purple-400 hover:text-white
              transition-all duration-300 ease-in-out
            "
          >
            Log Out
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;