/* eslint-disable array-callback-return */
/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable react/style-prop-object */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import drawStaff from '../../DrawStaff';

function mapStateToProps(reduxState) {
  return {
    pages: reduxState.lesson.pages,
  };
}

class ListeningAnswer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scoreArray: [],
      firstRender: true,
    };
    this.createScoreArray();
  }

  createScoreArray = () => {
    let array = [];
    this.props.answer.map((note) => {
      const val = `${note}/q`;
      console.log('note: ', note, 'val', val);
      if (array === []) {
        array = [val];
      } else {
        array = array.concat([val]);
      }
    });
    console.log('scoreArray:', array);
    this.setState({ scoreArray: array });
    return array;
  }

  setFirstRenderToFalse = () => {
    this.setState({ firstRender: false });
  }

  render() {
    console.log('scoreArrayIn listeningAnswer', this.state.scoreArray);
    console.log('props.id in listeningAnswer: ', this.props.id);
    if (this.state.scoreArray.length === 0) {
      this.createScoreArray();
      console.log('score array empty');
      return (<div />);
    } else if (this.state.firstRender) {
      this.setFirstRenderToFalse();
      return (
        <div>
          {drawStaff(this.state.scoreArray, this.props.id)}
        </div>
      );
    } else {
      return (<div />);
    }
  }
}

export default ListeningAnswer;