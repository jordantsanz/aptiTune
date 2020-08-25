/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink, withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAngleLeft, faAngleRight,
} from '@fortawesome/free-solid-svg-icons';
import { getLesson, updateUserInfo, getUserInfo } from '../../actions/index';
import NavBar from '../NavBar';
import FlatView from './Activities/FlatView';

import Listening from './Activities/Listening';

function mapStateToProps(reduxState) {
  return {
    currentUser: reduxState.user,
    lesson: reduxState.lesson,
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
      // get userinfo
      this.props.getUserInfo();

      // get lesson info
      const id = localStorage.getItem('lesson');
      const pageNum = parseInt(localStorage.getItem('next'), 10);
      console.log('Next from localStorage', pageNum);
      this.setState({ pageNumber: pageNum });
      this.setState({ nextPage: pageNum + 1 });
      const { history } = this.props;
      this.props.getLesson(id, history, pageNum);
    }

    goToNext = () => {
      console.log('GOTONEXTCALLED');
      // console.log('this.props.pages.length', this.props.pages.length);
      if (this.props.pages.length > this.state.pageNumber + 1) {
        console.log('got inside');
        const local = parseInt(this.state.nextPage, 10);
        localStorage.setItem('next', local.toString());
        this.setState((prevState) => ({ pageNumber: prevState.pageNumber + 1 }));
        this.setState((prevState) => ({ nextPage: prevState.nextPage + 1 }));
      } else {
        // for now, redirect to home....
        const id = localStorage.getItem('lesson');
        let { fields } = {};
        if (this.props.currentUser.completed === undefined || this.props.currentUser.completed === []) {
          fields = { completedLessons: [id] };
        } else {
          fields = { completedLessons: this.props.currentUser.completed.concat(id) };
        }
        console.log('fields in goToNext: ', fields);
        const { history } = this.props;
        this.props.updateUserInfo(fields);
        history.push('/home');
        // set user info to add
      }
    }

    render() {
      // add page for rendering
      // console.log('pages:', this.props.pages);
      // console.log('pageNumber:', this.state.pageNumber);
      // console.log('pages[0]', pages[this.state.pageNumber]);
      // console.log('page', page);
      if (this.props.pages === null || this.props.pages === undefined || this.props.pages.length === 0) {
        return (
          <div>
            Loading...
          </div>
        );
      }
      console.log('this.props.pages', this.props.pages);
      console.log('this.props.currentUser: ', this.props.currentUser);
      // const { pages } = this.props.pages;
      // console.log('pages:', pages);
      const page = this.props.pages[this.state.pageNumber];
      if (page.activity_type === 'FlatView') {
        return (
          <div className="current-page">
            <NavBar />
            <div className="full-page">
              <div className="page-top">
                <div className="page-top-topthird">
                  <div className="page-top-title">{page.content.title}</div>
                  <div className="page-top-nav">
                    <FontAwesomeIcon className="icon" icon={faAngleLeft} id="leftarrow" />
                    <div className="page-top-nav-line" />
                    <div className="page-top-nav-level">Level {this.state.pageNumber + 1} of {this.props.pages.length}</div>
                    <div className="page-top-nav-line" />
                    <FontAwesomeIcon className="icon" icon={faAngleRight} id="rightarrow" onClick={this.goToNext} />
                  </div>
                </div>
                <div className="page-top-description">{page.content.description}</div>
                <div className="page-top-content">{page.content.instructions}</div>
              </div>
              <div className="page-bottom">
                <div className="flat-holder">
                  <FlatView />
                </div>
                <div className="next-button-holder">
                  <button className="button" id="next-button" type="button" onClick={this.goToNext}>
                    Next
                  </button>
                </div>
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
      } else if (page.activity_type === 'Listening') {
        return (
          <div className="current-page">
            <NavBar />
            <div className="full-page">
              <div className="page-top">
                <div className="page-top-topthird">
                  <div className="page-top-title">{page.content.title}</div>
                  <div className="page-top-nav">
                    <FontAwesomeIcon className="icon" icon={faAngleLeft} id="leftarrow" />
                    <div className="page-top-nav-line" />
                    <div className="page-top-nav-level">Level {this.state.pageNumber + 1} of {this.props.pages.length}</div>
                    <div className="page-top-nav-line" />
                    <FontAwesomeIcon className="icon" icon={faAngleRight} id="rightarrow" onClick={this.goToNext} />
                  </div>
                </div>
                <div className="page-top-description">{page.content.description}</div>
                <div className="page-top-content">{page.act_type1.instructions}</div>
              </div>
              <div> Inserted flat api:</div>
              <div className="page-bottom">
                <Listening />
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

export default withRouter(connect(mapStateToProps, { getLesson, updateUserInfo, getUserInfo })(Page));
