import React from "react";

const Footer = () => (
  // ADDED: fixed, bottom-0, w-full
  // REMOVED: mt-auto
  <footer className="fixed bottom-0 w-full bg-surface/60 border-t border-border backdrop-blur-sm z-10">
    <div className="max-w-7xl mx-auto px-4 py-6">
      <p className="text-center text-text-secondary text-sm">
        Developed by <span className="font-semibold text-gradient">EESA Web Team '25</span> (IIT INDORE)
      </p>
    </div>
  </footer>
);

export default Footer;