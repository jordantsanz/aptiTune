/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable react/style-prop-object */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink, withRouter } from 'react-router-dom';
import { getLesson } from '../../../actions/index';

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

    handleDone = () => {
      console.log('handle done called');
      if (this.state.correctClicked) {
        this.setState({ complete: true });
      } else {
        this.setState({ message: 'Wrong answer, try again!' });
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
          <div>
            Sick bruh you got it! Time to move on
            <button type="button" className="nextButton" onClick={this.goToNext}>
              Next
            </button>
          </div>
        );
      } else if (page.activity.listening_type === 'sheet_music') { // for sheet listening exercises
        return (
          <div className="Listening">
            <div className="activityInstructions">{page.activity.instructions}</div>
            <audio src={page.activity.audioUrl} type="audio/m4a" title="audio-file" controls />
            <div className="incorrectMessage">{this.state.message}</div>
            <ul className="listeningAnswers">
              <li>
                <button type="button"
                  id="choiceButton"
                  className="button"
                  style={{ background: this.state.colorA }}
                  onClick={() => {
                    this.resetColors();
                    this.setState({ colorA: '#114353' });
                    if (parseInt(page.activity.correct_answer, 10) === 1) {
                      console.log('success');
                      this.setState({ correctClicked: true });
                    } else {
                      console.log('1 clicked -- Wrong answer dumbass');
                      this.setState({ correctClicked: false });
                    }
                  }}
                >
                  {page.activity.answers[0]}
                </button>
              </li>
              <li>
                <button type="button"
                  className="button"
                  id="choiceButton"
                  style={{ background: this.state.colorB }}
                  onClick={() => {
                    this.resetColors();
                    this.setState({ colorB: '#114353' });
                    if (parseInt(page.activity.correct_answer, 10) === 2) {
                      console.log('success');
                      this.setState({ correctClicked: true });
                    } else {
                      console.log('1 clicked -- Wrong answer dumbass');
                      this.setState({ correctClicked: false });
                    }
                  }}
                >
                  {page.activity.answers[1]}
                </button>
              </li>
              <li>
                <button type="button"
                  className="button"
                  id="choiceButton"
                  style={{ background: this.state.colorC }}
                  onClick={() => {
                    this.resetColors();
                    this.setState({ colorC: '#114353' });
                    if (parseInt(page.activity.correct_answer, 10) === 3) {
                      console.log('success');
                      this.setState({ correctClicked: true });
                    } else {
                      console.log('1 clicked -- Wrong answer dumbass');
                      this.setState({ correctClicked: false });
                    }
                  }}
                >
                  {page.activity.answers[2]}
                </button>
              </li>
              <li>
                <button type="button"
                  className="button"
                  id="choiceButton"
                  style={{ background: this.state.colorD }}
                  onClick={() => {
                    this.resetColors();
                    this.setState({ colorD: '#114353' });
                    if (parseInt(page.activity.correct_answer, 10) === 4) {
                      console.log('success');
                      this.setState({ correctClicked: true });
                    } else {
                      console.log('1 clicked -- Wrong answer dumbass');
                      this.setState({ correctClicked: false });
                    }
                  }}
                >
                  {page.activity.answers[3]}
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
                  id="choiceButton"
                  style={{ background: this.state.colorA }}
                  onClick={() => {
                    this.resetColors();
                    this.setState({ colorA: '#114353' });
                    if (parseInt(page.activity.correct_answer, 10) === 1) {
                      console.log('success');
                      this.setState({ correctClicked: true });
                    } else {
                      console.log('1 clicked -- Wrong answer dumbass');
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
                  id="choiceButton"
                  style={{ background: this.state.colorB }}
                  onClick={() => {
                    this.resetColors();
                    this.setState({ colorB: '#114353' });
                    if (parseInt(page.activity.correct_answer, 10) === 2) {
                      console.log('success');
                      this.setState({ correctClicked: true });
                    } else {
                      console.log('1 clicked -- Wrong answer dumbass');
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
                  id="choiceButton"
                  style={{ background: this.state.colorC }}
                  onClick={() => {
                    this.resetColors();
                    this.setState({ colorC: '#114353' });
                    if (parseInt(page.activity.correct_answer, 10) === 3) {
                      console.log('success');
                      this.setState({ correctClicked: true });
                    } else {
                      console.log('1 clicked -- Wrong answer dumbass');
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
                  id="choiceButton"
                  style={{ background: this.state.colorD }}
                  onClick={() => {
                    this.resetColors();
                    this.setState({ colorD: '#114353' });
                    if (parseInt(page.activity.correct_answer, 10) === 4) {
                      console.log('success');
                      this.setState({ correctClicked: true });
                    } else {
                      console.log('1 clicked -- Wrong answer dumbass');
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
