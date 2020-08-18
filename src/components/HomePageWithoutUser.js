/* eslint-disable eqeqeq */
import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { signupUser } from '../actions';

class HomePageWithoutUser extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      username: '',
      invalidInput: false,
    };
  }

  onInputEmail = (event) => {
    this.setState({
      email: event.target.value,
    });
  }

  onInputPassword = (event) => {
    this.setState({
      password: event.target.value,
    });
  }

  onInputUsername = (event) => {
    this.setState({
      username: event.target.value,
    });
  }

  submit = () => {
    const user = {
      email: this.state.email,
      password: this.state.password,
      username: this.state.username,
    };
    if (this.state.email == '' || this.state.password == '' || this.state.username == '') {
      this.setState({
        invalidInput: true,
      });
    } else {
      console.log(user);
      this.props.signupUser(user, this.props.history);
    }
  }

  errorMessage = () => {
    if (this.state.invalidInput) {
      return (
        <div className="errorMessage">Please fill in all of the required boxes!</div>
      );
    } else {
      return (
        <div className="blank" />
      );
    }
  }

  // fix link to sign-in page!!
  render() {
    return (
      <div className="background-homepage-without-user">
        <div className="homepage-without-user-flex">
          <div className="music-is-hard-section">
            <div className="music-is-hard"> Music is hard. </div>
            <div className="homepage-without-description"><strong> We want to change that. </strong> <br />
              Presenting AptiTune, a new and interactive way to become the musician you&apos;ve always wanted to be.
            </div>
            <NavLink to="/signin">
              <button type="button" className="button" id="loginbutton">Login here</button>
            </NavLink>
            <div className="subtitle" id="convinceme">Need to be convinced?</div>
          </div>
          {/* absolutely no clue how to put the taylor swift words in, lol */}
          <div className="voice-to-music-section">
            <div className="title">Voice-to-music writing</div>
            <div className="description" id="voice-to-music-description">AptiTune uses a <strong>live voice-to-sheet-music</strong>
              translator. Sing a note into your computer&apos;s
              microphone, and AptiTune writes the sheet music for you.
            </div>
            <div className="description" id="voice-to-music-bottom-description">
              You learn by creating. <strong>It&apos;s that simple.</strong>
            </div>
            <button type="button" className="button" id="createAccountVoiceSection">Create Account</button> {/* need to implement autoscroll on these */}
          </div>
          <div className="easy-section">
            <div className="easy-title">Easy, accessible, and fun</div>
            <div className="description" id="easy-description">We are students at Dartmouth who believe that learning
              music <strong>should not</strong> be intimidating.
            </div>
            <div className="bottom-description">
              There&apos;s so much material, and it can be daunting. It might feel like you need a natural talent that
              you&apos;re born with...but let us prove you wrong. <strong>Learn music with us!</strong>
            </div>
          </div>
          {this.errorMessage()}
          <div className="sign-up-section">
            <h1 className="title" id="createAccount">Create Account</h1>
            <input className="emailSignup" onChange={this.onInputEmail} placeholder="email" />
            <input className="usernameSignup" onChange={this.onInputUsername} placeholder="username" />
            <input type="password" className="passwordSignup" onChange={this.onInputPassword} placeholder="password" />
            <div className="input-subtitles">
              <div className="already-have">Already have an account?</div>
              <div className="log-in">Log in here </div>
            </div>
            <button onClick={this.submit} type="submit" className="createaccount">Create Account</button>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(reduxState) {
  return {
    authentication: reduxState.auth.authenticated,
  };
}
export default connect(mapStateToProps, { signupUser })(HomePageWithoutUser);
