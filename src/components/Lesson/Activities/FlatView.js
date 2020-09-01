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
      console.log('pageNum in flatview: ', pageNum);
      this.setState({ pageNumber: pageNum });
      const { history } = this.props;
      this.props.getLesson(id, history, pageNum + 1, true);
    }

    componentDidUpdate = () => {
      const { pages } = this.props;
      const page = pages[this.state.pageNumber];
      console.log('page in flatView', page);
      if (this.state.firstTime && page !== null && page !== undefined) {
        this.initializeStateArrays(page);
        this.prepStaffNotes();
      }
      if (this.state.reload && page !== null && page !== undefined) {
        console.log('updating for new page');
        const id = localStorage.getItem('lesson');
        const pageNum = parseInt(localStorage.getItem('next'), 10);
        console.log('pageNum in flatview round 2: ', pageNum);
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
          if (n === 'F' || n === 'G' || n === 'A' || n === 'B') {
            if (page.activity.cleftype === 'treble') {
              const staffNote = `${n}4/8`;
              staffNotes = staffNotes.concat([staffNote]);
            } else {
              const staffNote = `${n}2/8`;
              staffNotes = staffNotes.concat([staffNote]);
            }
          } else if (page.activity.cleftype === 'treble') {
            const staffNote = `${n}5/8`;
            staffNotes = staffNotes.concat([staffNote]);
          } else {
            const staffNote = `${n}3/8`;
            staffNotes = staffNotes.concat([staffNote]);
          }
        });
        this.setState({ staffNotes, renderStaff: true });
        console.log('staff prepped: ', staffNotes);
      }
    }

    handleDone = () => {
      let allCorrect = true;
      // access page
      console.log('inputAnswers: ', this.state.inputAnswers);
      const { pages } = this.props;
      const page = pages[this.state.pageNumber];

      // parse number from key to check for correctness
      for (let i = 0; i < page.activity.answer_count; i += 1) {
        console.log(this.state.correctnessArray);
        const parsedArray = [];
        for (let index = 0; index < this.state.correctnessArray.length; index++) {
          if (this.state.correctnessArray[index].length > 1) {
            if (!isNaN(this.state.correctnessArray[index][1])) { // if second thing in string is a number
              parsedArray[index] = this.state.correctnessArray[index][0];
            } else {
              const string = this.state.correctnessArray[index][0] + this.state.correctnessArray[index][1];
              parsedArray[index] = string;
            }
          }
        }
        let arr = '';
        if (parsedArray.length > 0) {
          arr = parsedArray; // put parsedArray here instead of correctness Array
        } else {
          arr = this.state.correctnessArray;
        }
        const answer = this.state.inputAnswers[i].trim().toLowerCase();
        console.log('answer', answer);
        if (answer === page.activity.correct_answers[i]) {
          console.log(i, ' is correct');
          arr[i] = '2px solid green';
        } else {
          allCorrect = false;
          arr[i] = '2px solid red';
          console.log(i, ' is incorrect: ', this.state.inputAnswers[i], '!=', page.activity.correct_answers[i]);
          const tempInputAnswers = this.state.inputAnswers;
          tempInputAnswers[i] = ' ';
          this.setState({ inputAnswers: tempInputAnswers });
        }
        this.setState({ correctnessArray: arr });
      }

      this.setState({ doneClicked: true });
      console.log('CorrectnessArray: ', this.state.correctnessArray);

      if (allCorrect) {
        this.setState({ complete: true });
      } else if (this.props.lessonType === 'quiz') {
        console.log('Incorrect in quiz');
        this.props.incrementErrorCount();
      } else {
        console.log('incorrect with type', this.props.lessonType);
      }
    }

    initializeStateArrays = (page) => {
      let arr1 = [];
      let arr2 = [];
      let arr3 = [];
      console.log('page in initializestatearrays', page);
      for (let i = 0; i < page.activity.answer_count; i += 1) {
        const tempArr1 = arr1.concat([i]);
        arr1 = tempArr1;
        const tempArr2 = arr2.concat([0]);
        arr2 = tempArr2;
        const tempArr3 = arr3.concat([' ']);
        arr3 = tempArr3;
      }
      console.log('arr: ', arr1);
      this.setState({
        indexArray: arr1, correctnessArray: arr2, firstTime: false, inputAnswers: arr3,
      });
    }

    goToNext = () => {
      this.props.onSubmit();
      this.setState({
        pageNumber: 0,
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
      });
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
      console.log(answerNotes);

      for (let i = 0; i < answerNotes.length; i += 1) {
        const diff = 0.5 * i;
        const note = answerNotes[i].toUpperCase();
        synth.triggerAttackRelease(note, '8n', now + diff);
      }
    }

    render() {
      // add page for rendering
      console.log('pages:', this.props.pages);
      const { pages } = this.props;
      const page = pages[this.state.pageNumber];
      console.log('page in flatView', page);
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
            <div className="flatAnswerBoxes">{
            this.state.indexArray.map((num) => {
              // console.log('a:', a);
              return (
                <div key={num}>
                  <input className="flatAnswerBox"
                    style={{ border: this.state.correctnessArray[num] }}
                    value={this.state.inputAnswers[num]}
                    onChange={(event) => {
                      const arr = this.state.inputAnswers;
                      arr[num] = event.target.value;
                      console.log('num :', num, 'changed to', event.target.value);
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
            <div className="flatAnswerBoxes">{
              this.state.indexArray.map((num) => {
                return (
                  <div key={num}>
                    <input className="flatAnswerBox"
                      value={this.state.inputAnswers[num]}
                      onChange={(event) => {
                        const arr = this.state.inputAnswers;
                        arr[num] = event.target.value;
                        console.log('num :', num, 'changed to', event.target.value);
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
