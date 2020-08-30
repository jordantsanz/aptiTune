/* eslint-disable eqeqeq */
/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { signInUser } from '../actions/index';
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

  switchLogging = () => {
    console.log('switchlogging called in signin');
    this.setState({
      logging: false,
    });
  }

  buttonText = () => {
    if (this.state.logging && this.props.error.message === null) {
      return (
        <div className="loader" />
      );
    } else {
      return (
        <button onClick={this.submit} type="submit" id="login-button"> Log-in </button>
      );
    }
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
        // eslint-disable-next-line react/no-unused-state
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
        <div className="error-message" role="button" tabIndex="0" onClick={() => this.switchLogging()}>
          <ErrorNotification />
        </div>
        <h1 className="title" id="log-in-title">Log-in here:</h1>
        <input placeholder="email" onChange={this.onInputEmailChange} className="returnemailinput" type="input" />
        <input placeholder="password" onChange={this.onInputPasswordChange} className="returnpasswordinput" type="password" />
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

export default connect(mapStateToProps, { signInUser })(SignIn);
