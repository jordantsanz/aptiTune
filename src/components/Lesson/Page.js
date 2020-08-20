/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink, withRouter } from 'react-router-dom';
import { getLesson } from '../../actions/index';
import NavBar from '../NavBar';

function mapStateToProps(reduxState) {
  return {
    pages: reduxState.lesson.pages,
  };
}

class Page extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageNumber: '',
      title: '',
      description: '',
      content: '',
      exercise: '',
      activity: '',
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
          <div className="current-page">
            <NavBar />
            <div className="full-page">
              <div className="page-top">
                <div className="page-top-topthird">
                  <div className="page-top-title">{page.content.title}</div>
                  <div className="page-top-nav">
                    {/* Arrow icon from font awesome goes here pointing left */}
                    <div className="page-top-nav-line" />
                    <div className="page-top-nav-level">Level {page.pageNumber} of {page.length}</div>
                    <div className="page-top-nav-line" />
                    {/* Arrow icon from font awesome goes here pointing right */}
                  </div>
                </div>
                <div className="page-top-description">{page.content.description}</div> {/* fill with this.props.page.description */}
                <div className="page-top-content">{page.act_type1.instructions}</div>    {/* fill with this.props.page.content */}
              </div>
              {/* <div className="page-bottom">
                <div className="activity-div">{page.act_type1}</div> {/* fill with this.props.page.activity
                <div className="bottom-div">
                  <NavLink to="/:username">
                    <button className="button" id="next" type="button" onClick={this.getNextPage}>Next</button>
                  </NavLink>
                </div>
              </div> */}
            </div>
          </div>
        );
      }
    }
}

export default withRouter(connect(mapStateToProps, { getLesson })(Page));
