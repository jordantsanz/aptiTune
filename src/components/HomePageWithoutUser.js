/* eslint-disable max-len */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-plusplus */
/* eslint-disable class-methods-use-this */
/* eslint-disable eqeqeq */
import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import VisbilitySensor from 'react-visibility-sensor';
import { Spring } from 'react-spring/renderprops';
import { signupUser, setError, hideError } from '../actions/index';
import ErrorNotification from './errorMessage';

const empty = {
};

class HomePageWithoutUser extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      username: '',
      invalidInput: false,
      logging: false,
    };
    this.signupsection = React.createRef();
    this.voicetomusic = React.createRef();
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
      this.setState({
        logging: true,
      });
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

  handleScrollSignUp = () => {
    if (this.signupsection.current) {
      this.signupsection.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }

  handleScrollConvince = () => {
    if (this.voicetomusic.current) {
      this.voicetomusic.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }

  checkUserNameInput = () => {
    const attemptedUsername = document.getElementById('username-signup').value;
    const usernameLength = attemptedUsername.length;
    let isValid = true;
    if (usernameLength == 0) {
      this.props.setError(1002);
      isValid = false;
    }
    if (usernameLength < 4) {
      this.props.setError(1001);
      isValid = false;
    }
    if (usernameLength > 10) {
      this.props.setError(1000);
      isValid = false;
    }
    return isValid;
  }

  checkEmailInput = () => {
    const attemptedEmail = document.getElementById('email-signup').value;
    let isValid = true;
    if (!attemptedEmail.includes('@')) {
      this.props.setError(1003);
      isValid = false;
    }
    if (!attemptedEmail.includes('.com') && !attemptedEmail.includes('.gov') && !attemptedEmail.includes('.edu') && !attemptedEmail.includes('.org')) {
      this.props.setError(1004);
    }
    return isValid;
  }

  checkPasswordInput = () => {
    const attemptedPassword = document.getElementById('password-signup').value;
    let isValid = true;
    if (attemptedPassword.length < 7) {
      this.props.setError(1005);
      isValid = false;
    }
    if (!attemptedPassword.includes('?') && !attemptedPassword.includes('!') && !attemptedPassword.includes('$') && !attemptedPassword.includes('&') && !attemptedPassword.includes('%') && !attemptedPassword.includes('#')) {
      this.props.setError(1006);
      isValid = false;
    }

    return isValid;
  }

  checkInputs = () => {
    this.props.hideError();
    const validUsername = this.checkUserNameInput();
    const validEmail = this.checkEmailInput();
    const validPassword = this.checkPasswordInput();
    if (validUsername === true && validEmail === true && validPassword === true) {
      this.submit();
    }
  }

  buttonText = () => {
    if (this.state.logging && this.props.error.open === false) {
      return (
        <div className="loader" />
      );
    } else {
      return (
        <button onClick={this.checkInputs} type="submit" id="createaccountbutton"> Create Account </button>
      );
    }
  }

  fadeInScroll() {
    document.on('scroll', () => {
      const pageTop = document.scrollTop();
      const pageBottom = pageTop + window.height();
      const tags = '.tag';

      for (let i = 0; i < tags.length; i++) {
        const tag = tags[i];

        if (tag.position().top < pageBottom) {
          tag.addClass('visible');
        } else {
          tag.removeClass('visible');
        }
      }
    });
  }

  // fix link to sign-in page!!
  render() {
    return (
      <div className="background-homepage-without-user">
        <ErrorNotification />
        <div className="homepage-without-user-flex">
          <div className="music-is-hard-section">
            <div className="music-is-hard"> Music is hard. </div>
            <div className="homepage-without-description"><strong className="strong"> We want to change that. </strong> <br />
              Presenting AptiTune, a new and <br /> interactive way to become the <br /> musician you&apos;ve always wanted to be.
            </div>
            <div className="signin-button-homepage">
              <NavLink to="/signin">
                <button type="button" className="button" id="loginbutton">Login here</button>
              </NavLink>
              <button type="button" className="button" id="createbutton" onClick={this.handleScrollSignUp}>Create Account</button>
              <div className="subtitle" id="convinceme" onClick={this.handleScrollConvince}>Need to be convinced?</div>
            </div>

          </div>

          {/* absolutely no clue how to put the taylor swift words in, lol */}

          <div className="voice-to-music-section">
            <section id="convince">
              <VisbilitySensor className="music-is-hard-section-invisible">
                {({ isVisible }) => (
                  <Spring delay={10} to={{ opacity: isVisible ? 1 : 0 }}>
                    {({ opacity }) => (
                      <div style={{ ...empty, opacity }} className="title" id="voice-to-music-title">Voice-to-music writing</div>
                    )}
                  </Spring>
                )}
              </VisbilitySensor>
              <VisbilitySensor className="music-is-hard-section-invisible">
                {({ isVisible }) => (
                  <Spring delay={100} to={{ opacity: isVisible ? 1 : 0 }}>
                    {({ opacity }) => (

                      <div style={{ ...empty, opacity }} className="description" id="voice-to-music-description">AptiTune uses a <strong>live voice-to-sheet-music </strong>
                        translator. Sing a note into your computer&apos;s
                        microphone, and AptiTune writes the sheet music for you.
                      </div>
                    )}
                  </Spring>
                )}
              </VisbilitySensor>
              <VisbilitySensor className="music-is-hard-section-invisible">
                {({ isVisible }) => (
                  <Spring delay={100} to={{ opacity: isVisible ? 1 : 0 }}>
                    {({ opacity }) => (

                      <div style={{ ...empty, opacity }} className="description" id="voice-to-music-bottom-description">
                        You learn by creating. <strong>It&apos;s that simple.</strong>
                      </div>
                    )}
                  </Spring>
                )}
              </VisbilitySensor>
              <VisbilitySensor className="music-is-hard-section-invisible">
                {({ isVisible }) => (
                  <Spring delay={100} to={{ opacity: isVisible ? 1 : 0 }}>
                    {({ opacity }) => (

                      <div id="createAccountVoiceSection">
                        <button ref={this.voicetomusic}
                          type="button"
                          className="button"
                          id="createAccountVoiceSection"
                          onClick={this.handleScrollSignUp}
                          style={{ ...empty, opacity }}
                        ><span>Create Account</span>
                          <svg width="13px" height="10px" viewBox="0 0 13 10">
                            <path d="M1,5 L11,5" />
                            <polyline points="8 1 12 5 8 9" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </Spring>
                )}
              </VisbilitySensor>

            </section>
          </div>

          <div className="easy-section">
            <VisbilitySensor className="music-is-hard-section-invisible">
              {({ isVisible }) => (
                <Spring delay={10} to={{ opacity: isVisible ? 1 : 0 }}>
                  {({ opacity }) => (
                    <div className="easy-title" style={{ ...empty, opacity }}>Easy, accessible, and fun</div>
                  )}
                </Spring>
              )}
            </VisbilitySensor>
            <VisbilitySensor className="music-is-hard-section-invisible">
              {({ isVisible }) => (
                <Spring delay={100} to={{ opacity: isVisible ? 1 : 0 }}>
                  {({ opacity }) => (
                    <div className="description" style={{ ...empty, opacity }} id="easy-description">We are students at Dartmouth who believe that learning
                      music <strong>should not</strong> be intimidating.
                    </div>
                  )}
                </Spring>
              )}
            </VisbilitySensor>
            <VisbilitySensor className="music-is-hard-section-invisible">
              {({ isVisible }) => (
                <Spring delay={100} to={{ opacity: isVisible ? 1 : 0 }}>
                  {({ opacity }) => (
                    <div className="bottom-description" style={{ ...empty, opacity }}>
                      There&apos;s so much material, and it can be daunting. It might feel like you need a natural talent that
                      you&apos;re born with...but let us prove you wrong. <br /> <strong>Learn music with us!</strong>
                    </div>
                  )}
                </Spring>
              )}
            </VisbilitySensor>
          </div>

          <div className="error-message">
            {this.errorMessage()}
          </div>
          <div className="sign-up-section" ref={this.signupsection}>
            <h1 className="title" id="createAccount">Create account</h1>
            <div className="signup-placeholder">
              <input id="email-signup" className="emailSignup" onChange={this.onInputEmail} placeholder="email" />
              <input id="username-signup" className="usernameSignup" onChange={this.onInputUsername} placeholder="username" />
              <input id="password-signup" type="password" className="passwordSignup" onChange={this.onInputPassword} placeholder="password" />
            </div>
            <div className="input-subtitles">
              <div className="already-have">Already have an account?</div>
              <NavLink to="/signin">
                <div className="log-in">Log in here </div>
              </NavLink>
            </div>
            {/* <button onClick={this.checkInputs} type="submit" className="button" id="createaccountbutton">Create Account</button> */}
            <div className="button">{this.buttonText()}</div>
          </div>

        </div>
      </div>
    );
  }
}

function mapStateToProps(reduxState) {
  return {
    authentication: reduxState.auth.authenticated,
    error: reduxState.error,
  };
}

export default connect(mapStateToProps, { signupUser, setError, hideError })(HomePageWithoutUser);
