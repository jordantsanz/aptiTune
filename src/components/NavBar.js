/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome, faUser, faSignOutAlt,
} from '@fortawesome/free-solid-svg-icons';
import { signOutUser, getUserInfo } from '../actions/index';

class NavBar extends Component {
  signOut = () => {
    this.props.signOutUser(this.props.history);
  };

  getInfo = () => {
    this.props.getUserInfo();
  }

  render() {
    return (
      <nav className="navbar">
        <div className="navbar-top">
          <img id="logo-icon" alt="logo-icon" src="https://aptitune.s3.amazonaws.com/Aptitune_Logo.png" width="121" height="53" />
          <NavLink to="/home" className="homepage-link" onClick={this.getInfo}>
            <div className="hompage-div">
              <FontAwesomeIcon icon={faHome} className="icon" id="home" alt="home-icon" />
              <div className="icon-text">home</div>
            </div>
          </NavLink>
          <NavLink to="/profile" className="user-link" onClick={this.getInfo}>
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
    user: reduxState.user,
  };
}

export default withRouter(connect(mapStateToProps, { signOutUser, getUserInfo })(NavBar));
