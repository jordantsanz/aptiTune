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
      incorrectClicked: false,
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

    render() {
      // add page for rendering
      const { pages } = this.props;
      const page = pages[this.state.pageNumber];
      console.log('page in listening', page);
      console.log('correct answer:', page.activity.correct_answer);
      if (page === null || page === undefined) {
        return (
          <div>
            Loading...
          </div>
        );
      } else if (this.state.correctClicked) {
        return (
          <div>
            Sick bruh you got it! Time to move on
          </div>
        );
      } else {
        return (
          <div className="Listening">
            <iframe title="audio-file" src={page.activity.audioUrl} />
            <ul className="listeningAnswers">
              <li onClick={() => {
                if (parseInt(page.activity.correct_answer, 10) === 1) {
                  console.log('success');
                  this.setState({ correctClicked: true });
                } else {
                  console.log('1 clicked -- Wrong answer dumbass');
                  this.setState({ incorrectClicked: true });
                }
              }}
              >
                Answer 1
              </li>
              <li onClick={() => {
                if (parseInt(page.activity.correct_answer, 10) === 2) {
                  console.log('success!');
                  this.setState({ correctClicked: true });
                } else {
                  console.log('2 clicked -- Wrong answer dumbass');
                  this.setState({ incorrectClicked: true });
                }
              }}
              >Answer 2
              </li>
              <li onClick={() => {
                if (parseInt(page.activity.correct_answer, 10) === 3) {
                  console.log('success!');
                  this.setState({ correctClicked: true });
                } else {
                  console.log('3 clicked -- Wrong answer dumbass');
                  this.setState({ incorrectClicked: true });
                }
              }}
              >Answer 3
              </li>
              <li onClick={() => {
                if (parseInt(page.activity.correct_answer, 10) === 4) {
                  console.log('You got it!');
                  this.setState({ correctClicked: true });
                } else {
                  console.log('4 clicked -- Wrong answer dumbass');
                  this.setState({ incorrectClicked: true });
                }
              }}
              >Answer 4
              </li>
            </ul>
          </div>
        );
      }
    }
}

export default withRouter(connect(mapStateToProps, { getLesson })(Listening));
