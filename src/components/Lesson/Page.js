/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unused-state */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { loadPage } from '../../actions/index';
import NavBar from '../NavBar';

function mapStateToProps(reduxState) {
  return {
    page: reduxState.page,
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

    getNextPage = () => {
      this.props.loadPage(this.props.page.nextPage);
    }

    render() {
      const nextid = this.props.page.nextPage;
      return (
        <div className="current-page">
          <NavBar />
          <div className="full-page">
            <div className="page-top">
              <div className="page-top-topthird">
                <div className="page-top-title">{this.props.page.page_content.page_title}</div>
                <div className="page-top-nav">
                  {/* Arrow icon from font awesome goes here pointing left */}
                  <div className="page-top-nav-line" />
                  <div className="page-top-nav-level">Level {this.props.page.pageNumber} of {this.props.page.length}</div>
                  <div className="page-top-nav-line" />
                  {/* Arrow icon from font awesome goes here pointing right */}
                </div>
              </div>
              <div className="page-top-description">{this.props.page.page_content.page_description}</div> {/* fill with this.props.page.description */}
              <div className="page-top-content">{this.props.page.page_content.content}</div>    {/* fill with this.props.page.content */}
            </div>
            <div className="page-bottom">
              <div className="activity-div">{this.props.page.act_type1}</div> {/* fill with this.props.page.activity */}
              <div className="bottom-div">
                <NavLink to="/:username">
                  <button className="button" id="next" type="button" onClick={this.getNextPage}>Next</button>
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      );
    }
}

export default connect(mapStateToProps, { loadPage })(Page);
