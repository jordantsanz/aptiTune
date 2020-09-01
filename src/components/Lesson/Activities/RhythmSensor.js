/* eslint-disable react/no-did-update-set-state */
/* eslint-disable no-loop-func */
/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable array-callback-return */
/* eslint-disable max-len */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable react/style-prop-object */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink, withRouter } from 'react-router-dom';
// import { SingleEntryPlugin } from 'webpack';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlay, faPause,
} from '@fortawesome/free-solid-svg-icons';
import { getLesson } from '../../../actions/index';
import drawStaff from '../../DrawStaff';

function mapStateToProps(reduxState) {
  return {
    pages: reduxState.lesson.pages,
  };
}
class RhythmSensor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageNumber: 0,
      correctClicked: false,
      times: [],
      correctAnswers: [],
      firstClick: true,
      seedTime: 0,
      firstRender: true,
      bps: 0,
      page: null,
      metronomeAudio: new Audio('https://aptitune.s3.amazonaws.com/metronomeClick.wav'),
      tapAudio: new Audio('https://aptitune.s3.amazonaws.com/click2.wav'),
      buttonColor: 'red',
      countDownNumber: 'Ready?',
      beginTapping: false,
      resultsReady: false,
      correct: false,
      firstAttempt: true,
      scoreArray: [],
      reload: false,
      next: 1,
    };
    window.addEventListener('keydown', this.handleKeyDown);
  }

    componentDidMount = () => {
      const id = localStorage.getItem('lesson');
      const pageNum = localStorage.getItem('next');
      this.setState({ pageNumber: pageNum, next: pageNum + 1 });
      const { history } = this.props;
      this.props.getLesson(id, history, false);
    }

    componentDidUpdate() {
      if (this.state.firstRender && !this.state.reload) {
        this.firstRender(this.state.pageNumber);
      }
      if (this.state.reload) {
        const id = localStorage.getItem('lesson');
        const pageNum = localStorage.getItem('next');
        this.setState({ pageNumber: pageNum, reload: false });
        const { history } = this.props;
        this.props.getLesson(id, history, false);
        this.firstRender(pageNum);
      }
    }

    componentWillUnmount = () => {
      window.removeEventListener('keydown', this.handleKeyDown);
    }

    playAnswer = () => {
      if (!this.state.playingAnswer) {
        const ans = this.makeCorrectnessArray();
        this.setState({ playingAnswer: true });
        const playCount = ans.length;
        this.playMetronomeClick(ans.length - 1, false);
        let index = 0;
        // this.playMetronomeClick(this.state.page.activity.rhythmPattern.length - 1);
        while (index < playCount) {
          const interval = ans[index];
          setTimeout(() => {
          // this.state.tapAudio.pause();
            this.state.tapAudio.play();
            if (interval === ans[ans.length - 1]) {
              this.hideProgress();
            }
          }, interval);
          index += 1;
        }
      }
    }

    playMetronomeClick = (number, userAttempt) => {
      this.initiateProgress();
      let i = 0;
      const v = setInterval(() => {
        if (i === number + 4) {
          if (userAttempt) {
            this.getResults();
          }
          clearInterval(v);
        } else {
          this.state.metronomeAudio.pause();
          this.state.metronomeAudio.play();
          const d = new Date();
          i += 1;
          if (i < 5 && userAttempt) {
            this.setState({ buttonColor: 'red', countDownNumber: 5 - i });
          } else {
            if (i === 5) {
              this.showProgress();
            }
            this.setState({ buttonColor: 'green', countDownNumber: 'GO!' });
          }
        }
      }, 1000 / parseFloat(this.state.bps));
    }

    startPlay = () => {
      const d = new Date();
      const t = d.getTime();
      const relTime = 0;
      if (this.state.firstClick) {
        this.makeCorrectnessArray();
        this.setState({
          firstClick: false, seedTime: t, beginTapping: true, times: [],
        });
        this.playMetronomeClick(this.state.page.activity.rhythmPattern.length - 1, true);
      }
    }

    handleKeyDown = () => {
      const d = new Date();
      const t = d.getTime();
      if (this.state.beginTapping) {
        this.state.tapAudio.pause();
        this.state.tapAudio.play();
        const relTime = t - this.state.seedTime;
        const temp = this.state.times;
        this.setState({ times: temp.concat([relTime]) });
        this.setState({ time: t });
      }
    }

    // correctness array gives correct times for space bar to be pressed
    makeCorrectnessArray = () => {
      const ansLength = this.state.page.activity.rhythmPattern.length;
      // account for counting in & lag time between click and audio playing
      let cumulativeTime = parseInt(5000 / this.state.bps, 10) + 0;
      let correctAnswers = this.calculateTime(cumulativeTime, null);
      // build array correctAnswers with the correct times!
      for (let i = 0; i < ansLength - 1; i += 1) {
        const noteVal = parseFloat(this.state.page.activity.rhythmPattern[i], 10);
        const beatVal = parseFloat(this.state.page.activity.beatType, 10);
        const timeValue = (beatVal / noteVal) / this.state.bps;
        cumulativeTime = parseInt(parseFloat(cumulativeTime) + timeValue * 1000, 10);
        correctAnswers = this.calculateTime(cumulativeTime, correctAnswers);
      }
      this.setState({ correctAnswers });
      return correctAnswers;
    }

    calculateTime = (cumulativeTime, correctAnswers) => {
      const finalTime = parseInt(cumulativeTime, 10);
      let newAnswers = [];
      if (correctAnswers == null) {
        newAnswers = [finalTime];
      } else {
        newAnswers = correctAnswers.concat([finalTime]);
      }
      return newAnswers;
    }

    getResults = () => {
      // console.log('gaugeCorrectness called');
      const ans = this.state.correctAnswers;
      const lengthAns = ans.length;
      // console.log('lengthAns: ', lengthAns);
      const { times } = this.state;
      const timesLength = times.length;
      // console.log('times input by user ', times);
      let correct = true;
      // check all answers
      if (lengthAns !== timesLength) {
        correct = false;
      }
      for (let i = 0; i < lengthAns; i += 1) {
        if (i === timesLength - 1 && i !== lengthAns - 1) {
          break;
        }
        const correctAns = parseInt(ans[i], 10);
        const userAns = times[i];
        // account for lag
        if (Math.abs(correctAns - userAns) < 100) {
          console.log('Answer', i, ' is correct! -- off by ', Math.abs(correctAns - userAns), 'miliseconds');
        } else {
          console.log('Answer', i, 'incorrect : off by', Math.abs(correctAns - userAns), 'miliseconds');
          console.log('User ans: ', userAns, 'correct ans: ', correctAns);
          correct = false;
        }
      }
      this.setState({ firstClick: true, resultsReady: true, correct });
      // reset if incorrect so they can try again
      if (!correct) {
        this.setState({
          userAns: [],
          buttonColor: 'red',
          countDownNumber: 'Ready?',
          beginTapping: false,
          resultsReady: false,
          correct: false,
          firstAttempt: false,
          firstClick: true,
          reload: false,
        });
        // deal with error for quiz
        if (this.props.lessonType === 'quiz') {
          this.props.incrementErrorCount();
        }
      }
    }

    hideProgress = () => {
      const elem = document.getElementById('myBar');
      elem.style.width = '0%';
      this.setState({ playingAnswer: false });
    }

    initiateProgress = () => {
      const elem = document.getElementById('myBar');
      elem.style.width = '2%';
    }

    showProgress = () => {
      const maxWidth = 90;
      let i = 0;
      const interval = this.calculateIntervalForProgress();
      const partition = 0;
      const incrementValue = this.calculateIncrementValue(maxWidth);
      if (i === 0) {
        i = 1;
        const elem = document.getElementById('myBar');
        let width = 5;
        const id = setInterval(() => {
          if (width >= maxWidth) {
            clearInterval(id);
            i = 0;
          } else {
            width += incrementValue / 10;
            elem.style.width = `${width}%`;
          }
        }, interval / 10);
      }
    }

    calculateIntervalForProgress = () => {
      const beatCount = this.state.page.activity.rhythmPattern.length - 1;
      const lastTime = parseInt(this.state.correctAnswers[beatCount], 10);
      const firstTime = parseInt(this.state.correctAnswers[0], 10);
      const interval = (lastTime - firstTime) / beatCount;
      return interval;
    }

    calculateIncrementValue = (maxWidth) => {
      const beatCount = this.state.page.activity.rhythmPattern.length - 1;
      const incrementValue = maxWidth / (beatCount);
      return incrementValue;
    }

    goToNext = () => {
      this.props.onSubmit();
      this.setState({
        pageNumber: 0,
        correctClicked: false,
        times: [],
        correctAnswers: [],
        firstClick: true,
        seedTime: 0,
        firstRender: true,
        bps: 0,
        page: null,
        buttonColor: 'red',
        countDownNumber: 'Ready?',
        beginTapping: false,
        resultsReady: false,
        correct: false,
        firstAttempt: true,
        scoreArray: [],
        reload: true,
        playingAnswer: false,
      });
      // remove old staff
      this.removeStaff();
    }

    removeStaff = () => {
      const staff = document.getElementById('rhythmScore');
      while (staff.hasChildNodes()) {
        staff.removeChild(staff.lastChild);
      }
    }

    createScoreArray = (pageNum) => {
      const { pages } = this.props;
      const page = pages[pageNum];
      let array = [];
      // format notes for drawStaff()
      page.activity.rhythmPattern.map((note) => {
        if (note === '1') {
          array = array.concat(['G4/w']);
        } else if (note === '2') {
          array = array.concat(['G4/h']);
        } else if (note === '4') {
          array = array.concat(['G4/q']);
        } else if (note === '8') {
          array = array.concat(['G4/8']);
        } else if (note === '16') {
          array = array.concat(['G4/16']);
        }
      });
      this.setState({ scoreArray: array });
      return array;
    }

    firstRender = (pageNum) => {
      const { pages } = this.props;
      const page = pages[pageNum];
      const next = parseInt(localStorage.getItem('next'), 10);
      if (page !== null && page !== undefined && page.activity_type === 'RhythmSensor') {
        const { bpm } = page.activity;
        const bps = bpm / 60;
        this.setState({ firstRender: false, bps, page });
        this.createScoreArray(pageNum);
      }
    }

    nullScoreArray = () => {
      this.setState({ scoreArray: null });
    }

    render() {
      if (this.state.page === null || this.state.page === undefined) {
        return (
          <div className="rhythmActivity">
            Loading...
          </div>
        );
      }
      if (this.state.scoreArray != null) {
        const array = this.state.scoreArray;
        this.nullScoreArray();
        return (
          <div className="rhythmActivity">
            <div>{drawStaff('treble', this.state.scoreArray, 'rhythmScore')}</div>
            <div id="rhythm-play-button">
              <button type="button" className="recordButton" id="playbutton" onClick={this.startPlay}><FontAwesomeIcon icon={faPlay} className="icon" id="play" alt="play-icon" /></button>
            </div>
          </div>
        );
      }
      if (this.state.beginTapping && !this.state.resultsReady) {
        return (
          <div>
            <div id="progress">
              <div id="myBar" />
            </div>
            <div className="rhythmActivity">
              <div className="rhythmInstructions">Press the space bar to the rhythm!</div>
              <div className="countDown">{this.state.countDownNumber}</div>
            </div>
          </div>
        );
      }
      if (this.state.resultsReady && this.state.correct) {
        return (
          <div className="rhythmActivity" id="successMessage">
            Awesome! That was perfect!
            <button type="button" className="nextButton" id="rhythmnextbutton" onClick={this.goToNext}>
              Next
            </button>
          </div>
        );
      }
      if (!this.state.firstAttempt) {
        return (
          <div className="rhythmActivity" id="failureMessage">
            <div id="progress">
              <div id="myBar" />
            </div>
            <div> Not quite, try again!</div>
            <button id="start-record" className="recordButton" type="button" onClick={this.startPlay}><FontAwesomeIcon icon={faPlay} className="icon" id="play" alt="play-icon" /></button>
            <button id="start-record" className="recordButton" type="button" onClick={this.playAnswer}>Play Answer</button>
          </div>
        );
      } else {
        return (
          <div className="rhythmActivity" onKeyDown={this.handleKeyPress} tabIndex="0">
            <div id="progress">
              <div id="myBar" />
            </div>
            <div className="rhythmButtons">
              <button id="start-record" className="recordButton" type="button" onClick={this.startPlay}><FontAwesomeIcon icon={faPlay} className="icon" id="play" alt="play-icon" /></button>
              <button id="start-record" className="recordButton" type="button" onClick={this.playAnswer}>Play Answer</button>
            </div>
          </div>
        );
      }
    }
}
export default withRouter(connect(mapStateToProps, { getLesson })(RhythmSensor));
