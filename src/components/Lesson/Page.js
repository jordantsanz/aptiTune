/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unused-state */
/* please work */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink, withRouter } from 'react-router-dom';
import { getLesson, updateUserInfo, getUserInfo } from '../../actions/index';
import NavBar from '../NavBar';
import FlatView from './Activities/FlatView';
import Listening from './Activities/Listening';
import RhythmSensor from './Activities/RhythmSensor';
import SingNotes from './Activities/SingNotes';

function mapStateToProps(reduxState) {
  return {
    currentUser: reduxState.user,
    lesson: reduxState.lesson,
    pages: reduxState.lesson.pages,
  };
}

class Page extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageNumber: 0,
      title: '',
      description: '',
      content: '',
      exercise: '',
      activity: '',
      nextPage: '',
      // stats specifically for quiz
      errorCount: 0,
      firstError: null,
      secondError: null,
      thirdError: null,
    };
  }

    componentDidMount = () => {
      console.log('componentDidMount called in page');
      // get userinfo
      this.props.getUserInfo();

      // get lesson info
      const id = localStorage.getItem('lesson');
      const pageNum = parseInt(localStorage.getItem('next'), 10);
      console.log('Next from localStorage', pageNum);
      this.setState({ pageNumber: pageNum });
      this.setState({ nextPage: pageNum + 1 });
      const { history } = this.props;
      localStorage.setItem('next', 0);
      this.props.getLesson(id, history, true);
    }

    goToNext = () => {
      if (this.props.lesson.lesson_type === 'quiz') {
        this.goToNextForQuiz();
      } else {
        console.log('going to next for lesson');
        this.goToNextForLesson();
      }
    }

    goToNextForLesson = () => {
      // for lesson module
      console.log('GOTONEXTCALLED');
      if (this.props.pages.length > this.state.pageNumber + 1) { // go to next lesson
        const local = parseInt(this.state.nextPage, 10);
        localStorage.setItem('next', local.toString());
        console.log('set next to ', local);
        this.setState((prevState) => ({ pageNumber: prevState.pageNumber + 1 }));
        this.setState((prevState) => ({ nextPage: prevState.nextPage + 1 }));
      } else {
        const id = localStorage.getItem('lesson');

        let completedLessons = this.props.currentUser.completed;
        if (this.props.currentUser.completed === undefined || this.props.currentUser.completed === []) {
          completedLessons = [id];
        } else if (!this.props.currentUser.completed.includes(id)) {
          console.log('result of includes', this.props.currentUser.completed.includes(id));
          completedLessons = this.props.currentUser.completed.concat(id);
        }

        const { badges } = this.props.currentUser.badges;
        const fields = { completedLessons, badges };
        console.log('fields in goToNext: ', fields);
        console.log('PROPS:', this.props);
        console.log('LESSON', this.props.lesson);
        console.log('BADGE:', this.props.lesson.badge);

        console.log(badges);

        this.props.updateUserInfo(fields);

        // give badge
        const { history } = this.props;
        history.push('/finished');
      // set user info to add
      }
    }

    goToNextForQuiz = () => {
      // handle errorCount
      const history = this.props;
      console.log('history:', history);
      if (this.state.errorCount >= 3) {
        // updateUserInfo with stats
        history.push('/finished');
      } else if (this.props.pages.length > this.state.pageNumber + 1) {
        const local = parseInt(this.state.nextPage, 10);
        localStorage.setItem('next', local.toString());
        this.setState((prevState) => ({ pageNumber: prevState.pageNumber + 1 }));
        this.setState((prevState) => ({ nextPage: prevState.nextPage + 1 }));
      } else {
        // handle successfully completed quiz
        localStorage.setItem('errorCount', this.state.errorCount);
        if (this.state.firstError !== null) {
          localStorage.setItem('err1', this.state.firstError);
        }
        if (this.state.secondError !== null) {
          localStorage.setItem('err2', this.state.secondError);
        }
        console.log('finished = true');
        localStorage.setItem('finished', 'true');
        console.log('history:', history);
        this.goToFinished();
      }
    }

    goToFinished = () => {
      const { history } = this.props;
      history.push('/finished');
    }

    incrementErrorCount = () => {
      console.log('Incrementing error count to ', this.state.errorCount + 1);
      // keep stats on where the user messed up
      const pageNum = this.state.pageNumber;
      if (this.state.errorCount === 0) {
        this.setState({ firstError: pageNum });
        // increment errorCount
        this.setState((prevState) => ({
          errorCount: prevState.errorCount + 1,
        }));
      } else if (this.state.errorCount === 1) {
        this.setState({ secondError: pageNum });
        // increment errorCount
        this.setState((prevState) => ({
          errorCount: prevState.errorCount + 1,
        }));
      } else if (this.state.errorCount === 2) {
        this.setState({ thirdError: pageNum });
        localStorage.setItem('err1', this.state.firstError);
        localStorage.setItem('err2', this.state.secondError);
        localStorage.setItem('err3', pageNum);
        // go to finished page
        localStorage.setItem('finished', 'false');
        const { history } = this.props;
        // updateUserInfo with stats
        history.push('/finished');
      }
    }

    renderX = () => {
      if (this.props.lesson.lesson_type === 'quiz') {
        console.log('renderx called with errorCount', this.state.errorCount);
        if (this.state.errorCount === 0) {
          return (
            <div />
          );
        } else if (this.state.errorCount === 1) {
          return (
            <div>X</div>
          );
        } else if (this.state.errorCount === 2) {
          return (
            <div>X X</div>
          );
        } else {
          return (
            <div>X X X</div>
          );
        }
      } else {
        return (
          <div />
        );
      }
    }

    renderImage = () => {
      const page = this.props.pages[this.state.pageNumber];
      console.log('page', page);
      if (page.content_type === 'image' && page !== undefined && page !== null) {
        return (
          <img alt=" " className="suppContent" title="supplementaryContent" src={page.content.url} />
        );
      } else {
        return (
          <div />
        );
      }
    }

    render() {
      // add page for rendering
      if (this.props.pages === null || this.props.pages === undefined || this.props.pages.length === 0) {
        return (
          <div>
            Loading...
          </div>
        );
      }
      const page = this.props.pages[this.state.pageNumber];
      console.log('page:', page);
      if (page.activity_type === 'FlatView') {
        return (
          <div className="current-page">
            <NavBar />
            <div className="full-page">
              <div className="page-top">
                <div className="page-top-topthird">
                  <div className="page-top-title">{page.content.title}</div>
                  <div className="page-top-quiz-x">{this.renderX()}</div>
                  <div className="page-top-nav">
                    <div className="page-top-nav-level">Level {this.state.pageNumber + 1} of {this.props.pages.length}</div>
                  </div>
                </div>
                <div className="page-top-description">{page.content.description}</div>
                <div className="page-top-content-container">
                  {this.renderImage()}
                </div>
              </div>
              <div className="page-bottom">
                <div className="flat-score" id="flatScore" />
                <div className="page-bottom-content">
                  <FlatView onSubmit={this.goToNext} lessonType={this.props.lesson.lesson_type} incrementErrorCount={this.incrementErrorCount} errorCount={this.state.errorCount} />
                </div>
              </div>
            </div>
          </div>
        );
      } else if (page.activity_type === 'Listening') {
        return (
          <div className="current-page">
            <NavBar />
            <div className="full-page">
              <div className="page-top">
                <div className="page-top-topthird">
                  <div className="page-top-title">{page.content.title}</div>
                  <div className="page-top-quiz-x">{this.renderX()}</div>
                  <div className="page-top-nav">
                    <div className="page-top-nav-level">Level {this.state.pageNumber + 1} of {this.props.pages.length}</div>
                  </div>
                </div>
                <div className="page-top-description">{page.content.description}</div>
                <div className="page-top-content">{page.content.instructions}</div>
                <div className="page-top-content-container">
                  {this.renderImage()}
                </div>
              </div>
              <div className="page-bottom">
                <div className="page-bottom-content">
                  <Listening onSubmit={this.goToNext} lessonType={this.props.lesson.lesson_type} incrementErrorCount={this.incrementErrorCount} errorCount={this.state.errorCount} />
                </div>
              </div>
            </div>
          </div>
        );
      } else if (page.activity_type === 'RhythmSensor') {
        return (
          <div className="current-page">
            <NavBar />
            <div className="full-page">
              <div className="page-top">
                <div className="page-top-topthird">
                  <div className="page-top-title">{page.content.title}</div>
                  <div className="page-top-quiz-x">{this.renderX()}</div>
                  <div className="page-top-nav">
                    <div className="page-top-nav-level">Level {this.state.pageNumber + 1} of {this.props.pages.length}</div>
                  </div>
                </div>
                <div className="page-top-description">{page.content.description}</div>
                <div className="page-top-content">{page.content.instructions}</div>
                <div className="page-top-content-container">
                  {this.renderImage()}
                </div>
              </div>
              <div className="page-bottom">
                <div className="page-bottom-content">
                  <div className="rhythm-content-div-holder">
                    <div className="rhythm-score" id="rhythmScore" />
                    <RhythmSensor onSubmit={this.goToNext} lessonType={this.props.lesson.lesson_type} incrementErrorCount={this.incrementErrorCount} errorCount={this.state.errorCount} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      } else if (page.activity_type === 'SingNotes') {
        return (
          <div className="current-page">
            <NavBar />
            <div className="full-page">
              <div className="page-top">
                <div className="page-top-topthird">
                  <div className="page-top-title">{page.content.title}</div>
                  <div className="page-top-quiz-x">{this.renderX()}</div>
                  <div className="page-top-nav">
                    <div className="page-top-nav-level">Level {this.state.pageNumber + 1} of {this.props.pages.length}</div>
                  </div>
                </div>
                <div className="page-top-description">{page.content.description}</div>
                <div className="page-top-content">{page.content.instructions}</div>
                <div className="page-top-content-container">
                  {this.renderImage()}
                </div>
              </div>
              <div className="page-bottom">
                <div className="page-bottom-content-div">
                  <SingNotes onSubmit={this.goToNext} lessonType={this.props.lesson.lesson_type} incrementErrorCount={this.incrementErrorCount} errorCount={this.state.errorCount} />
                  <div className="sheetmusic-holder">
                    <div id="sheetmusic"> </div>
                  </div>
                  <div id="drawmessage"> </div>
                  <div className="sheetmusic-holder">
                    <div id="yournotes"> </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      } else {
        return (
          <div>
            Uh oh... this isnt a valid lesson
          </div>
        );
      }
    }
}

export default withRouter(connect(mapStateToProps, { getLesson, updateUserInfo, getUserInfo })(Page));
