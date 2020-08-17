import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
// import { connect } from 'react-redux';
// import { helloWorld } from '../actions';

class Login extends Component {
  constructor(props) {
    super(props);
    console.log('mounting');
  }

  render() {
    return (
      <div id="login">
        <div id="login-flex">
          <div>email</div>
          <input className="email" />
          <div>password</div>
          <input className="password" />
          <div><NavLink to="/withuser" className="log-in">Login!</NavLink></div>
        </div>
      </div>
    );
  }
}

export default Login;
// export default connect(null, { null })(Login);
