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
      const v = setInterval(() => {
        if (i === number + 4) {
          console.log('clearing interval and checking answers');
          this.getResults();
          setTimeout(1000);
          clearInterval(v);
        } else {
          this.state.audio.play();
          i += 1;
          if (i < 5) {
            this.setState({ buttonColor: 'red', countDownNumber: 5 - i });
          } else {
            this.setState({ buttonColor: 'green', countDownNumber: 'GO!' });
          }
        }
      }, this.state.bps * 1000);
    }

    updateTime = () => {
      const d = new Date();
      const t = d.getTime();
      if (this.state.firstClick) {
        this.makeCorrectnessArray();
        this.setState({ firstClick: false, seedTime: t + 1000, beginTapping: true });
        this.playMetronomeClick(this.state.page.activity.rhythmPattern.length - 1);
      } else {
        const relTime = t - this.state.seedTime;
        const temp = this.state.times;
        this.setState({ times: temp.concat([relTime]) });
      }
      console.log('updatetime called with time ', t);
      this.setState({ time: t });
    }

    makeCorrectnessArray = () => {
      console.log('GagueCorrectness called: activity: ', this.state.page.activity);
      const ansLength = this.state.page.activity.rhythmPattern.length;
      console.log('length in mka', ansLength);
      let correctAnswers = [0];
      let cumulativeTime = 0;
      // build array correctAnswers with the correct times!
      for (let i = 0; i < ansLength - 1; i += 1) {
        const noteVal = parseFloat(this.state.page.activity.rhythmPattern[i], 10);
        const beatVal = parseFloat(this.state.page.activity.beatType, 10);
        // console.log('noteVal', this.state.page.activity.rhythmPattern[i]);
        // console.log('beatType = ', this.state.page.activity.beatType);
        const timeValue = (beatVal / noteVal) * this.state.bps;
        cumulativeTime = parseFloat(cumulativeTime) + timeValue;
        // console.log('timeValue', timeValue);
        correctAnswers = correctAnswers.concat([cumulativeTime * 1000]);
      }
      console.log('CORRECT ANSWERS:', correctAnswers);
      this.setState({ correctAnswers });
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
        const correctAns = parseInt(ans[i], 10) + 4000;
        const userAns = times[i];
        if (Math.abs(correctAns + 300 - userAns) < 200) {
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

    render() {
      // add page for rendering
      // console.log('Rendering with seedTime', this.state.seedTime);
      // console.log('TIMES:', this.state.times);
      const { pages } = this.props;
      const page = pages[this.state.pageNumber];
      // console.log('page in listening', page);
      // console.log('correct answer:', page.activity.correct_answer);
      if (page === null || page === undefined) {
        return (
          <div>
            Loading...
          </div>
        );
      }

      if (this.state.firstRender) {
        const { bpm } = page.activity;
        console.log('bpm:', bpm);
        const bps = bpm / 60;
        this.setState({ firstRender: false, bps, page: this.props.pages[this.state.pageNumber] });
      }
      console.log('rendering with correct', this.state.correct);
      if (this.state.beginTapping && !this.state.resultsReady) {
        return (
          <button type="button" onClick={this.updateTime} style={{ color: this.state.buttonColor }}>{this.state.countDownNumber}</button>
        );
      }
      if (this.state.resultsReady && this.state.correct) {
        return (
          <div>
            Congrats! You got it right!
          </div>
        );
      }
      if (!this.state.firstAttempt) {
        return (
          <div>
            <div> Not quite, try again!</div>
            <button type="button" onClick={this.updateTime}>Play</button>
          </div>
        );
      } else {
        return (
          <div>
            <div>
              <div>bpm: {this.state.bps}</div>
              <div>Seed time: {this.state.seedTime} </div>
              <div>Clicked times: {this.state.times} </div>
            </div>
            <button type="button" onClick={this.updateTime}>Play</button>
          </div>
        );
      }
    }
}

export default withRouter(connect(mapStateToProps, { getLesson })(RhythmSensor));
