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
    };
  }

    componentDidMount = () => {
      const id = localStorage.getItem('lesson');
      const pageNum = parseInt(localStorage.getItem('next'), 10);
      console.log('pageNum in flatview: ', pageNum);
      this.setState({ pageNumber: pageNum });
      const { history } = this.props;
      this.props.getLesson(id, history, pageNum + 1);
    }

    render() {
      // add page for rendering
      console.log('pages:', this.props.pages);
      const { pages } = this.props;
      const page = pages[this.state.pageNumber];
      console.log('page in flatView', page);
      if (page === null || page === undefined) {
        return (
          <div>
            Loading...
          </div>
        );
      } else {
        return (
          <div className="type1">
            <iframe title="flat" src={page.activity.flatUrl} height="200" width="60%" frameBorder="0" allowFullScreen allow="midi" />
          </div>
        );
      }
    }
}

export default withRouter(connect(mapStateToProps, { getLesson })(FlatView));
