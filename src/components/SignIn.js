/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/aria-role */
/* eslint-disable eqeqeq */
/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { signInUser, setError } from '../actions/index';
import ErrorNotification from './errorMessage';

class SignIn extends Component {
  // eslint-disable-next-line no-useless-constructor
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      errormodalstuff: false,
      // eslint-disable-next-line react/no-unused-state
      logging: false,
    };
  }

  buttonText = () => {
    if (this.state.logging && this.props.error.open === false) {
      console.log(this.state.logging, this.props.error.open);
      return (
        <div className="loader" />
      );
    } else {
      return (
        <button onClick={this.checkInputs} type="submit" id="login-button"> Log-in </button>
      );
    }
  }

  switchLogging = () => {
    console.log('fixit');
    this.setState({
      logging: false,
    });
  }

  onInputEmailChange = (event) => {
    this.setState({
      email: event.target.value,
    });
  };

  onInputPasswordChange = (event) => {
    this.setState({
      password: event.target.value,
    });
  };

  checkEmailInput = () => {
    let isValid = true;
    const attemptedEmail = document.getElementById('email-signin').value;
    console.log('attemptedemail', attemptedEmail);
    if (attemptedEmail.length === 0) {
      this.props.setError(1007);
      isValid = false;
    }
    return isValid;
  }

  checkPasswordInput = () => {
    let isValid = true;
    const attemptedPassword = document.getElementById('password-signin').value;
    console.log('attempted password', attemptedPassword);
    if (attemptedPassword.length === 0) {
      this.props.setError(1008);
      isValid = false;
    }
    return isValid;
  }

  checkInputs = () => {
    const emailValid = this.checkEmailInput();
    const passValid = this.checkPasswordInput();

    if (emailValid && passValid) {
      this.submit();
    }
  }

  submit = () => {
    if (this.state.email == '' || this.state.password == '') {
      this.setState({
        errormodalstuff: true,
      });
    } else {
      const user = {
        email: this.state.email,
        password: this.state.password,
      };
      this.setState({
        logging: true,
      });

      this.props.signInUser(user, this.props.history);
    }
  }

  errorModal = () => {
    if (this.state.errormodalstuff) {
      return (
        <h1 className="error">Please fill in all inputs. </h1>
      );
    } else {
      return (
        <div className="blank" />
      );
    }
  }

  render() {
    return (
      <div className="signin-background">
        <div className="clickyboy" role="click" onClick={this.switchLogging}>
          <ErrorNotification />
        </div>
        <h1 className="title" id="log-in-title">Log-in here:</h1>
        <input placeholder="email" onChange={this.onInputEmailChange} className="returnemailinput" id="email-signin" type="input" />
        <input placeholder="password" onChange={this.onInputPasswordChange} className="returnpasswordinput" id="password-signin" type="password" />
        <div className="linktomainpage"> Don&apos;t have an account yet? <NavLink to="/signup" className="log-in-link"> <div className="sign-up-link">Sign up here!</div></NavLink>
        </div>
        <div className="button">{this.buttonText()} </div>
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

export default connect(mapStateToProps, { signInUser, setError })(SignIn);
