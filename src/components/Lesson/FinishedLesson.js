/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unused-state */
/* eslint-disable no-useless-constructor */
/* eslint-disable react/prefer-stateless-function */
import React, { Component } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { getLesson, getUserInfo, updateUserInfo } from '../../actions/index';
import NavBar from '../NavBar';

function mapStateToProps(reduxState) {
  return {
    currentUser: reduxState.user,
    lesson: reduxState.lesson,
    pages: reduxState.lesson.pages,
  };
}

class FinishedLesson extends Component {
  constructor(props) {
    super(props);
    this.state = {
      flatCount: 0,
      singCount: 0,
      listeningCount: 0,
      rhythmCount: 0,
      flatErrors: 0,
      listeningErrors: 0,
      rhythmErrors: 0,
      singErrors: 0,
      errorCount: 0,
      numberComplete: 0,
      totalQuestions: 0,
      finishedQuiz: false,
      processed: false,
      histogramAnimate: false,
      earnedBadge: false,
      giveBadgeCalled: false,
      userStatsUpdated: false,
    };
  }

  componentDidMount = () => {
    // get userinfo
    this.props.getUserInfo();
    const id = localStorage.getItem('lesson');
    localStorage.setItem('next', 0);
    const { history } = this.props;
    this.props.getLesson(id, history, false);
    this.props.getUserInfo();
  }

  componentDidUpdate = () => {
    if (!this.state.processed && this.props.lesson !== null && this.props.lesson !== undefined) {
      this.processResults();
    } else if (!this.state.histogramAnimated) {
      // animate histograms
      this.animateHistograms();
    }
    if (this.props.currentUser.username !== null && !this.state.giveBadgeCalled && this.state.processed) {
      this.giveBadge();
    }
    if (this.props.currentUser.username !== null && !this.state.userStatsUpdated && this.props.lesson.lesson_type === 'quiz' && this.state.processed) {
      this.updateUserStats();
    }
  }

  renderBadge = () => {
    if (this.state.earnedBadge) {
      return (
        <div className="finished-lesson-badge">
          <div className="finished-lesson-badge-earned">Badge earned: {this.props.lesson.badge.name} </div>
          <img className="badge-image" alt="badge" src={this.props.lesson.badge.iconUrl} />
        </div>
      );
    } else {
      return (
        <div />
      );
    }
  }

  updateUserStats = () => {
    // 0: flatView, 1: listening, 2: rhythm, 3: noteSinging
    const correct = this.props.currentUser.questionsCorrect;
    const incorrect = this.props.currentUser.questionsIncorrect;
    console.log('user', this.props.currentUser);
    console.log('correct:', correct);
    console.log('incorrect:', incorrect);
    // 0 index: flatView
    console.log('this.state.flatCount', this.state.flatCount);
    correct[0] = this.props.currentUser.questionsCorrect[0] + (this.state.flatCount - this.state.flatErrors);
    incorrect[0] = this.props.currentUser.questionsIncorrect[0] + this.state.flatErrors;

    // 1 index: listening
    correct[1] = this.props.currentUser.questionsCorrect[1] + (this.state.listeningCount - this.state.listeningErrors);
    incorrect[1] = this.props.currentUser.questionsIncorrect[1] + this.state.listeningErrors;

    // 2 index: rhythm
    correct[2] = this.props.currentUser.questionsCorrect[2] + (this.state.rhythmCount - this.state.rhythmErrors);
    incorrect[2] = this.props.currentUser.questionsIncorrect[2] + this.state.rhythmErrors;

    // 3 index: singing
    correct[3] = this.props.currentUser.questionsCorrect[3] + (this.state.singCount - this.state.singErrors);
    incorrect[3] = this.props.currentUser.questionsIncorrect[3] + this.state.singErrors;

    // updateUserInfo
    console.log('questionsCorrect', correct);
    console.log('questionsIncorrect', incorrect);
    this.props.updateUserInfo({ questionsCorrect: correct, questionsIncorrect: incorrect });
    this.setState({ userStatsUpdated: true });
  }

