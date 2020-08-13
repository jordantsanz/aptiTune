import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import HomePageWithoutUser from './HomePageWithoutUser';
import HomePageWithUser from './HomePageWithUser';

const App = (props) => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={HomePageWithoutUser} />
        <Route path="/withuser" component={HomePageWithUser} />
      </Switch>
    </Router>
  );
};

export default App;
