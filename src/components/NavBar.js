/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome, faGraduationCap, faUser, faSignOutAlt,
} from '@fortawesome/free-solid-svg-icons';

import { signOutUser } from '../actions/index';

// ROUTES NOT CORRECT; NEED TO BE CHANGED

class NavBar extends Component {
  signOut = () => {
    this.props.signOutUser(this.props.history);
  };

  render() {
    return (
      <nav className="navbar">
        <div className="navbar-top">
          <NavLink to="/withuser" className="homepage-link">
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
          <NavLink to="/signin" className="logout-link" onClick={this.signOut}>
            <div className="logout-div">
              <FontAwesomeIcon icon={faSignOutAlt} className="icon" id="logout" alt="logout-icon" />
              <div className="icon-text">logout</div>
            </div>
          </NavLink>
        </div>

      </nav>
    );
  }
}

function mapStateToProps(reduxState) {
  return {
    authentication: reduxState.auth.authenticated,
  };
}

export default withRouter(connect(mapStateToProps, { signOutUser })(NavBar));
