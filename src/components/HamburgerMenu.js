import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../App.css'; // Use the existing App.css for styling

const HamburgerMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleHomeClick = () => {
    window.location.reload();
  };

  return (
    <div className="hamburger-menu">
      <button onClick={toggleMenu} className="hamburger-button">
        ☰
      </button>
      {isOpen && (
        <div className="menu">
          <a href="#" onClick={handleHomeClick}>Home</a> {/* Use <a> tag and handle click event */}
          <Link to="/about" onClick={toggleMenu}>About</Link>
          <Link to="/contact" onClick={toggleMenu}>Contact</Link>
          <Link to="/privacy-policy" onClick={toggleMenu}>Privacy Policy</Link>
          <Link to="/terms-and-conditions" onClick={toggleMenu}>Terms and Conditions</Link>
        </div>
      )}
    </div>
  );
};

export default HamburgerMenu;