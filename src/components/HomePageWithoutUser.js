import React, { Component } from 'react';
import { connect } from 'react-redux';
import { helloWorld } from '../actions/index';

class HomePageWithoutUser extends Component {
  constructor(props) {
    super(props);
    console.log('mounting');
  }

  render() {
    return (
      <div> Hello there. </div>
    );
  }
}

export default connect(null, { helloWorld })(HomePageWithoutUser);
