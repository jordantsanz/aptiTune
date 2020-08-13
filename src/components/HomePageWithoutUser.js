import React, { Component } from 'react';
import { connect } from 'react-redux';
import { helloWorld } from '../actions';

class HomePageWithoutUser extends Component {
  constructor(props) {
    super(props);
    console.log('mounting');
  }

  render() {
    return (
      <div> Hello world </div>
    );
  }
}

export default connect(null, { helloWorld })(HomePageWithoutUser);
