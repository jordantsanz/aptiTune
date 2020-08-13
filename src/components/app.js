import React from 'react';
import {
  BrowserRouter as Router, Route, Switch,
} from 'react-router-dom';
import HomePageWithoutUser from './HomePageWithoutUser';

const HomePage = (props) => {
  return (
    <div><HomePageWithoutUser /></div>
  );
};

const App = (props) => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={HomePage} />
      </Switch>
    </Router>
  );
};

export default App;
