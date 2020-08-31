/* eslint-disable react/no-access-state-in-setstate */
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

class FlatView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageNumber: 0,
      inputAnswers: [],
      indexArray: [],
      correctnessArray: [],
      firstTime: true,
      correct: 'green',
      incorrect: 'red',
      doneClicked: false,
      complete: false,
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

    handleDone = () => {
      let allCorrect = true;
      // access page
      console.log('inputAnswers: ', this.state.inputAnswers);
      const { pages } = this.props;
      const page = pages[this.state.pageNumber];

      for (let i = 0; i < page.activity.answer_count; i += 1) {
        const arr = this.state.correctnessArray;
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
      // initialize answer count array
      if (this.state.firstTime) {
        this.initializeStateArrays(page);
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
            <iframe title="flat" className="flatApi" src={page.activity.flatUrl} frameBorder="0" allowFullScreen allow="midi">
              <div className="error">If you&apos;re seeing this, turn off your ad-blocker!</div>
            </iframe>
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
            <iframe title="flat" className="flatApi" src={page.activity.flatUrl} frameBorder="0" allowFullScreen allow="midi" />
            <div className="flatAnswerBoxes">{
              this.state.indexArray.map((num) => {
                // console.log('a:', a);
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
