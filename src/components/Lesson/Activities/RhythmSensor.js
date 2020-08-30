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
    };
    window.addEventListener('keydown', this.handleKeyDown);
  }

    componentDidMount = () => {
      const id = localStorage.getItem('lesson');
      const pageNum = localStorage.getItem('next');
      console.log('pageNum: ', pageNum);
      this.setState({ pageNumber: pageNum });
      const { history } = this.props;
      this.props.getLesson(id, history, false);
      console.log('Component mounted in Rhythmsensor');
    }

    componentDidUpdate() {
      if (this.state.firstRender) {
        this.firstRender();
      }
    }

    componentWillUnmount = () => {
      window.removeEventListener('keydown', this.handleKeyDown);
    }

    playAnswer = () => {
      const ans = this.makeCorrectnessArray();
      this.setState({ playingAnswer: true });
      console.log('Playing answer');
      console.log('Ans: ', ans);
      const playCount = ans.length;
      this.playMetronomeClick(ans.length - 1, false);
      let index = 0;
      // this.playMetronomeClick(this.state.page.activity.rhythmPattern.length - 1);
      while (index < playCount) {
        const interval = ans[index];
        setTimeout(() => {
          // this.state.tapAudio.pause();
          this.state.tapAudio.play();
          console.log('running loop ', index, 'with interval', interval);
          if (interval === ans[ans.length - 1]) {
            this.hideProgress();
          }
        }, interval);
        index += 1;
      }
      console.log('exiting loop');
      this.setState({ playAnswer: false });
    }

    playMetronomeClick = (number, userAttempt) => {
      this.initiateProgress();
      let i = 0;
      console.log('playing metronome every ', 1000 / parseFloat(this.state.bps), 'seconds');
      const v = setInterval(() => {
        if (i === number + 4) {
          console.log('clearing interval and checking answers');
          if (userAttempt) {
            this.getResults();
          }
          clearInterval(v);
        } else {
          this.state.metronomeAudio.pause();
          this.state.metronomeAudio.play();
          const d = new Date();
          console.log('playing metronome at ', d.getTime() - parseInt(this.state.seedTime, 10));
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

    updateTime = () => {
      const d = new Date();
      const t = d.getTime();
      const relTime = 0;
      if (this.state.firstClick) {
        this.makeCorrectnessArray();
        this.setState({ firstClick: false, seedTime: t, beginTapping: true });
        this.playMetronomeClick(this.state.page.activity.rhythmPattern.length - 1, true);
      }
    }

    handleKeyDown = () => {
      console.log('handleKeyPress called');
      const d = new Date();
      const t = d.getTime();
      if (!this.state.firstClick && !this.state.playAnswer) {
        this.state.tapAudio.pause();
        this.state.tapAudio.play();
        const relTime = t - this.state.seedTime;
        const temp = this.state.times;
        this.setState({ times: temp.concat([relTime]) });
        console.log('updatetime called with time ', relTime);
        this.setState({ time: t });
      }
    }

    makeCorrectnessArray = () => {
      console.log('GagueCorrectness called: activity: ', this.state.page.activity);
      const ansLength = this.state.page.activity.rhythmPattern.length;
      console.log('length in mka', ansLength);
      // account for counting in & lag time between click and audio playing
      let cumulativeTime = parseInt(5000 / this.state.bps, 10) + 0;
      let correctAnswers = this.calculateTime(cumulativeTime, null);
      // build array correctAnswers with the correct times!
      for (let i = 0; i < ansLength - 1; i += 1) {
        const noteVal = parseFloat(this.state.page.activity.rhythmPattern[i], 10);
        const beatVal = parseFloat(this.state.page.activity.beatType, 10);
        console.log('noteVal', this.state.page.activity.rhythmPattern[i]);
        console.log('beatVal = ', this.state.page.activity.beatType);
        const timeValue = (beatVal / noteVal) / this.state.bps;
        console.log('time value: ', timeValue);
        cumulativeTime = parseInt(parseFloat(cumulativeTime) + timeValue * 1000, 10);
        correctAnswers = this.calculateTime(cumulativeTime, correctAnswers);
      }
      console.log('CORRECT ANSWERS:', correctAnswers);
      this.setState({ correctAnswers });
      return correctAnswers;
    }

    calculateTime = (cumulativeTime, correctAnswers) => {
      console.log('cumulativeTime: ', cumulativeTime);
      const finalTime = parseInt(cumulativeTime, 10);
      let newAnswers = [];
      if (correctAnswers == null) {
        newAnswers = [finalTime];
      } else {
        newAnswers = correctAnswers.concat([finalTime]);
      }
      console.log('Finaltime: ', finalTime);
      return newAnswers;
    }

    getResults = () => {
      console.log('gaugeCorrectness called');
      const ans = this.state.correctAnswers;
      const lengthAns = ans.length;
      console.log('lengthAns: ', lengthAns);
      const { times } = this.state;
      const timesLength = times.length;
      console.log('length: ', timesLength);
      let correct = true;
      for (let i = 0; i < lengthAns; i += 1) {
        console.log('in loop ', i);
        if (i === timesLength - 1 && i !== lengthAns - 1) {
          console.log('TOO FEW ENTRIES');
          break;
        }
        console.log('ans[i]', parseInt(ans[i], 10));
        const correctAns = parseInt(ans[i], 10);
        const userAns = times[i];
        // account for lag
        if (Math.abs(correctAns - userAns) < 400) {
          console.log('Answer', i, ' is correct! -- off by ', Math.abs(correctAns - userAns), 'miliseconds');
        } else {
          console.log('Answer', i, 'incorrect : off by', Math.abs(correctAns - userAns), 'miliseconds');
          console.log('User ans: ', userAns, 'correct ans: ', correctAns);
          correct = false;
        }
      }
      if (timesLength > lengthAns) {
        console.log('too many entries');
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
    }

    initiateProgress = () => {
      console.log('initiating progress');
      const elem = document.getElementById('myBar');
      elem.style.width = '2%';
    }

    showProgress = () => {
      const maxWidth = 90;
      console.log('showing progress');
      let i = 0;
      const interval = this.calculateIntervalForProgress();
      const partition = 0;
      const incrementValue = this.calculateIncrementValue(maxWidth);
      console.log('interval: ', interval);
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
            // console.log('width incremented to width:', width);
            elem.style.width = `${width}%`;
          }
        }, interval / 10);
      }
    }

    calculateIntervalForProgress = () => {
      const beatCount = this.state.page.activity.rhythmPattern.length - 1;
      const lastTime = parseInt(this.state.correctAnswers[beatCount], 10);
      const firstTime = parseInt(this.state.correctAnswers[0], 10);
      console.log('BeatCount: ', beatCount);
      console.log('LastTime:', lastTime);
      const interval = (lastTime - firstTime) / beatCount;
      console.log('interval:', interval);
      return interval;
    }

    calculateIncrementValue = (maxWidth) => {
      const beatCount = this.state.page.activity.rhythmPattern.length - 1;
      const incrementValue = maxWidth / (beatCount);
      console.log('incrementValue');
      return incrementValue;
    }

    goToNext = () => {
      this.props.onSubmit();
    }

    createScoreArray = () => {
      const { pages } = this.props;
      const page = pages[this.state.pageNumber];
      let array = [];
      console.log('page in rhythmSensor', page);
      console.log('page.activity', page.activity);
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
          array = array.concat(['G4/8']);
        }
      });
      console.log('scoreArray:', array);
      this.setState({ scoreArray: array });
      return array;
    }

    firstRender = () => {
      const { pages } = this.props;
      const page = pages[this.state.pageNumber];
      if (page !== null && page !== undefined && page.activity_type === 'RhythmSensor') {
        const { bpm } = page.activity;
        console.log('bpm:', bpm);
        const bps = bpm / 60;
        this.setState({ firstRender: false, bps, page: this.props.pages[this.state.pageNumber] });
        this.createScoreArray();
      }
    }

    nullScoreArray = () => {
      this.setState({ scoreArray: null });
    }

    render() {
      // console.log('page in listening', page);
      // console.log('correct answer:', page.activity.correct_answer);
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
            <div>{drawStaff(this.state.scoreArray, 'rhythmScore')}</div>
            <div>
              <div>bps: {this.state.bps}</div>
              <div>Seed time: {this.state.seedTime} </div>
              <div>Clicked times: {this.state.times} </div>
            </div>
            <div id="rhythm-play-button">
              <button type="button" className="recordButton" id="playbutton" onClick={this.updateTime}><FontAwesomeIcon icon={faPlay} className="icon" id="play" alt="play-icon" /></button>
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
              <div className="rhythmInstructions">Click the space bar to the rhythm!</div>
              <div className="countDown">{this.state.countDownNumber}</div>
            </div>
          </div>
        );
      }
      if (this.state.resultsReady && this.state.correct) {
        return (
          <div className="rhythmActivity" id="successMessage">
            Congrats! Time to move on
            <button type="button" className="nextButton" id="rhythmnextbutton" onClick={this.goToNext}>
              Next
            </button>
          </div>
        );
      }
      if (!this.state.firstAttempt) {
        return (
          <div className="rhythmActivity" id="failureMessage">
            <div> Not quite, try again!</div>
            <button id="start-record" className="recordButton" type="button" onClick={this.updateTime}><FontAwesomeIcon icon={faPlay} className="icon" id="play" alt="play-icon" /></button>
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
              <button id="start-record" className="recordButton" type="button" onClick={this.updateTime}><FontAwesomeIcon icon={faPlay} className="icon" id="play" alt="play-icon" /></button>
              <button id="start-record" className="recordButton" type="button" onClick={this.playAnswer}>Play Answer</button>
            </div>
          </div>
        );
      }
    }
}

export default withRouter(connect(mapStateToProps, { getLesson })(RhythmSensor));
