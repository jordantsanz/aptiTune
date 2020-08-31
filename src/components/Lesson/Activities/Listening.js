/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable react/style-prop-object */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink, withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlay,
} from '@fortawesome/free-solid-svg-icons';
import { getLesson } from '../../../actions/index';
import ListeningAnswer from './ListeningAnswer';

const Tone = require('tone');

function mapStateToProps(reduxState) {
  return {
    pages: reduxState.lesson.pages,
  };
}

class Listening extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageNumber: 0,
      correctClicked: false,
      complete: false,
      colorA: '#FDD46A',
      colorB: '#FDD46A',
      colorC: '#FDD46A',
      colorD: '#FDD46A',
      message: '',
      reload: false,
    };
  }

    componentDidMount = () => {
      const id = localStorage.getItem('lesson');
      const pageNum = localStorage.getItem('next');
      this.setState({ pageNumber: pageNum });
      const { history } = this.props;
      this.props.getLesson(id, history, false);
      console.log('Component mounted in Listening');
    }

    componentDidUpdate = () => {
      if (this.state.reload) {
        const id = localStorage.getItem('lesson');
        const pageNum = localStorage.getItem('next');
        // eslint-disable-next-line react/no-did-update-set-state
        this.setState({ pageNumber: pageNum, reload: false });
        const { history } = this.props;
        this.props.getLesson(id, history, false);
        console.log('Component mounted in Listening');
      }
    }

    handleDone = () => {
      console.log('handle done called');
      if (this.state.correctClicked) {
        this.setState({ complete: true });
      } else {
        this.setState({ message: 'Wrong answer, try again!' });
        if (this.props.lessonType === 'quiz') {
          this.props.incrementErrorCount();
        }
      }
    }

    resetColors = () => {
      this.setState({
        colorA: '#FDD46A',
        colorB: '#FDD46A',
        colorC: '#FDD46A',
        colorD: '#FDD46A',
      });
    }

    goToNext = () => {
      this.props.onSubmit();
      this.setState({
        pageNumber: 0,
        correctClicked: false,
        complete: false,
        colorA: '#FDD46A',
        colorB: '#FDD46A',
        colorC: '#FDD46A',
        colorD: '#FDD46A',
        message: '',
        reload: true,
      });
    }

    playNotes = async () => {
      const { pages } = this.props;
      const page = pages[this.state.pageNumber];
      await Tone.start();
      const synth = new Tone.Synth().toDestination();
      const now = Tone.now();
      const correctIdx = parseInt(page.activity.correct_answer, 10) - 1;
      const answerNotes = page.activity.answers[correctIdx];

      for (let i = 0; i < answerNotes.length; i += 1) {
        const diff = 0.5 * i;
        const note = answerNotes[i];
        synth.triggerAttackRelease(note, '4n', now + diff);
      }
    }

    render() {
      // add page for rendering
      const { pages } = this.props;
      const page = pages[this.state.pageNumber];
      console.log('page in listening', page);
      console.log('correct answer:', page.activity.correct_answer);
      //  <iframe title="audio-file" className="audio-file" src={page.activity.audioUrl} />;
      if (page === null || page === undefined) {
        return (
          <div>
            Loading...
          </div>
        );
      } else if (this.state.complete) {
        return (
          <div className="finishedMessage">
            Great listening! Keep going!
            <button type="button" className="nextButton" id="nextButton" onClick={this.goToNext}>
              Next
            </button>
          </div>
        );
      } else if (page.activity.listening_type === 'sheet_music') { // for sheet listening exercises
        return (
          <div className="Listening">
            <div className="activityInstructions">{page.activity.instructions}</div>
            <div className="recordButton">
              <button type="button" className="button" id="playAudio" onClick={this.playNotes}><FontAwesomeIcon icon={faPlay} className="icon" id="play" alt="play-icon" /> &nbsp; Play Audio</button>
            </div>
            {/* <div id="audio">
              <audio src={page.activity.audioUrl} type="audio/m4a" title="audio-file" controls />
            </div> */}
            <div className="incorrectMessage">{this.state.message}</div>
            <ul className="listeningAnswers">
              <li>
                <button type="button"
                  id="choiceButton1"
                  className="staff-button"
                  style={{ background: this.state.colorA }}
                  onClick={() => {
                    this.resetColors();
                    this.setState({ colorA: 'rgba(241, 128, 128, .4)' });
                    if (parseInt(page.activity.correct_answer, 10) === 1) {
                      console.log('success');
                      this.setState({ correctClicked: true });
                    } else {
                      console.log('1 clicked -- Wrong answer');
                      this.setState({ correctClicked: false });
                    }
                  }}
                >
                  <ListeningAnswer cleftype={page.activity.cleftype} answer={page.activity.answers[0]} id="choiceButton1" />
                </button>
              </li>
              <li>
                <button type="button"
                  className="staff-button"
                  id="choiceButton2"
                  style={{ background: this.state.colorB }}
                  onClick={() => {
                    this.resetColors();
                    this.setState({ colorB: 'rgba(241, 128, 128, .4)' });
                    if (parseInt(page.activity.correct_answer, 10) === 2) {
                      console.log('success');
                      this.setState({ correctClicked: true });
                    } else {
                      console.log('1 clicked -- Wrong answer');
                      this.setState({ correctClicked: false });
                    }
                  }}
                >
                  <ListeningAnswer cleftype={page.activity.cleftype} answer={page.activity.answers[1]} id="choiceButton2" />
                </button>
              </li>
              <li>
                <button type="button"
                  className="staff-button"
                  id="choiceButton3"
                  style={{ background: this.state.colorC }}
                  onClick={() => {
                    this.resetColors();
                    this.setState({ colorC: 'rgba(241, 128, 128, .4)' });
                    if (parseInt(page.activity.correct_answer, 10) === 3) {
                      console.log('success');
                      this.setState({ correctClicked: true });
                    } else {
                      console.log('1 clicked -- Wrong answer');
                      this.setState({ correctClicked: false });
                    }
                  }}
                >
                  <ListeningAnswer cleftype={page.activity.cleftype} answer={page.activity.answers[2]} id="choiceButton3" />
                </button>
              </li>
              <li>
                <button type="button"
                  className="staff-button"
                  id="choiceButton4"
                  style={{ background: this.state.colorD }}
                  onClick={() => {
                    this.resetColors();
                    this.setState({ colorD: 'rgba(241, 128, 128, .4)' });
                    if (parseInt(page.activity.correct_answer, 10) === 4) {
                      console.log('success');
                      this.setState({ correctClicked: true });
                    } else {
                      console.log('1 clicked -- Wrong answer');
                      this.setState({ correctClicked: false });
                    }
                  }}
                >
                  <ListeningAnswer cleftype={page.activity.cleftype} answer={page.activity.answers[3]} id="choiceButton4" />
                </button>
              </li>
            </ul>
            <button type="button" className="doneButton" onClick={this.handleDone}>
              Done
            </button>
          </div>
        );
      } else {
        return ( // for single interval listening
          <div className="Listening">
            <audio src={page.activity.audioUrl} type="audio/m4a" title="audio-file" controls />
            <ul className="listeningAnswers">
              <li>
                <button type="button"
                  className="button"
                  id="choiceButton1"
                  style={{ background: this.state.colorA }}
                  onClick={() => {
                    this.resetColors();
                    this.setState({ colorA: 'rgba(241, 128, 128, .4)' });
                    if (parseInt(page.activity.correct_answer, 10) === 1) {
                      console.log('success');
                      this.setState({ correctClicked: true });
                    } else {
                      console.log('1 clicked -- Wrong answer');
                      this.setState({ correctClicked: false });
                    }
                  }}
                >
                  Answer 1
                </button>
              </li>
              <li>
                <button type="button"
                  className="button"
                  id="choiceButton2"
                  style={{ background: this.state.colorB }}
                  onClick={() => {
                    this.resetColors();
                    this.setState({ colorB: 'rgba(241, 128, 128, .4)' });
                    if (parseInt(page.activity.correct_answer, 10) === 2) {
                      console.log('success');
                      this.setState({ correctClicked: true });
                    } else {
                      console.log('1 clicked -- Wrong answer');
                      this.setState({ correctClicked: false });
                    }
                  }}
                >
                  Answer 2
                </button>
              </li>
              <li>
                <button type="button"
                  className="button"
                  id="choiceButton3"
                  style={{ background: this.state.colorC }}
                  onClick={() => {
                    this.resetColors();
                    this.setState({ colorC: 'rgba(241, 128, 128, .4)' });
                    if (parseInt(page.activity.correct_answer, 10) === 3) {
                      console.log('success');
                      this.setState({ correctClicked: true });
                    } else {
                      console.log('1 clicked -- Wrong answer');
                      this.setState({ correctClicked: false });
                    }
                  }}
                >
                  Answer 3
                </button>
              </li>
              <li>
                <button type="button"
                  className="button"
                  id="choiceButton4"
                  style={{ background: this.state.colorD }}
                  onClick={() => {
                    this.resetColors();
                    this.setState({ colorD: 'rgba(241, 128, 128, .4)' });
                    if (parseInt(page.activity.correct_answer, 10) === 4) {
                      console.log('success');
                      this.setState({ correctClicked: true });
                    } else {
                      console.log('1 clicked -- Wrong answer');
                      this.setState({ correctClicked: false });
                    }
                  }}
                >
                  Answer 4
                </button>
              </li>
            </ul>
            <button type="button" className="button" id="doneButton" onClick={this.handleDone}>
              Done
            </button>
          </div>
        );
      }
    }
}

export default withRouter(connect(mapStateToProps, { getLesson })(Listening));
