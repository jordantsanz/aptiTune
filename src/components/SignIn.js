/* eslint-disable eqeqeq */
/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { signInUser } from '../actions/index';

class SignIn extends Component {
  // eslint-disable-next-line no-useless-constructor
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      error: false,
    };
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
        error: true,
      });
    } else {
      const user = {
        email: this.state.email,
        password: this.state.password,
      };

      this.props.signInUser(user, this.props.history);
    }
  }

  errorModal = () => {
    if (this.state.error) {
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
      <div>
        {this.errorModal()}
        <h1 className="title" id="signin">Sign in! Just for placeholder, decorate how you like</h1>
        <h2 className="subtitle" id="returnemail">Email:</h2>
        <input onChange={this.onInputEmailChange} className="returnemail" type="input" />
        <h2 className="subtitle" id="returnpassword">Password: </h2>
        <input onChange={this.onInputPasswordChange} className="returnpassword" type="password" />
        <div> Don&apos;t have an account yet? <NavLink to="/signup" className="log-in-link"> <div className="sign-up-link">Sign up here!</div></NavLink>
        </div>
        <button onClick={this.submit} type="submit">Log-in</button>
      </div>
    );
  }
}

function mapStateToProps(reduxState) {
  return {
    authentication: reduxState.auth.authenticated,
  };
}

export default connect(mapStateToProps, { signInUser })(SignIn);
