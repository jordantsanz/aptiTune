import React, { Component } from 'react';
import { connect } from 'react-redux';
import { helloWorld } from '../actions/index';

class HomePageWithoutUser extends Component {
  constructor(props) {
    super(props);
    console.log('just so this is not useless.');
  }

  render() {
    return (
      <div> Hello World from the HomePageWithoutUser component.</div>
    );
  }
}

export default connect(null, { helloWorld })(HomePageWithoutUser);
