import React, { Component } from 'react';
import { connect } from 'react-redux';
import { helloWorld } from '../actions';

class HomePageWithUser extends Component {
  constructor(props) {
    super(props);
    console.log('mounting');
  }

  render() {
    return (
      <div> Hello world (from homepagewithuser)</div>
    );
  }
}

export default connect(null, { helloWorld })(HomePageWithUser);
