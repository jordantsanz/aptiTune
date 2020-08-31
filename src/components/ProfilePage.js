/* eslint-disable eqeqeq */
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
import {
  updateUserInfo, getUserInfo, setError, hideError,
} from '../actions/index';
import NavBar from './NavBar';
import ErrorNotification from './errorMessage';

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
        <img className="user" id="user-icon" alt="user-icon" src="https://aptitune.s3.amazonaws.com/half+note.png" width="163.74px" height="248.22px" />
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

checkUserNameInput = () => {
  const attemptedUsername = document.getElementById('change-username').value;
  const usernameLength = attemptedUsername.length;
  let isValid = true;
  if (usernameLength === 0) {
    this.props.setError(1002);
    isValid = false;
  }
  if (usernameLength < 4) {
    this.props.setError(1001);
    isValid = false;
  }
  if (usernameLength > 10) {
    this.props.setError(1000);
    isValid = false;
  }
  console.log('is valid', isValid);
  if (isValid) {
    if (this.props.error.open === true) {
      this.props.hideError();
    }
    this.setState({
      isEditing: false,
    });
    this.props.updateUserInfo({ username: document.getElementById('change-username').value });
    this.props.getUserInfo();
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
    }
  }

  makeTotalDoughnut = () => {
    const haveData = [];
    for (let i = 0; i < 4; i++) {
      if (this.props.currentUser.questionsCorrect[i] == 0 && this.props.currentUser.questionsIncorrect[i] == 0) {
        haveData[i] = 1;
      } else {
        haveData[i] = 0;
      }
    }
    let notAllZero = false;
    for (let j = 0; j < 4; j++) {
      if (haveData[j] == 0) {
        notAllZero = true;
      }
    }

    if (notAllZero) {
      const totals = [];
      for (let index = 0; index < 4; index++) {
        totals[index] = this.props.currentUser.questionsCorrect[index] + this.props.currentUser.questionsIncorrect[index];
      }
      const labelset = ['Sightreading',
        'Listening',
        'Rhythm',
        'Singing',
      ];
      const data = {
        labels: labelset,
        datasets: [{
          data: totals,
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
          data: this.props.currentUser.questionsCorrect,
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
            <div className="doughnut-title-holder">
              <h1 className="doughnut-title-new"> Questions correct: </h1>
            </div>
            <div className="doughnut-div-holder">
              <Doughnut className="questionscorrect"
                data={data2}
                width={600}
                height={300}
                options={{ maintainAspectRatio: false }}
              />
            </div>
          </div>
          <div className="doughnut-holder">
            <div className="doughnut-title-holder">
              <h1 className="doughnut-title-new"> Questions answered: </h1>
            </div>
            <div className="doughnut-div-holder">
              <Doughnut className="questionsanswered"
                data={data}
                width={600}
                height={300}
                options={{ maintainAspectRatio: false }}
              />
            </div>
          </div>
        </div>

      );
    } else {
      return (
        <div className="doughnut-title-new-nodata">Come back when you&apos;ve practiced a bit more!</div>
      );
    }
  }

  strengthFinder = () => {
    const haveData = [];
    for (let i = 0; i < 4; i++) {
      if (this.props.currentUser.questionsCorrect[i] == 0 && this.props.currentUser.questionsIncorrect[i] == 0) {
        haveData[i] = 1;
      } else {
        haveData[i] = 0;
      }
    }
    let notAllZero = false;
    for (let j = 0; j < 4; j++) {
      if (haveData[j] == 0) {
        notAllZero = true;
      }
    }
    if (notAllZero) {
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
            <div className="strength">Your strength is Sightreading! Awesome!</div>
          );
        case 1:
          return (
            <div className="strength">Your strength is Listening! Awesome!</div>
          );
        case 2:
          return (
            <div className="strength">Your strength is Rhythm! Awesome!</div>
          );
        case 3:
          return (
            <div className="strength">Your strength is Pitch-matching! Awesome!</div>
          );
        default:
          return (
            <div className="strength">Practice more to find out your strengths!</div>
          );
      }
    } else {
      return (
        <div className="blank" />
      );
    }
  }

  weaknessFinder = () => {
    const haveData = [];
    for (let i = 0; i < 4; i++) {
      if (this.props.currentUser.questionsCorrect[i] == 0 && this.props.currentUser.questionsIncorrect[i] == 0) {
        haveData[i] = 1;
      } else {
        haveData[i] = 0;
      }
    }
    let notAllZero = false;
    for (let j = 0; j < 4; j++) {
      if (haveData[j] == 0) {
        notAllZero = true;
      }
    }
    if (notAllZero) {
      const averages = [];
      for (let index = 0; index < 4; index++) {
        averages[index] = this.props.currentUser.questionsCorrect[index] / (this.props.currentUser.questionsCorrect[index] + this.props.currentUser.questionsIncorrect[index]);
      }
      let min = averages[0];
      let minIndex = 0;
      for (let index2 = 0; index2 < 4; index2++) {
        if (averages[index2] < min) {
          min = averages[index2];
          minIndex = index2;
        }
      }
      switch (minIndex) {
        case 0:
          return (
            <div className="weakness">Try practicing with Sightreading.</div>
          );
        case 1:
          return (
            <div className="weakness">Try practicing with Listening. </div>
          );
        case 2:
          return (
            <div className="weakness">Try practicing with Rhythm.  </div>
          );
        case 3:
          return (
            <div className="weakness">Try practicing with Pitch-matching. </div>
          );
        default:
          return (
            <div className="weakness" />
          );
      }
    } else {
      return (
        <div className="blank" />
      );
    }
  }

  renderEdits() {
    if (this.state.isEditing) {
      return (
        <div className="user-name-container-inner">
          <input className="display-name-input" id="change-username" type="input" onChange={this.onInputChange} placeholder="new username" />
          <button type="button" className="icon-holder" id="done-edit-username" onClick={this.checkUserNameInput}>
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
          </button>
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
        <ErrorNotification />
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
                <div className="doughnut">{this.makeTotalDoughnut()} </div>
              </div>
            </div>
            <div className="strength-holder">{this.strengthFinder()} </div>
            <div className="weakness-holder">{this.weaknessFinder()} </div>
          </div>
          <div className="profile-page-badges-section">
            <div className="title" id="badges-title-profile">Your Badges </div>
            <div className="badges-trophy-case">
              {this.props.currentUser.badges.map((badge) => {
                console.log('rendering badge: ', badge);
                console.log('badge.name:', badge.name);
                console.log('badge.iconUrl', badge.iconUrl);
                if (badge.iconUrl === '' && this.props.currentUser.badges.length === 1) {
                  console.log('rendering: No badges yet!');
                  return (
                    <div id={badge.iconUrl}>
                      <div className="badge-title-nobadgesyet" key={badge.name}>{badge.name}</div>
                    </div>
                  );
                } else if (badge.iconUrl !== '' && badge.name !== 'No badges yet!' && badge.name !== undefined) {
                  return (
                    <div className="badge-trophy">
                      <div id={badge.iconUrl} className="badge-title">{badge.name}</div>
                      <img className="badge-image" src={badge.iconUrl} alt="badge-icon" />
                    </div>
                  );
                }
              })}
            </div>
          </div>
          {/* <div className="delete-profile-container">
            <div className="title" id="user-settings-title-delete">Delete Account</div>
            <div className="subtitle" id="delete-user-subtitle">
              Are you sure you want to delete your account?
              You will not be able log in or restore your account or the data you stored with us.
            </div>
          </div>
            <div className="delete-modal">
              <button className="button" id="delete-user" type="button" onClick={this.openModal}>Yes, I’m breaking up with you</button>
              <Modal
                isOpen={this.state.modalisopen}
                onRequestClose={this.closeModal}
                style={customStyles}
              >
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
          </div> */}
        </div>
      </div>
    );
  }
}

function mapStateToProps(reduxState) {
  return {
    currentUser: reduxState.user,
    error: reduxState.error,
  };
}

export default connect(mapStateToProps, {
  updateUserInfo, getUserInfo, setError, hideError,
})(ProfilePage);
