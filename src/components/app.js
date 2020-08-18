import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import HomePageWithoutUser from './HomePageWithoutUser';
import HomePageWithUser from './HomePageWithUser';
import PrivateRoute from './privateRoute';
import SignIn from './SignIn';
import Page from './Page';

const App = (props) => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={HomePageWithoutUser} />
        <Route path="/signup" component={HomePageWithoutUser} />
        <PrivateRoute path="/withuser" component={HomePageWithUser} />
        <Route path="/signin" component={SignIn} />
        <Route path="/page" component={Page} /> {/* fix with real routing path */}
      </Switch>
    </Router>
  );
};

export default App;
