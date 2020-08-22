/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink, withRouter } from 'react-router-dom';
import { getLesson } from '../../actions/index';
import NavBar from '../NavBar';
import FlatView from './Activities/FlatView';

function mapStateToProps(reduxState) {
  return {
    pages: reduxState.lesson.pages,
  };
}

class Page extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageNumber: 0,
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
      const pageNum = parseInt(localStorage.getItem('next'), 10);
      console.log('Next from localStorage', pageNum);
      this.setState({ pageNumber: pageNum });
      this.setState({ nextPage: pageNum + 1 });
      const { history } = this.props;
      this.props.getLesson(id, history, pageNum);
    }

    goToNext = () => {
      console.log('gotonext clicked');
      // console.log('this.props.pages.length', this.props.pages.length);
      if (this.props.pages.length > this.state.pageNumber + 1) {
        console.log('got inside');
        const local = parseInt(this.state.nextPage, 10) + 1;
        localStorage.setItem('setting next in gotoNext next', local.toString());
        this.setState((prevState) => ({ pageNumber: prevState.pageNumber + 1 }));
        this.setState((prevState) => ({ nextPage: prevState.nextPage + 1 }));
      } else {
        const { history } = this.props;
        history.push('/home');
        // for now, redirect to home....
      }
    }

    render() {
      // add page for rendering
      // console.log('pages:', this.props.pages);
      const { pages } = this.props;
      const page = pages[this.state.pageNumber];
      // console.log('pageNumber:', this.state.pageNumber);
      // console.log('pages[0]', pages[this.state.pageNumber]);
      // console.log('page', page);
      if (page === null || page === undefined) {
        return (
          <div>
            Loading...
          </div>
        );
      } else if (page.activity_type === 'FlatView') {
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
                    <div className="page-top-nav-level">Level {this.state.pageNumber + 1} of {this.props.pages.length}</div>
                    <div className="page-top-nav-line" />
                    {/* Arrow icon from font awesome goes here pointing right */}
                  </div>
                </div>
                <div className="page-top-description">{page.content.description}</div> {/* fill with this.props.page.description */}
                <div className="page-top-content">{page.act_type1.instructions}</div>    {/* fill with this.props.page.content */}
              </div>
              <div> Inserted flat api:</div>
              <div className="page-bottom">
                <FlatView />
                <button type="button" onClick={this.goToNext}>
                  Next
                </button>
              </div>
              {/*
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
      } else {
        return (
          <div>Act type not found</div>
        );
      }
    }
}

export default withRouter(connect(mapStateToProps, { getLesson })(Page));
