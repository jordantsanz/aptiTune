/* eslint-disable no-unused-vars */
/* eslint-disable no-plusplus */
/* eslint-disable array-callback-return */
/* eslint-disable react/no-unused-state */
/* eslint-disable max-len */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable consistent-return */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPen, faCheck, faArrowCircleLeft, faArrowCircleRight,
} from '@fortawesome/free-solid-svg-icons';
import { Doughnut } from 'react-chartjs-2';
import { updateUserInfo, getUserInfo } from '../actions/index';
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
      modalisopen: false,
    };
    this.props.getUserInfo();
    console.log('in profile page');
    this.openModal = this.openModal.bind(this);
  }

  iconMoveRight = () => {
    if (this.state.icon < 3) {
      this.setState((prevState) => ({
        icon: prevState.icon + 1,
      }));
      this.props.updateUserInfo({ icon: this.state.icon + 1 });
    } else {
      this.setState({
        icon: 0,
      });
      this.props.updateUserInfo({ icon: 0 });
    }
  }

  iconMoveLeft = () => {
    if (this.state.icon > 0) {
      this.setState((prevState) => ({
        icon: prevState.icon - 1,
      }));
      this.props.updateUserInfo({ icon: this.state.icon - 1 });
    } else {
      this.setState({
        icon: 3,
      });
      this.props.updateUserInfo({ icon: 3 });
    }
  }

iconRender = () => {
  console.log(this.props.currentUser);
  if (this.state.icon === -1) {
    this.setState({
      icon: this.props.currentUser.icon,
    });
  }
  if (this.state.icon === 0) {
    return (
      <div className="icon-div">
        <img className="user" id="user-icon" alt="user-icon" src="https://aptitune.s3.amazonaws.com/eighth+note.png" />
      </div>
    );
  }

  if (this.state.icon === 1) {
    return (
      <div className="icon-div">
        <img className="user" id="user-icon" alt="user-icon" src="https://aptitune.s3.amazonaws.com/sixteenth+note.png" />
      </div>
    );
  }

  if (this.state.icon === 2) {
    return (
      <div className="icon-div">
        <img className="user" id="user-icon" alt="user-icon" src="https://aptitune.s3.amazonaws.com/half+note.png" />
      </div>
    );
  }

  if (this.state.icon === 3) {
    return (
      <div className="icon-div">
        <img className="user" id="user-icon" alt="user-icon" src="https://aptitune.s3.amazonaws.com/whole+note.png" />
      </div>
    );
  }
}

openModal = () => {
  this.setState({ modalisopen: true });
}

