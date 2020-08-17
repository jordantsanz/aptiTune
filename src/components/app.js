import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import HomePageWithoutUser from './HomePageWithoutUser';
import HomePageWithUser from './HomePageWithUser';
import Login from './Login';

const App = (props) => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={HomePageWithoutUser} />
        <Route path="/withuser" component={HomePageWithUser} />
        <Route path="/login" component={Login} />
      </Switch>
    </Router>
  );
};

export default App;
