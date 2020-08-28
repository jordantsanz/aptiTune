import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import HomePageWithoutUser from './HomePageWithoutUser';
import HomePageWithUser from './HomePageWithUser';
import PrivateRoute from './privateRoute';
import SignIn from './SignIn';
import ProfilePage from './ProfilePage';
import Page from './Lesson/Page';
// import Lesson from './Lesson/Lesson';
import AudioWriting from './AudioWriting';
// import AudioLesson from './AudioLesson';

const App = (props) => {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={HomePageWithoutUser} />
        <Route path="/signup" component={HomePageWithoutUser} />
        <PrivateRoute path="/home" component={HomePageWithUser} />
        <Route path="/signin" component={SignIn} />
        <Route path="/lessons/:lessonid" component={Page} />
        <Route path="/audiowriting" component={AudioWriting} />
        <PrivateRoute path="/:username" component={ProfilePage} />
        {/* <Route path="/page" component={Page} /> fix with real routing path */}
      </Switch>
    </Router>
  );
};

export default App;
