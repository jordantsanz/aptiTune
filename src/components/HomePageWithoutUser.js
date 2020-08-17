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
          <div className="music-is-hard"> Music is hard. </div>
          <div className="homepage-without-description"> We want to change that. <br />
            Want to be the next taylor swift?
            <br />
            Let&apos;s make that happen.
          </div>
          <input className="email" onChange={this.onInputEmail} />
          <input className="username" onChange={this.onInputUsername} />
          <input type="password" className="password" onChange={this.onInputPassword} />
          <div className="have-account">Already have an account?
            <NavLink to="/signin" className="log-in-link">
              <div className="log-in-link">Log in here</div>
            </NavLink>
          </div>
          <button onClick={this.submit} type="submit" className="create-account">Create Account</button>
          {this.errorMessage()}
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
