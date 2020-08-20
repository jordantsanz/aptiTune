import React, { Component } from 'react';
import { connect } from 'react-redux';

class Lesson extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  render() {
    console.log('lesson rendering');
    return (
      <div>
        <div>LESSON PAGE</div>
        <div>{this.props.lesson.lessonid}</div>
      </div>
    );
  }
}

function mapStateToProps(reduxState) {
  return {
    lesson: reduxState.lesson,
  };
}

export default connect(mapStateToProps, null)(Lesson);
