import React, { Component } from 'react';
import { connect } from 'react-redux';
import NavBar from '../NavBar';
import '../../style.scss';
import { getLessons, getLesson } from '../../actions';

class Lesson extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentDidMount = () => {
    console.log('Component mounting in Lesson');
  }

  render() {
    console.log('lesson rendering');
    return (
      <div>
        <NavBar className="nav" />
        <div className="lessonHeader">
          <div>LESSON PAGE</div>
          <div>{this.props.lesson.lessonid}</div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(reduxState) {
  return {
    lesson: reduxState.lesson,
  };
}

export default connect(mapStateToProps, { getLesson, getLessons })(Lesson);