  giveBadge = () => {
    console.log('give badge func with badge', this.props.lesson.badge);
    // get lesson info
    let { badges } = this.props.currentUser.badges;
    if (this.props.lesson.badge !== undefined) {
      this.setState({ giveBadgeCalled: true });
      if (this.props.currentUser.badges.length === 1 && this.props.currentUser.badges[0].iconUrl === '') {
        console.log('giving user badge!');
        this.setState({ earnedBadge: true });
        badges = this.props.currentUser.badges.concat(this.props.lesson.badge); // need to do this so homepage calculates correctly?
        this.props.updateUserInfo({
          badges,
        });
      } else {
        console.log('checking if badge is unique, with finishedquiz', this.state.finishedQuiz);
        let isUnique = true;
        this.props.currentUser.badges.forEach((badge) => {
          if (badge.iconUrl === this.props.lesson.badge.iconUrl) {
            isUnique = false;
            console.log('badge is a repeat');
          }
        });
        if (isUnique && (this.props.lesson.lesson_type !== 'quiz' || this.state.finishedQuiz)) { // put this in so that you get a badge for other lessons
          console.log('giving user badge');
          badges = this.props.currentUser.badges.concat(this.props.lesson.badge);
          this.props.updateUserInfo({
            badges,
          });
          this.setState({ earnedBadge: true });
        }
      }
    }
  }

  playAgain = () => {
    const id = localStorage.getItem('lesson');
    const { history } = this.props;
    this.props.getLesson(id, history, true);
  }

  processResults = () => {
    console.log('Processing results');
    if (!this.state.processed) {
      // set state values
      this.setState({ totalQuestions: this.props.pages.length });

      const finished = localStorage.getItem('finished');
      console.log('finished in processresults:', finished);
      if (finished === 'true') {
        this.getActivityCounts(this.props.lesson.pages.length);
        // if they completed the quiz
        // check errorCount
        const errCount = parseInt(localStorage.getItem('errorCount'), 10);
        console.log('this.props.lesson.pages.length', this.props.lesson.pages.length);
        console.log('numberComplete', this.props.lesson.pages.length - errCount);
        this.setState({ numberComplete: this.props.lesson.pages.length, errorCount: errCount, finishedQuiz: true });
        if (errCount === 0) {
          // calculate err/success rates -- 100% success
        } else if (errCount === 1) {
          const firstErr = parseInt(localStorage.getItem('err1'), 10);
          // calculate error/success rates
          this.checkError(firstErr);
        } else if (errCount === 2) {
          const firstErr = parseInt(localStorage.getItem('err1'), 10);
          const secondErr = parseInt(localStorage.getItem('err2'), 10);
          // calculate error/succes rates
          this.checkError(firstErr);
          this.checkError(secondErr);
        }
      } else if (finished === 'false') {
        // if they failed to finish the quiz
        const firstErr = parseInt(localStorage.getItem('err1'), 10);
        const secondErr = parseInt(localStorage.getItem('err2'), 10);
        const thirdErr = parseInt(localStorage.getItem('err3'), 10);

        this.setState({ numberComplete: thirdErr, errorCount: 3 });
        console.log('err1', firstErr);
        console.log('err2', secondErr);
        console.log('err3', thirdErr);
        // calculate activity counts
        this.getActivityCounts(thirdErr + 1);
        this.calculateResultsOnIncomplete(firstErr, secondErr, thirdErr);
      }
    }
    // set processed to true
    this.setState({ processed: true });
  }

  getActivityCounts = (lastQ) => {
    // loop through lesson, counting number of each activity
    const { pages } = this.props;
    let fCount = 0;
    let lCount = 0;
    let rCount = 0;
    let sCount = 0;
    let index = 0;
    while (index < lastQ) {
      const page = this.props.pages[index];
      if (page !== undefined) {
        if (page.activity_type === 'FlatView') {
          fCount += 1;
        } else if (page.activity_type === 'Listening') {
          lCount += 1;
        } else if (page.activity_type === 'RhythmSensor') {
          rCount += 1;
        } else if (page.activity_type === 'SingNotes') {
          sCount += 1;
        }
      }
      index += 1;
    }
    // add final counts to state
    console.log('FlatCount: ', fCount);
    console.log('rhythmCount: ', rCount);
    console.log('listeningCount: ', lCount);
    console.log('singCount', sCount);
    this.setState({
      flatCount: fCount, rhythmCount: rCount, listeningCount: lCount, singCount: sCount,
    });
  }

  calculateResultsOnIncomplete = (err1, err2, err3) => {
    // calculate how much of the quiz was completed
    const percentComplete = parseFloat((err3) / this.props.lesson.pages.length);
    console.log('percent complete: ', percentComplete);
    // for each error, check and see what kind of questions they got wrong
    console.log('calling checkError with err1', err1);
    this.checkError(err1);
    console.log('calling checkError with err2', err2);
    this.checkError(err2);
    console.log('calling checkError with err3', err3);
    this.checkError(err3);
    // calculate their yield for each q kind as a percent
  }

