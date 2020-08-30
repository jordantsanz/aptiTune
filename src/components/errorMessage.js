/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { hideError } from '../actions';

const ErrorMessage = (props) => {
  return (
    <div className="error-message-div">
      {props.message}
    </div>
  );
};

class ErrorNotification extends Component {
  render() {
    if (this.props.error.open === true) {
      const listErrors = this.props.error.messages.map((message) => (
        <ErrorMessage className="error-message-div" message={message} key={message} />
      ));

      return (
        <span role="button" tabIndex="0" className="error-message" onClick={() => { this.props.hideError(); }}>
          {listErrors}
        </span>
      );
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
