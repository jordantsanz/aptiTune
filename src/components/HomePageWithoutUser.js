import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { helloWorld } from '../actions';

class HomePageWithoutUser extends Component {
  constructor(props) {
    super(props);
    console.log('mounting');
  }

  // authentication in this needs to be filled, links as well...but that is scary :(
  render() {
    return (
      <div className="background-homepage-without-user">
        <div className="homepage-without-user-flex">
          <div className="music-is-hard"> Music is hard. </div>
          <div className="homepage-without-description"> We want to change that. <br />
            Want to be the next taylor swift?
            <br />
            Let&apos;s make that happen.
          </div>
          <input className="username" />
          <input className="email" />
          <input className="password" />
          <NavLink to="/withuser" className="create-account">Create account</NavLink>
          <div className="have-account">Already have an account? <NavLink to="/login" className="log-in">Log in here</NavLink></div>
          {/* <button type="submit" className="create-account">Create Account</button> */}
        </div>
      </div>
    );
  }
}

export default connect(null, { helloWorld })(HomePageWithoutUser);
