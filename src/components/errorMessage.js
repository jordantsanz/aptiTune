/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { hideError } from '../actions';

class ErrorNotification extends Component {
  render() {
    if (this.props.error.open === true) {
      console.log('rendering error message', this.props.error);
      if (this.props.error.message !== null) {
        return (
          <span role="button" tabIndex="0" className="error-message" onClick={() => { this.props.hideError(); }}>
            {this.props.error.message}
          </span>
        );
      }
    }
    return null;
  }
}

function mapStatetoProps(state) {
  return {
    error: state.error,
  };
}

export default connect(mapStatetoProps, { hideError })(ErrorNotification);
