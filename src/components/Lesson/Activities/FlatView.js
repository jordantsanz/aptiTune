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
      nextPage: '',
    };
  }

    componentDidMount = () => {
      const id = localStorage.getItem('lesson');
      const pageNum = localStorage.getItem('next');
      this.setState({ pageNumber: pageNum });
      this.setState({ nextPage: pageNum + 1 });
      const { history } = this.props;
      this.props.getLesson(id, history, pageNum + 1);
    }

    render() {
      // add page for rendering
      console.log('pages:', this.props.pages);
      const { pages } = this.props;
      const page = pages[0];
      console.log('pages[0]', pages[0]);
      console.log('page', page);
      if (page === null || page === undefined) {
        return (
          <div>
            Loading...
          </div>
        );
      } else {
        return (
          <div className="type1">
            <iframe title="flat" src="https://flat.io/embed/5f3c2ef49b7a0675af6ac0e7?appId=5f31d0690692f8689b6682fb" height="200" width="100%" frameBorder="0" allowFullScreen allow="midi" />
          </div>
        );
      }
    }
}

export default withRouter(connect(mapStateToProps, { getLesson })(FlatView));
