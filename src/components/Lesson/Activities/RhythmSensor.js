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
      audio: new Audio('https://aptitune.s3.amazonaws.com/click2.wav'),
      buttonColor: 'red',
      countDownNumber: 'Ready?',
      beginTapping: false,
      resultsReady: false,
      correct: false,
      firstAttempt: true,
      scoreArray: [],
    };
  }

    componentDidMount = () => {
      const id = localStorage.getItem('lesson');
      const pageNum = localStorage.getItem('next');
      this.setState({ pageNumber: pageNum });
      const { history } = this.props;
      this.props.getLesson(id, history, pageNum + 1);
      console.log('Component mounted in Listening');
    }

    playMetronomeClick = (number) => {
      let i = 0;
      console.log('playing metronome every ', 1000 / parseFloat(this.state.bps), 'seconds');
      const v = setInterval(() => {
        if (i === number + 4) {
          console.log('clearing interval and checking answers');
          this.getResults();
          clearInterval(v);
        } else {
          this.state.audio.play();
          const d = new Date();
          console.log('playing metronome at ', d.getTime() - parseInt(this.state.seedTime, 10));
          i += 1;
          if (i < 5) {
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
      let relTime = 0;
      if (this.state.firstClick) {
        this.makeCorrectnessArray();
        this.setState({ firstClick: false, seedTime: t, beginTapping: true });
        this.playMetronomeClick(this.state.page.activity.rhythmPattern.length - 1);
      } else {
        relTime = t - this.state.seedTime;
        const temp = this.state.times;
        this.setState({ times: temp.concat([relTime]) });
      }
      console.log('updatetime called with time ', relTime);
      this.setState({ time: t });
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
          console.log('Answer', i, ' is correct!');
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
      }
    }

    showProgress = () => {
      const maxWidth = 700;
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
            width += incrementValue;
            console.log('width incremented to width:', width);
            elem.style.width = `${width}%`;
          }
        }, interval);
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
      if (page !== null && page !== undefined) {
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
      if (this.state.firstRender) {
        this.firstRender();
      }
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
            <div>{this.state.page.activity.rhythmPattern.map((n) => {
              return (
                <div id={n}>1/{n} note</div>
              );
            })}
            </div>
            <button type="button" onClick={this.updateTime}>Play</button>
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
              <div>{this.state.page.activity.rhythmPattern.map((n) => {
                return (
                  <div id={n}>1/{n} note</div>
                );
              })}
              </div>
              <button type="button" onClick={this.updateTime} style={{ color: this.state.buttonColor }}>{this.state.countDownNumber}</button>
            </div>
          </div>
        );
      }
      if (this.state.resultsReady && this.state.correct) {
        return (
          <div className="rhythmActivity">
            Congrats! Time to move on
            <button type="button" className="nextButton" onClick={this.goToNext}>
              Next
            </button>
          </div>
        );
      }
      if (!this.state.firstAttempt) {
        return (
          <div className="rhythmActivity">
            <div> Not quite, try again!</div>
            <div>{this.state.page.activity.rhythmPattern.map((n) => {
              return (
                <div id={n}>1/{n} note</div>
              );
            })}
            </div>
            <button type="button" onClick={this.updateTime}>Play</button>
          </div>
        );
      } else {
        // console.log('rendering with score: ', score);
        return (
          <div className="rhythmActivity">
            <div>
              <div>bps: {this.state.bps}</div>
              <div>Seed time: {this.state.seedTime} </div>
              <div>Clicked times: {this.state.times} </div>
            </div>
            <div>{this.state.page.activity.rhythmPattern.map((n) => {
              return (
                <div id={n}>1/{n} note</div>
              );
            })}
            </div>
            <button type="button" onClick={this.updateTime}>Play</button>
          </div>
        );
      }
    }
}

export default withRouter(connect(mapStateToProps, { getLesson })(RhythmSensor));
