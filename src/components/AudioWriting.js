/* eslint-disable new-cap */
/* eslint-disable no-restricted-properties */
/* eslint-disable react/sort-comp */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/media-has-caption */
import React, { Component } from 'react';
import Vex from 'vexflow';
// eslint-disable-next-line import/extensions
import { frequencies } from './frequencies.js';

const Pitchfinder = require('pitchfinder');

const videoType = 'video/webm';
let noteString;

class AudioWriting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recording: false,
      videos: [],
      octave: '',
      key: '',
    };
  }

  async componentDidMount() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
    // show it to user
    this.video.srcObject = stream;
    // this.video.play();
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

  startRecording(e) {
    e.preventDefault();
    // wipe old data chunks
    this.chunks = [];
    // start recorder with 10ms buffer
    this.mediaRecorder.start(10);
    // say that we're recording
    this.setState({ recording: true });
  }

  stopRecording(e) {
    e.preventDefault();
    // stop the recorder
    this.mediaRecorder.stop();
    // say that we're not recording
    this.setState({ recording: false });
    // save the video to memory
    noteString = this.saveVideo();
  }

  saveVideo = async () => {
    const audioContext = new AudioContext();
    // convert saved chunks to blob
    const blob = new Blob(this.chunks, { type: 'audio/wav; codecs=0' });
    // generate video url from blob
    const data = await fetch(URL.createObjectURL(blob))
      .then((result) => {
        result.arrayBuffer()
          .then((arrayBuffer) => {
            audioContext.decodeAudioData(arrayBuffer)
              .then((audioBuffer) => {
                console.log(audioBuffer);
                const audioData = audioBuffer.getChannelData(0);
                console.log(audioData);
                const detectPitch = new Pitchfinder.YIN();
                // Pitchfinder.frequencies();
                const testing = frequencies(detectPitch, audioData, {
                  tempo: 60, // in BPM, defaults to 120
                  quantization: 1, // samples per beat, defaults to 4 (i.e. 16th notes)
                  sampleRate: 44100,
                });
                console.log(testing);
                const keys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
                const c0 = 440.0 * Math.pow(2.0, -4.75);
                let i;
                const notes = [];
                // eslint-disable-next-line no-plusplus
                for (i = 0; i < testing.length; i++) {
                  const halfStepsBelowMiddleC = Math.round(12.0 * Math.log2(testing[i] / c0));
                  const octave = Math.floor(halfStepsBelowMiddleC / 12.0);
                  const key = keys[Math.floor(halfStepsBelowMiddleC % 12)];
                  console.log(typeof octave);
                  // eslint-disable-next-line eqeqeq
                  if (testing[i] != null && octave != 10 && octave != -Infinity && key != null) {
                    notes.push(key);
                    notes.push(octave);
                    // eslint-disable-next-line eqeqeq
                    if (notes.length == 2) {
                      notes.push('/h');
                    }
                    notes.push(', ');
                    console.log('octave: ', octave, 'key: ', key);
                  }
                }
                let notestring = notes.join('');
                notestring = notestring.substring(0, notestring.length - 1);
                noteString = notestring.replace(/(^,)|(,$)/g, '');
                console.log(noteString);
                return noteString;
              });
          });
      });
    console.log(data);
    // console.log('videoURL:', videoURL);
    // const arrayBuffer = videoURL.arrayBuffer();
    // console.log('ArrayBuffer: ', arrayBuffer);
    // const audioBuffer = audioContext.decodeAudioData(arrayBuffer);
    // console.log('AudioBuffer: ', arrayBuffer);
    // const audioData = audioBuffer.getChannelData(0);
    // console.log('Audiodata: ', audioData);

    // const frequency = detectPitch(audioData); // when we use this, make sure it's not null because it returns null if it can't detect the pitch
    // console.log('frequency: ', frequency);

    // now we do dat musical math; creds to https://stackoverflow.com/questions/41174545/pitch-detection-node-js?rq=1 for the actual math
    /* const keys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const c0 = 440.0 * Math.pow(2.0, -4.75);
    const halfStepsBelowMiddleC = Math.round(12.0 * Math.log2(frequency / c0));
    const octave = Math.floor(halfStepsBelowMiddleC / 12.0);
    const key = keys[Math.floor(halfStepsBelowMiddleC % 12)];
    console.log('octave: ', octave, 'key: ', key);
    this.setState({ octave });
    this.setState({ key }); */

    // Below is an attempt at getting multiple notes, but ran into an error that said frequencies was not a function???
    // const pitchvalues = this.pitchesfinding(audioData);
    // console.log(pitchvalues);
    // append videoURL to list of saved videos for rendering
    // const videos = this.state.videos.concat([videoURL]);
    // this.setState({ videos });
  }

  /* const halfStepsBelowMiddleC = Math.round(12.0 * Math.log2(testing[i] / c0));
  const octave = Math.floor(halfStepsBelowMiddleC / 12.0);
  const key = keys[Math.floor(halfStepsBelowMiddleC % 12)];
  notestring.concat(notestring, key.toString());
  notestring.concat(notestring, octave.toString());
  notestring.concat(notestring, ',');
  console.log('octave: ', octave, 'key: ', key); */

  makeStaff = () => {
    const vf = new Vex.Flow.Factory({
      renderer: { elementId: 'staff', width: 500, height: 200 },
    });

    const score = vf.EasyScore();
    const system = vf.System();

    system.addStave({
      voices: [
        score.voice(score.notes(noteString, { stem: 'up' })),
        // score.voice(score.notes('C#4/h, C#4', { stem: 'down' })),
      ],
    }).addClef('treble').addTimeSignature('4/4');
    vf.draw();
  }

  deleteVideo(videoURL) {
    // filter out current videoURL from the list of saved videos
    const videos = this.state.videos.filter((v) => v !== videoURL);
    this.setState({ videos });
  }

  render() {
    const { recording, videos } = this.state;
    return (
      <div className="camera">
        <video
          style={{ width: 400 }}
          ref={(v) => {
            this.video = v;
          }}
        >
          Video stream not available.
        </video>
        <div>
          {!recording && <button type="button" onClick={(e) => this.startRecording(e)}>Record</button>}
          {recording && <button type="button" onClick={(e) => this.stopRecording(e)}>Stop</button>}
        </div>
        <div id="staff"> o</div>
        <button type="button" onClick={this.makeStaff}>Make Staff</button>
        <div>
          <p>Key: {this.state.key}</p>
          <p>Octave: {this.state.octave}</p>
          <h3>Recorded videos:</h3>
          {videos.map((videoURL, i) => (
            <div key={`video_${i}`}>
              <video style={{ width: 200 }} src={videoURL} autoPlay loop />
              <div>
                <button type="button" onClick={() => this.deleteVideo(videoURL)}>Delete</button>
                <a href={videoURL}>Download</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default AudioWriting;
