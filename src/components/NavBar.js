import React from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome, faGraduationCap, faUser,
} from '@fortawesome/free-solid-svg-icons';

// ROUTES NOT CORRECT; NEED TO BE CHANGED

const NavBar = ({ props }) => {
  return (
    <nav className="navbar">
      <div className="navbar-top">
        <NavLink exact to="/" className="homepage-link">
          <div className="hompage-div">
            <FontAwesomeIcon icon={faHome} className="icon" id="home" alt="home-icon" />
            <div className="icon-text">home</div>
          </div>
        </NavLink>
        <NavLink to="" className="learn-link">
          <div className="learn-div">
            <FontAwesomeIcon icon={faGraduationCap} className="icon" id="learn" alt="learn-icon" />
            <div className="icon-text">learn</div>
          </div>
        </NavLink>
        <NavLink to="/:username" className="user-link">
          <div className="username-div">
            <FontAwesomeIcon icon={faUser} className="icon" id="user" alt="user-icon" />
            <div className="icon-text">profile</div>
          </div>
        </NavLink>
      </div>
      <div className="navbar-bottom">
        <NavLink to="/signin" className="logout-link">
          <div className="logout-div">
            <img className="icon" id="logout" alt="logout-icon" />
            <div className="icon-text">logout</div>
          </div>
        </NavLink>
      </div>

    </nav>
  );
};

export default NavBar;