closeModal = () => {
  this.setState({ modalisopen: false });
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
    console.log('new username being sent: ', document.getElementById('change-username').value);
    this.props.updateUserInfo({ username: document.getElementById('change-username').value });
    this.props.getUserInfo();
  }

  onInputChange = (event) => {
    console.log('this is in usernameinputchange');
    console.log(document.getElementById('change-username').value);
    this.setState({
      username: this.props.currentUser.username,
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

  makeTotalDoughnut = () => {
    // const totals = [];
    // for (let index = 0; index < 4; index++) {
    //   totals[index] = this.props.currentUser.questionsCorrect[index] + this.props.currentUser.questionsIncorrect[index];
    // }
    const labelset = ['Fill-in-the-Blank',
      'Listening',
      'Rhythm',
      'Singing',
    ];
    const data = {
      labels: labelset,
      datasets: [{
        data: [2, 3, 4, 5],
        backgroundColor: [
          '#FD966A',
          '#FBBE49',
          '#114353',
          '#F18080',
        ],
        hoverBackgroundColor: [
          '#f7a785',
          '#fac86b',
          '#1b5d74',
          '#ee9b9b',
        ],
      }],
    };

    const data2 = {
      labels: labelset,
      datasets: [{
        data: [2, 3, 4, 5],
        backgroundColor: [
          '#FD966A',
          '#FBBE49',
          '#114353',
          '#F18080',
        ],
        hoverBackgroundColor: [
          '#f7a785',
          '#fac86b',
          '#1b5d74',
          '#ee9b9b',
        ],
      }],
    };

    return (
      <div className="doughnuts">
        <div className="doughnut-holder">
          <Doughnut className="questionscorrect"
            data={data2}
            width={300}
            height={150}
            options={{ maintainAspectRatio: false }}
          />
        </div>
        <div className="doughnut-holder">
          <Doughnut className="totalquestions"
            data={data}
            width={300}
            height={150}
            options={{ maintainAspectRatio: false }}
          />
        </div>
      </div>

    );
  }

  strengthFinder = () => {
    const averages = [];
    for (let index = 0; index < 4; index++) {
      averages[index] = this.props.currentUser.questionsCorrect[index] / (this.props.currentUser.questionsCorrect[index] + this.props.currentUser.questionsIncorrect[index]);
    }
    let max = averages[0];
    let maxIndex = 0;
    for (let index2 = 0; index2 < 4; index2++) {
      if (averages[index2] > max) {
        max = averages[index2];
        maxIndex = index2;
      }
    }
    switch (maxIndex) {
      case 0:
        return (
          <div className="strength">Your strength is: Fill-in-the-Blank!</div>
        );
      case 1:
        return (
          <div className="strength">Your strength is: Listening!</div>
        );
      case 2:
        return (
          <div className="strength">Your strength is: Rhythm!</div>
        );
      case 3:
        return (
          <div className="strength">Your strength is: Singing!</div>
        );
      default:
        return (
          <div className="strength">Collect some more data to find your strength!</div>
        );
    }
  }

  renderEdits() {
    if (this.state.isEditing) {
      return (
        <div className="user-name-container-inner">
          <input className="display-name-input" id="change-username" type="input" onChange={this.onInputChange} placeholder="new username" />
          <button type="button" className="icon-holder" id="done-edit-username" onClick={this.stopEditing}>
            <FontAwesomeIcon icon={faCheck} className="icon" id="editing-icon" alt="check-icon" />
          </button>
        </div>
      );
    } else {
      return (
        <div className="user-name-container-inner">
          <div className="user-name-display" id="profile-page-username">{this.props.currentUser.username}</div>
          <button type="button" className="icon-holder" id="edit-username" onClick={this.startEditing}>
            <FontAwesomeIcon icon={faPen} className="icon" id="check-icon" alt="pen-icon" />

            {/* <i className="fal fa-pencil" /> */}

            {/* <div className="icon" id="pencil" /> */}
          </button> {/* click on to edit display name */}
        </div>
      );
    }
  }

  render() {
    const customStyles = {
      content: {
        top: '50%',
        left: '55%',
        right: '-600px',
        bottom: '-300px',
        marginRight: '10%',
        transform: 'translate(-50%, -50%)',
        overflow: 'hidden',
      },
    };
    return (
      <div className="profile-page-container">
        <NavBar />
        <div className="profile-page-content">
          <div className="profile-page-user-display">
            <div className="user-icon-container">
              <FontAwesomeIcon icon={faArrowCircleLeft} className="arrow-button-background-left" onClick={this.iconMoveLeft} />
              <div className="user-icon-background">
                {this.iconRender()}
              </div>
              <FontAwesomeIcon icon={faArrowCircleRight} className="arrow-button-background-right" onClick={this.iconMoveRight} />
            </div>
            <div className="user-name-container">{this.renderEdits()}</div>
          </div>
          <div className="profile-page-user-stats">
            <div className="title" id="stats-title">Your Stats</div>
            <div className="stats-graphs">
              <div className="questions-correct-title">
                <h1 className="Questions correct">Questions answered: </h1>
                <div className="doughnut">{this.makeTotalDoughnut()} </div>
              </div>
            </div>
          </div>
          <div className="profile-page-badges-section">
            <div className="title" id="badges-title-profile">Your Badges </div>
            <div className="badges-trophy-case">
              {this.props.currentUser.badges.map((badge) => {
                console.log('rendering badge: ', badge);
                if (badge.iconUrl === '' && this.props.currentUser.badges.length === 1) {
                  console.log('rendering: No badges yet!');
                  return (
                    <div id={badge.iconUrl}>
                      <div className="badge-title">{badge.name}</div>
                    </div>
                  );
                } else if (badge.iconUrl !== '') {
                  return (
                    <div>
                      <div id={badge.iconUrl} className="badge-title">{badge.name}</div>
                      <img className="badge-image" src={badge.iconUrl} alt="badge-icon" />
                    </div>
                  );
                }
              })}
            </div>
          </div>
          <div className="profile-page-user-settings">
            <div className="title" id="user-settings-title">Change Password</div>
            <div className="settings-content">
              <div className="settings-current-container">
                <div className="subtitle" id="settings-current-title">current</div>
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
            <div className="title" id="user-settings-title-delete">Delete Account</div>
            <div className="subtitle" id="delete-user-subtitle">
              Are you sure you want to delete your account?
              You will not be able log in or restore your account or the data you stored with us.
            </div>
            <div className="delete-modal">
              <button className="button" id="delete-user" type="button" onClick={this.openModal}>Yes, I’m breaking up with you</button>
              <Modal
                isOpen={this.state.modalisopen}
                onRequestClose={this.closeModal}
                style={customStyles}
              >
                {/* <button type="button" onClick={this.closeModal}>close</button> */}
                <div id="delete-user-modal" className="modal">
                  <div className="modal-content">
                    <div className="modal-content-detail">
                      <div className="title" id="user-settings-title-breakup">We&apos;re breaking up?</div>
                      <div className="subtitle" id="delete-user-subtitle-breakup">We&apos;re sorry to hear you’d like to delete your account with us. <br /> If you&apos;re just looking to take a break, you can always sign out of your account.  </div>
                      <div className="subtitle" id="unable-to-restore">You will not be able to log back in or restore your account or the data you stored with us.</div>
                      <div className="settings-current-container-breakup">
                        <div className="subtitle" id="settings-current-title-delete">email</div>
                        <input className="input" id="current-password-input-delete" onChange={this.onInputChangeCurrentPassword} placeholder="your email" />
                      </div>
                      <div className="settings-new-continer">
                        <div className="subtitle" id="settings-new-title-delete">password</div>
                        <input className="input" id="new-password-input-delete" onChange={this.onInputChangeNewPassword} placeholder="your password" />
                      </div>
                      <div className="settings-retype-new-container">
                        <div className="subtitle" id="settings-retype-new-title-delete">re-type password</div>
                        <input className="input" id="retype-new-password-input-delete" onChange={this.onInputChangeRetypePassword} placeholder="re-type your password" />
                      </div>
                      <div className="delete-user-buttons">
                        <button className="button" id="cancel-delete" type="button" onClick={this.closeModal}>Cancel</button>
                        <button className="button" id="continue-delete" type="button">Continue</button>
                      </div>
                    </div>
                  </div>
                </div>
              </Modal>
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

export default connect(mapStateToProps, { updateUserInfo, getUserInfo })(ProfilePage);
