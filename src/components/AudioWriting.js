/* eslint-disable no-restricted-properties */
/* eslint-disable react/sort-comp */
/* eslint-disable react/no-access-state-in-setstate */
/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/media-has-caption */
import React, { Component } from 'react';
// import Pitchfinder, { WavDecoder } from 'pitchfinder';

const Pitchfinder = require('pitchfinder');

const videoType = 'video/webm';

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
    this.saveVideo();
  }

  saveVideo = async () => {
    const audioContext = new AudioContext();
    // convert saved chunks to blob
    const blob = new Blob(this.chunks, { type: 'audio/wav; codecs=0' });
    // console.log(blob);

    // generate video url from blob
    const videoURL = await fetch(URL.createObjectURL(blob));
    // console.log('videoURL:', videoURL);
    const arrayBuffer = await videoURL.arrayBuffer();
    // console.log('ArrayBuffer: ', arrayBuffer);
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    // console.log('AudioBuffer: ', arrayBuffer);
    const audioData = audioBuffer.getChannelData(0);
    // console.log('Audiodata: ', audioData);

    const detectPitch = new Pitchfinder.YIN();
    const frequency = detectPitch(audioData); // when we use this, make sure it's not null because it returns null if it can't detect the pitch
    console.log('frequency: ', frequency);

    // now we do dat musical math; creds to https://stackoverflow.com/questions/41174545/pitch-detection-node-js?rq=1 for the actual math
    const keys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
    const c0 = 440.0 * Math.pow(2.0, -4.75);
    const halfStepsBelowMiddleC = Math.round(12.0 * Math.log2(frequency / c0));
    const octave = Math.floor(halfStepsBelowMiddleC / 12.0);
    const key = keys[Math.floor(halfStepsBelowMiddleC % 12)];
    console.log('octave: ', octave, 'key: ', key);
    this.setState({ octave });
    this.setState({ key });

    // Below is an attempt at getting multiple notes, but ran into an error that said frequencies was not a function???
    /* const frequencies = Pitchfinder.frequencies(detectPitch, audioData, {
      tempo: 130, // in BPM, defaults to 120
      quantization: 4, // samples per beat, defaults to 4 (i.e. 16th notes)
    });
    console.log(frequencies); */

    // append videoURL to list of saved videos for rendering
    const videos = this.state.videos.concat([videoURL]);
    this.setState({ videos });
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
