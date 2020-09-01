/* eslint-disable no-restricted-globals */
/* eslint-disable no-plusplus */
/* eslint-disable prefer-destructuring */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlay,
} from '@fortawesome/free-solid-svg-icons';
import { getLesson } from '../../../actions/index';
import Staff from './Staff';

const Tone = require('tone');

function mapStateToProps(reduxState) {
  return {
    pages: reduxState.lesson.pages,
  };
}

class FlatView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageNumber: 0,
      staffNotes: [],
      inputAnswers: [],
      indexArray: [],
      correctnessArray: [],
      firstTime: true,
      correct: 'green',
      incorrect: 'red',
      doneClicked: false,
      complete: false,
      reload: false,
      renderStaff: false,
      firstStaffRender: true,
    };
  }

    componentDidMount = () => {
      const id = localStorage.getItem('lesson');
      const pageNum = parseInt(localStorage.getItem('next'), 10);
      this.setState({ pageNumber: pageNum });
      const { history } = this.props;
      this.props.getLesson(id, history, pageNum + 1, true);
    }

    componentDidUpdate = () => {
      const { pages } = this.props;
      const page = pages[this.state.pageNumber];
      if (this.state.firstTime && page !== null && page !== undefined) {
        this.initializeStateArrays(page);
        this.prepStaffNotes();
      }
      if (this.state.reload && page !== null && page !== undefined) {
        const id = localStorage.getItem('lesson');
        const pageNum = parseInt(localStorage.getItem('next'), 10);
        const page1 = this.props.pages[pageNum];
        this.initializeStateArrays(page1);
        // eslint-disable-next-line react/no-did-update-set-state
        this.setState({ pageNumber: pageNum, reload: false });
        const { history } = this.props;
        this.props.getLesson(id, history, pageNum, true);
      }
    }

    prepStaffNotes = () => {
      let staffNotes = [];
      const { pages } = this.props;
      const page = pages[this.state.pageNumber];
      if (page !== undefined && page !== null) {
        // eslint-disable-next-line array-callback-return
        page.activity.correct_answers.map((note) => {
          const n = note.toUpperCase();
          const staffNote = `${n}/8`;
          staffNotes = staffNotes.concat([staffNote]);
        });
        this.setState({ staffNotes, renderStaff: true });
      }
      console.log('page in prepStaffNotes', page);
    }

    handleDone = () => {
      let allCorrect = true;
      // access page
      const { pages } = this.props;
      const page = pages[this.state.pageNumber];

      // parse number from key to check for correctness
      for (let i = 0; i < page.activity.answer_count; i += 1) {
        const parsedArray = [];
        for (let index = 0; index < page.activity.correct_answers.length; index++) {
          if (page.activity.correct_answers.length > 1) {
            if (!isNaN(page.activity.correct_answers[index][1])) { // if second thing in string is a number
              parsedArray[index] = page.activity.correct_answers[index][0];
            } else {
              const string = page.activity.correct_answers[index][0] + page.activity.correct_answers[index][1];
              parsedArray[index] = string;
            }
          }
        }

        const arr = this.state.correctnessArray;
        const answer = this.state.inputAnswers[i].trim().toUpperCase();
        if (answer === parsedArray[i]) {
          arr[i] = '2px solid green';
        } else {
          allCorrect = false;
          arr[i] = '2px solid red';
          const tempInputAnswers = this.state.inputAnswers;
          tempInputAnswers[i] = ' ';
          this.setState({ inputAnswers: tempInputAnswers });
        }
        this.setState({ correctnessArray: arr });
      }

      this.setState({ doneClicked: true });

      if (allCorrect) {
        this.setState({ complete: true });
      } else if (this.props.lessonType === 'quiz') {
        this.props.incrementErrorCount();
      }
    }

    initializeStateArrays = (page) => {
      let arr1 = [];
      let arr2 = [];
      let arr3 = [];
      for (let i = 0; i < page.activity.answer_count; i += 1) {
        const tempArr1 = arr1.concat([i]);
        arr1 = tempArr1;
        const tempArr2 = arr2.concat([0]);
        arr2 = tempArr2;
        const tempArr3 = arr3.concat([' ']);
        arr3 = tempArr3;
      }
      this.setState({
        indexArray: arr1, correctnessArray: arr2, firstTime: false, inputAnswers: arr3,
      });
    }

    goToNext = () => {
      this.props.onSubmit();
      this.setState((prevState) => ({
        pageNumber: prevState.pageNumber + 1,
        inputAnswers: [],
        indexArray: [],
        correctnessArray: [],
        firstTime: true,
        correct: 'green',
        incorrect: 'red',
        doneClicked: false,
        complete: false,
        reload: true,
        staffNotes: [],
      }));
      const staff = document.getElementById('flatScore');
      while (staff.hasChildNodes()) {
        staff.removeChild(staff.lastChild);
      }
    }

    nullScoreArray = () => {
      this.setState({ staffNotes: [], firstStaffRender: false });
    }

    playNotes = async () => {
      const { pages } = this.props;
      const page = pages[this.state.pageNumber];
      await Tone.start();
      const synth = new Tone.Synth().toDestination();
      const now = Tone.now();
      const answerNotes = page.activity.correct_answers;

      for (let i = 0; i < answerNotes.length; i += 1) {
        const diff = 0.5 * i;
        const note = answerNotes[i].toUpperCase();
        synth.triggerAttackRelease(note, '8n', now + diff);
      }
    }

    render() {
      // add page for rendering
      const { pages } = this.props;
      const page = pages[this.state.pageNumber];
      // initialize answerCount array
      if (page === null || page === undefined) {
        return (
          <div>
            Loading...
          </div>
        );
      }
      if (this.state.complete) {
        return (
          <div className="FlatView">
            <div className="finishedMessage"> Great Job, you finished! <br /> Press next to move on!</div>
            <button type="button" className="nextButton" onClick={this.goToNext}>
              Next
            </button>
          </div>
        );
      }
      if (this.state.doneClicked) {
        return (
          <div className="FlatView">
            <div className="activityInstructions">{page.activity.instructions}</div>
            <div id="flatStaff">
              <Staff cleftype={page.activity.cleftype} answer={this.state.staffNotes} id="flatStaff" nullScoreArray={this.nullScoreArray} />
            </div>
            <div id="placeholder" />
            <div className="flatAnswerBoxes">{
            this.state.indexArray.map((num) => {
              return (
                <div key={num}>
                  <input className="flatAnswerBox"
                    style={{ border: this.state.correctnessArray[num] }}
                    value={this.state.inputAnswers[num]}
                    onChange={(event) => {
                      const arr = this.state.inputAnswers;
                      arr[num] = event.target.value;
                      this.setState({ inputAnswers: arr });
                    }}
                  />
                </div>
              );
            })
            }
            </div>
            <button type="button" className="doneButton" onClick={this.handleDone}>
              Done
            </button>
          </div>
        );
      } else {
        return (
          <div className="FlatView">
            <div className="activityInstructions">{page.activity.instructions}</div>
            <div className="recordButton">
              <button type="button" className="button" id="playAudio" onClick={this.playNotes}><FontAwesomeIcon icon={faPlay} className="icon" id="play" alt="play-icon" /> &nbsp; Play Audio</button>
            </div>
            <div id="flatStaff">
              <Staff cleftype={page.activity.cleftype} answer={this.state.staffNotes} id="flatStaff" nullScoreArray={this.nullScoreArray} />
            </div>
            <div id="placeholder" />
            <div className="flatAnswerBoxes">{
              this.state.indexArray.map((num) => {
                return (
                  <div key={num}>
                    <input className="flatAnswerBox"
                      value={this.state.inputAnswers[num]}
                      onChange={(event) => {
                        const arr = this.state.inputAnswers;
                        arr[num] = event.target.value;
                        this.setState({ inputAnswers: arr });
                      }}
                      maxLength="3"
                    />
                  </div>
                );
              })
              }
            </div>
            <div className="flat-button-holder">
              <button type="button" className="doneButton" onClick={this.handleDone}>
                Done
              </button>
            </div>
          </div>
        );
      }
    }
}

export default withRouter(connect(mapStateToProps, { getLesson })(FlatView));
