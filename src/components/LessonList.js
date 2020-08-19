/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import { getLessons } from '../actions';

class LessonList extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentDidMount = () => {
    this.props.getLessons();
  }

  render() {
    console.log('lessons in lessonlist', this.props.lessons);
    if (this.props.lesson === null || this.props.lesson === undefined) {
      return (
        <div>Loading...</div>
      );
    }
    return (
      <div>{this.props.lessons.map((l) => {
        return (
          <div>
            {l.lessonid}
          </div>
        );
      })}
      </div>
    );
  }
}

function mapStateToProps(reduxState) {
  return {
    lessons: reduxState.lessons,
  };
}

export default connect(mapStateToProps, { getLessons })(LessonList);
