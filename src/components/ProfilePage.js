/* eslint-disable react/no-unused-state */
/* eslint-disable max-len */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable consistent-return */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { updateUserInfo } from '../actions/index';
import NavBar from './NavBar';

class ProfilePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false,
      icon: -1,
      username: '',
      password: '',
      new: '',
      retype: '',
    };
    console.log('in profile page');
  }

iconRender = () => {
  if (this.state.icon === 0) {
    return (
      <div className="icon-div">
        <img clasName="user-icon" id="0" alt="user-icon" />
      </div>
    );
  }

  if (this.state.icon === 1) {
    return (
      <div className="icon-div">
        <img className="user-icon" id="1" alt="user-icon" />
      </div>
    );
  }

  if (this.state.icon === 2) {
    return (
      <div className="icon-div">
        <img className="user-icon" id="2" alt="user-icon" />
      </div>
    );
  }

  if (this.state.icon === 3) {
    return (
      <div className="icon-div">
        <img className="user-icon" id="3" alt="user-icon" />
      </div>
    );
  }
  if (this.state.icon === 4) {
    return (
      <div className="icon-div">
        <img className="user-icon" id="4" alt="user-icon" />
      </div>
    );
  }
}

  startEditing = () => {
    this.setState({
      isEditing: true,
    });
  }

  stopEditing = () => {
    // this.props.update
    this.setState({
      isEditing: false,
    });
    const fields = {
      username: this.state.username,
      icon: this.state.icon,
    };
    this.props.updateUserInfo(this.props.currentUser.username, fields);
  }

  onInputChange = (event) => {
    this.setState({
      username: event.target.value,
    });
  }

  onInputChangeCurrentPassword = (event) => {
    this.setState({
      password: event.target.value,
    });
  }

  onInputChangeNewPassword = (event) => {
    this.setState({
      new: event.target.value,
    });
  }

  onInputChangeRetypeNewPassword = (event) => {
    this.setState({
      retype: event.target.value,
    });
  }

  changePasswordSubmit = () => {
    if (this.state.password === '' || this.state.new === '' || this.state.retype === '') {
      this.setState({
        passwordResetStatus: 'emptyField', // should render error message down below
      });
    } else if (this.state.new !== this.state.retype) {
      this.setState({
        passwordResetStatus: 'newAndRetype',
      });
    } else { // some function call here to reset password...not sure how to do this in backend
    }
  }

  renderEdits() {
    if (this.state.isEditing) {
      return (
        <div className="user-name-container-inner">
          <input className="display-name-input" type="input" onChange={this.onInputChange} />
          <div className="icon-holder" onClick={this.stopEditing}>
            <div className="icon" id="check" />
          </div>
        </div>
      );
    } else {
      return (
        <div className="user-name-container-inner">
          <div className="user-name-display"> {this.props.currentUser.username} </div>
          <div className="icon-holder" onClick={this.startEditing}>
            <div className="icon" id="pencil" />
          </div> {/* click on to edit display name */}
        </div>
      );
    }
  }

  render() {
    return (
      <div className="profile-page-container">
        <NavBar />
        <div className="profile-page-content">
          <div className="profile-page-user-display">
            <div className="user-icon-container">
              <div className="arrow-button-background">
                <div className="icon" id="arrow-left" />
              </div>
              <div className="user-icon-background">
                {this.iconRender()}
              </div>
              <div className="arrow-button-background">
                <div className="icon" id="arrow-right" />
              </div>
            </div>
            <div className="user-name-container">{this.renderEdits()}</div>
          </div>
          <div className="profile-page-user-stats">
            <div className="title" id="stats-title">User Stats</div>
            <div className="stats-graphs" />
          </div>
          <div className="profile-page-badges-section">
            <div className="title" id="badges-title-profile">{this.props.currentUser.username}&apos;s Badges </div>
            <div className="badges-trophy-case">
              {/* need to loop through all badges here and render; check to see if badge name is in user.badges array, and color red if so; */}
            </div>
          </div>
          <div className="profile-page-user-settings">
            <div className="title" id="user-settings-title">Change Password</div>
            <div className="settings-content">
              <div className="settings-current-container">
                <div className="subtitle" id="settings-current-title">Current</div>
                <input className="input" id="current-password-input" onChange={this.onInputChangeCurrentPassword} placeholder="current password" />
              </div>
              <div className="settings-new-continer">
                <div className="subtitle" id="settings-new-title">new</div>
                <input className="input" id="new-password-input" onChange={this.onInputChangeNewPassword} placeholder="new password" />
              </div>
              <div className="settings-retype-new-container">
                <div className="subtitle" id="settings-retype-new-title">re-type new</div>
                <input className="input" id="retype-new-password-input" onChange={this.onInputChangeRetypePassword} placeholder="re-type new password" />
              </div>
            </div>
            <div className="settings-buttons">
              <button className="button" id="change-password" type="button" onClick={this.changePasswordSubmit}>Change Password</button>
              <button className="button" id="cancel" type="button">Cancel</button>
            </div>
          </div>
          <div className="delete-profile-container">
            <div className="title" id="user-settings-title">Delete Account</div>
            <div className="subtitle" id="delete-user-subtitle">
              Are you sure you want to delete your account?
              You will not be able log in or restore your account or the data you stored with us.
            </div>
            <div className="delete-modal">
              <button className="button" id="delete-user" type="button">Yes, I’m breaking up with you</button>
              <div id="delete-user-moadl" className="modal">
                <div className="modal-content">
                  <span className="close">&times;</span>
                  <div className="modal-content-detail">
                    <div className="title" id="user-settings-title">We&apos;re breaking up?</div>
                    <div className="subtitle" id="delete-user-subtitle">We&apos;re sorry to hear you’d like to delete your account with us. <br /> If you&apos;re just looking to take a break, you can always sign out of your account.  </div>
                    <div className="subtitle">You will not be able to log back in or restore your account or the data you stored with us.</div>
                    <div className="settings-current-container">
                      <div className="subtitle" id="settings-current-title">email</div>
                      <input className="input" id="current-password-input" onChange={this.onInputChangeCurrentPassword} placeholder="your email" />
                    </div>
                    <div className="settings-new-continer">
                      <div className="subtitle" id="settings-new-title">password</div>
                      <input className="input" id="new-password-input" onChange={this.onInputChangeNewPassword} placeholder="your password" />
                    </div>
                    <div className="settings-retype-new-container">
                      <div className="subtitle" id="settings-retype-new-title">re-type password</div>
                      <input className="input" id="retype-new-password-input" onChange={this.onInputChangeRetypePassword} placeholder="re-type your password" />
                    </div>
                    <div className="delete-user-buttons">
                      <button className="button" id="cancel-delete" type="button">Cancel</button>
                      <button className="button" id="continue-delete" type="button">Continue</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(reduxState) {
  return {
    currentUser: reduxState.user,
  };
}

export default connect(mapStateToProps, { updateUserInfo })(ProfilePage);
