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
    console.log('lessons in lessonlist', this.props.lesson.lessons);
    if (this.props.lesson.essons === null || this.props.lesson.lessons === undefined) {
      return (
        <div>Loading...</div>
      );
    }
    return (
      <div>{this.props.lesson.lessons.map((l) => {
        return (
          <div key={l.id}>
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
    lesson: reduxState.lesson,
  };
}
// export default connect(mapStateToProps, null)(LessonList);
export default connect(mapStateToProps, { getLessons })(LessonList);