  checkError = (err) => {
    console.log('checking err', err);
    const { pages } = this.props;
    const page = pages[err];
    let flatErrors = 0;
    let listeningErrors = 0;
    let rhythmErrors = 0;
    let singErrors = 0;
    console.log('page', page);
    console.log('pages', pages);
    if (page !== undefined && page !== null) {
      if (page.activity_type === 'FlatView') {
        flatErrors += 1;
      } else if (page.activity_type === 'Listening') {
        listeningErrors += 1;
      } else if (page.activity_type === 'RhythmSensor') {
        rhythmErrors += 1;
      } else if (page.activity_type === 'SingNotes') {
        singErrors += 1;
      }
      this.setState((prevState) => ({
        flatErrors: prevState.flatErrors + flatErrors,
        listeningErrors: prevState.listeningErrors + listeningErrors,
        rhythmErrors: prevState.rhythmErrors + rhythmErrors,
        singErrors: prevState.singErrors + singErrors,
      }));
    }
  }

  renderRhythmBar = () => {
    let percentCorrect = Math.round(((this.state.rhythmCount - this.state.rhythmErrors) / this.state.rhythmCount) * 100);
    if (percentCorrect < 0) {
      percentCorrect = 0;
    }
    if (this.state.rhythmCount > 0) {
      return (
        <div className="finished-histogram-element">
          <div>{percentCorrect}%</div>
          <div id="histo-progress">
            <div id="total-progress-bar-rhythm" />
            <div id="correct-progress-bar-rhythm" />
          </div>
          Rhythm
        </div>
      );
    } else {
      return (
        <div />
      );
    }
  }

  renderListeningBar = () => {
    let percentCorrect = Math.round(((this.state.listeningCount - this.state.listeningErrors) / this.state.listeningCount) * 100);
    if (percentCorrect < 0) {
      percentCorrect = 0;
    }
    if (this.state.listeningCount > 0) {
      return (
        <div className="finished-histogram-element">
          <div>{percentCorrect}%</div>
          <div id="histo-progress">
            <div id="total-progress-bar-listening" />
            <div id="correct-progress-bar-listening" />
          </div>
          Listening
        </div>
      );
    } else {
      return (
        <div />
      );
    }
  }

  renderReadingBar = () => {
    let percentCorrect = Math.round(((this.state.flatCount - this.state.flatErrors) / this.state.flatCount) * 100);
    if (percentCorrect < 0) {
      percentCorrect = 0;
    }
    if (this.state.flatCount > 0) {
      return (
        <div className="finished-histogram-element">
          <div>{percentCorrect}%</div>
          <div id="histo-progress">
            <div id="total-progress-bar-reading" />
            <div id="correct-progress-bar-reading" />
          </div>
          Sight-reading
        </div>
      );
    } else {
      return (
        <div />
      );
    }
  }

  renderSingingBar = () => {
    let percentCorrect = Math.round(((this.state.singCount - this.state.singErrors) / this.state.singCount) * 100);
    if (percentCorrect < 0) {
      percentCorrect = 0;
    }
    if (this.state.singingCount > 0) {
      return (
        <div className="finished-histogram-element">
          <div>{percentCorrect}%</div>
          <div id="histo-progress">
            <div id="total-progress-bar-singing" />
            <div id="correct-progress-bar-singing" />
          </div>
          Singing
        </div>
      );
    } else {
      return (
        <div />
      );
    }
  }

  visualizeData = () => {
    return (
      <div className="finished-lesson-histogram">
        {this.renderRhythmBar()}
        {this.renderListeningBar()}
        {this.renderReadingBar()}
        {this.renderSingingBar()}
      </div>
    );
  }

  animateHistograms = () => {
    // animate results
    console.log('animate histograms called');
    console.log('flatCount: ', this.state.flatCount);

    let percentCorrect = 0;
    if (this.state.rhythmCount >= this.state.rhythmErrors && this.state.rhythmCount !== 0) {
      percentCorrect = (this.state.rhythmCount - this.state.rhythmErrors) / this.state.rhythmCount;
      this.animateProgress('correct-progress-bar-rhythm', 'total-progress-bar-rhythm', percentCorrect);
    }

    if (this.state.listeningCount >= this.state.listeningErrors && this.state.listeningCount !== 0) {
      percentCorrect = (this.state.listeningCount - this.state.listeningErrors) / this.state.listeningCount;
      this.animateProgress('correct-progress-bar-listening', 'total-progress-bar-listening', percentCorrect);
    }

    if (this.state.singCount >= this.state.singErrors && this.state.singCount !== 0) {
      percentCorrect = (this.state.singCount - this.state.singErrors) / this.state.singCount;
      this.animateProgress('correct-progress-bar-singing', 'total-progress-bar-singing', percentCorrect);
    }

    if (this.state.flatCount >= this.state.flatErrors && this.state.flatCount !== 0) {
      console.log('this.state.flatCount', this.state.flatCount);
      console.log('this.state.flatErrors', this.state.flatErrors);
      percentCorrect = (this.state.flatCount - this.state.flatErrors) / this.state.flatCount;
      this.animateProgress('correct-progress-bar-reading', 'total-progress-bar-reading', percentCorrect);
    }
    this.setState({ histogramAnimated: true });
  }

