/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { connect } from 'react-redux';
import { withRouter, Route, Redirect } from 'react-router-dom';

function mapStateToProps(reduxState) {
  return {
    authenticated: reduxState.auth.authenticated,
  };
}

const PrivateRoute = ({ component: Child, ...props }) => {
  return (
    <Route
      {...props}
      render={(routeProps) => (props.authenticated ? (
        <Child {...routeProps} />
      ) : (
        <Redirect to="/signin" />
      ))}
    />
  );
};

export default withRouter(connect(mapStateToProps, null)(PrivateRoute));
