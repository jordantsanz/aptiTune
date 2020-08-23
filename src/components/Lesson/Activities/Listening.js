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
      nextPage: '',
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
      if (page === null || page === undefined) {
        return (
          <div>
            Loading...
          </div>
        );
      } else {
        return (
          <div className="Listening">
            <iframe title="audio-file" src={page.activity.audioUrl} />
            <div>
              Four answer buttons are gonna go below!
            </div>
          </div>
        );
      }
    }
}

export default withRouter(connect(mapStateToProps, { getLesson })(Listening));