  animateProgress = (id1, id2, percentCorrect) => {
    console.log('percentCorrect', percentCorrect);
    // const percentCorrect = parseFloat((this.state.flatCount - this.state.flatErrors) / (this.state.flatCount));
    const maxHeight = 100 * percentCorrect;
    // assume we want 2000 miliseconds to grow
    const interval = parseFloat(5000 / 100);
    const incrementValue = parseFloat(maxHeight / interval);
    const elem1 = document.getElementById(id1);
    const elem2 = document.getElementById(id2);
    let height1 = 0;
    let height2 = 100;
    // console.log('animateProgress called with id1', id1, 'maxHeight:', maxHeight, 'interval', interval, 'and incrementvalue', incrementValue);
    const int = setInterval(() => {
      if (height1 < maxHeight) {
        // console.log('in setInterval, with height', height1);
        height1 += incrementValue;
        height2 -= incrementValue;
        if (elem1 !== undefined && elem1 !== null) {
          elem1.style.height = `${height1}%`;
        }
        if (elem2 !== undefined && elem2 !== null) {
          elem2.style.height = `${height2}%`;
        }
      } else {
        clearInterval(int);
      }
    }, interval);
  }

  render() {
    if (this.props.lesson === null || this.props.lesson === undefined) {
      return (
        <div className="finished-lesson-main">
          Loading...
        </div>
      );
    }

    if (this.props.lesson.lesson_type === 'quiz') {
      return (
        <div className="finished-lesson-main">
          <NavBar />
          <div className="finished-lesson-content">
            <div className="finished-lesson-top-page">
              <div className="finished-lesson-top-page-content">
                <div className="finished-lesson-completed">Completed: {this.props.lesson.title} </div>
                <div>{this.renderBadge()}</div>
                <div className="finished-lesson-percent"> You got through {parseInt((this.state.numberComplete / this.state.totalQuestions) * 100, 10)} % of the quiz! </div>
                <div className="finished-lesson-description"> Nice job, {this.props.currentUser.username}! </div>
                <div className="finished-lesson-data">
                  <div id="score-breakdown">Your Score Breakdown</div>
                  <div>{this.visualizeData()}</div>
                </div>
              </div>
            </div>
            <div className="finished-lesson-bottom-page">
              <div className="finished-lesson-bottom-page-content">
                <div className="finished-lesson-stats">
                  <div className="finished-lesson-questions-answered" />
                </div>
                <div className="finished-lesson-buttons">
                  <NavLink to="/home"><button className="button" id="take-me-home" type="button"> Take me home </button></NavLink>
                  <button className="button" id="play-again" type="button" onClick={this.playAgain}> Play again </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="finished-lesson-main">
          <NavBar />
          <div className="finished-lesson-content">
            <div className="finished-lesson-top-page">
              <div className="finished-lesson-top-page-content">
                <div className="finished-lesson-completed">Completed: {this.props.lesson.title} </div>
                <div>{this.renderBadge()}</div>
                <div className="finished-lesson-description"> Nice job, {this.props.currentUser.username}! </div>
              </div>
            </div>
            <div className="finished-lesson-bottom-page">
              <div className="finished-lesson-bottom-page-content">
                <div className="finished-lesson-stats">
                  <div className="finished-lesson-questions-answered">
                    Questions answered correctly: {this.props.lesson.pages.length}
                  </div>
                </div>
                <div className="finished-lesson-buttons">
                  <NavLink to="/home"><button className="button" id="take-me-home" type="button"> Take me home </button></NavLink>
                  <button className="button" id="play-again" type="button" onClick={this.playAgain}> Play again </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}

export default withRouter(connect(mapStateToProps, { getLesson, getUserInfo, updateUserInfo })(FinishedLesson));
