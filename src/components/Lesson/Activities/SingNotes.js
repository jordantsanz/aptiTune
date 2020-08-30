/* eslint-disable eqeqeq */
/* eslint-disable no-restricted-properties */
/* eslint-disable react/sort-comp */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unused-state */
/* eslint-disable no-undef */
/* eslint-disable new-cap */

// take in array of notes, then create staff and display the notes on it

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink, withRouter } from 'react-router-dom';
import { getLesson } from '../../../actions/index';
import drawStaff from '../../DrawStaff';
import { frequencies } from '../../frequencies';
import randomNotes from '../../RandomNotes';

const Pitchfinder = require('pitchfinder');

const videoType = 'video/webm';

function mapStateToProps(reduxState) {
  return {
    pages: reduxState.lesson.pages,
  };
}

class SingNotes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageNumber: 0,
      correctNotes: false,
      complete: false,
      message: '',
      drawmessage: '',
      answers: null,
      firstRender: true,
      page: null,
      recording: false,
      videos: [],
    };
  }

  async componentDidMount() {
    const id = localStorage.getItem('lesson');
    const pageNum = localStorage.getItem('next');
    this.setState({ pageNumber: pageNum });
    const { history } = this.props;
    this.props.getLesson(id, history, false);
    console.log('Component mounted in SingNotes');
    const stream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
    // show it to user
    // this.video.srcObject = stream;
    // init recording
    this.mediaRecorder = new MediaRecorder(stream, {
      mimeType: videoType,
    });
    // init data storage for video chunks
    this.chunks = [];
    // listen for data from media recorder
    this.mediaRecorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        this.chunks.push(e.data);
      }
    };
  }

  goToNext = () => {
    this.props.onSubmit();
  }

  startRecording(e) {
    e.preventDefault();
    // wipe old data chunks
    this.chunks = [];
    // start recorder with 10ms buffer
    this.mediaRecorder.start(10);
    // say that we're recording
    this.setState({ recording: true });
    this.setState({ message: '' });
    this.setState({ drawmessage: '' });
    const staff = document.getElementById('yournotes');
    while (staff.hasChildNodes()) {
      staff.removeChild(staff.lastChild);
    }
    const drawmessage = document.getElementById('drawmessage');
    while (drawmessage.hasChildNodes()) {
      drawmessage.removeChild(drawmessage.lastChild);
    }
  }

  stopRecording(e) {
    e.preventDefault();
    // stop the recorder
    this.mediaRecorder.stop();
    // say that we're not recording
    this.setState({ recording: false });
    // save the video to memory
    this.saveAudio();
  }

  timeout = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  saveAudio = async () => {
    const audioContext = new AudioContext();
    // convert saved chunks to blob
    const blob = new Blob(this.chunks, { type: 'audio/wav; codecs=0' });
    const notes = [];
    let done = false;
    // generate video url from blob
    const data = await fetch(URL.createObjectURL(blob))
      .then((result) => {
        result.arrayBuffer()
          .then((arrayBuffer) => {
            audioContext.decodeAudioData(arrayBuffer)
              .then((audioBuffer) => {
                // this.setState({ duration: audioBuffer.duration });
                // console.log(this.state.duration);
                const audioData = audioBuffer.getChannelData(0);
                console.log(audioData);
                const detectPitch = new Pitchfinder.YIN();
                const testing = frequencies(detectPitch, audioData, {
                  tempo: 60, // in BPM, defaults to 120
                  quantization: 2, // samples per beat, defaults to 4 (i.e. 16th notes)
                  sampleRate: 44100,
                });

                // now convert frequencies into keys & octaves, and make array of these notes
                // creds to https://stackoverflow.com/questions/41174545/pitch-detection-node-js?rq=1 for the musical math
                const keys = ['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b'];
                const c0 = 440.0 * Math.pow(2.0, -4.75);
                let i;
                let oldnote = null;

                // eslint-disable-next-line no-plusplus
                for (i = 0; i < testing.length; i++) {
                  const halfStepsBelowMiddleC = Math.round(12.0 * Math.log2(testing[i] / c0));
                  const octave = Math.floor(halfStepsBelowMiddleC / 12.0);
                  const key = keys[Math.floor(halfStepsBelowMiddleC % 12)];
                  if (octave >= 2 <= 4) {
                    if (testing[i] != null && octave != 10 && octave != -Infinity && key != null) {
                      const note = `${key.toString().toUpperCase() + octave.toString()}/q`;
                      if (note != oldnote) {
                        notes.push(note);
                      }
                      oldnote = note;
                    }
                  }
                }
                done = true;
              });
          });
      });
    console.log(done);
    while (!done) {
      // eslint-disable-next-line no-await-in-loop
      await this.timeout(1000);
    }

    // Check if the notes the user sang are correct
    let correct = true;
    let j = 0;
    let k = 0;
    const { pages } = this.props;
    const page = pages[this.state.pageNumber];
    while (page.activity.correct_answers.length != j - 1) {
      if (page.activity.correct_answers[j] === notes[k]) {
        j += 1;
        k += 1;
      } else {
        correct = false;
        break;
      }
    }

    console.log('notes:', notes);

    // Output error message if user's notes are incorrect, draw staff with their notes if 4
    // If user's notes are correct, mark level as complete
    if (correct) {
      this.setState({ drawmessage: 'This is what you sang:' });
      document.getElementById('drawmessage').innerHTML = this.state.drawmessage;
      drawStaff(notes, 'yournotes');
      this.setState({ correctNotes: true });
      this.setState({ complete: true });
      this.setState({ message: '' });
    } else if (notes.length === 4 && !correct) {
      this.setState({ drawmessage: 'This is what you sang:' });
      document.getElementById('drawmessage').innerHTML = this.state.drawmessage;
      drawStaff(notes, 'yournotes');
      this.setState({ message: 'Not the right pitches, but right number of notes!' });
    } else if (notes.length < 4) {
      this.setState({ drawmessage: '' });
      document.getElementById('drawmessage').innerHTML = this.state.drawmessage;
      this.setState({ message: 'You sang fewer than 4 notes, try again!' });
    } else {
      this.setState({ drawmessage: '' });
      document.getElementById('drawmessage').innerHTML = this.state.drawmessage;
      this.setState({ message: 'You sang more than 4 notes, try again! ' });
    }
  }

  firstRender = () => {
    const { pages } = this.props;
    const page = pages[this.state.pageNumber];
    if (page !== null && page !== undefined && this.state.firstRender) {
      this.setState({ firstRender: false, page: this.props.pages[this.state.pageNumber] });
      drawStaff(page.activity.correct_answers, 'sheetmusic');
    }
  }

  render() {
    const { pages } = this.props;
    const page = pages[this.state.pageNumber];
    if (page === null || page === undefined) {
      return (
        <div>
          Loading...
        </div>
      );
    } else if (this.state.complete) {
      return (
        <div className="finishedMessage">
          You got it! Click to go to the next lesson!
          <button type="button" className="nextButton" onClick={this.goToNext}>
            Next
          </button>
        </div>
      );
    } else if (page.activity_type === 'SingNotes') {
      const { recording } = this.state;
      return (
        <div className="SingNotes">
          <div className="activityInstructions">{page.activity.instructions}</div>
          {/* <div className="activityInstructions">{answer}</div> */}
          <div className="activityInstructionsBelow">Please hold each note for more than a second to ensure that the microphone picks it up.</div>
          {this.firstRender()}
          <div className="recordButton">
            {!recording && <button type="button" className="button" id="start-record" onClick={(e) => this.startRecording(e)}>Record</button>}
            {recording && <button type="button" className="button" id="stop-record" onClick={(e) => this.stopRecording(e)}>Stop</button>}
          </div>
          <div className="incorrectMessage">{this.state.message}</div>
        </div>
      );
    } else {
      return (
        <div>ya done goofed kid, idk what to tell you </div>
      );
    }
  }
}

export default withRouter(connect(mapStateToProps, { getLesson })(SingNotes));
