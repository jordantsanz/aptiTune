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

class Staff extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scoreArray: [],
      firstRender: true,
    };
  }

  setFirstRenderToFalse = () => {
    this.setState({ firstRender: false });
  }

  render() {
    console.log('scoreArrayIn listeningAnswer', this.state.scoreArray);
    console.log('props.id in listeningAnswer: ', this.props.id);
    if (this.props.answer.length === 0) {
      console.log('score array empty');
      return (<div />);
    } else if (this.state.firstRender) {
      this.setFirstRenderToFalse();
      console.log('nulling score array');
      this.props.nullScoreArray();
      return (
        <div>
          {drawStaff(this.props.cleftype, this.props.answer, this.props.id)}
        </div>
      );
    } else {
      return (<div />);
    }
  }
}

export default Staff;
