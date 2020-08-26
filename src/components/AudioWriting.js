/* eslint-disable react/self-closing-comp */
/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
/* eslint-disable no-plusplus */
/* eslint-disable prefer-template */
/* eslint-disable eqeqeq */
/* eslint-disable react/no-unused-state */
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
import NavBar from './NavBar';

const Pitchfinder = require('pitchfinder');

const videoType = 'video/webm';
const VF = Vex.Flow;

class AudioWriting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recording: false,
      videos: [],
      octave: '',
      key: '',
      tempo: 60,
      quantization: 1,
      duration: '',
      measures: '',
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

  setTempo = (event) => {
    this.setState({
      tempo: event.target.value,
    });
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

  timeout = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  saveVideo = async () => {
    const audioContext = new AudioContext();
    // convert saved chunks to blob
    const blob = new Blob(this.chunks, { type: 'audio/wav; codecs=0' });
    const notestringArray = [];
    let stringOfNotes;
    const tieArray = [];
    const measuresArray = [];
    let done = false;
    // generate video url from blob
    const data = await fetch(URL.createObjectURL(blob))
      .then((result) => {
        result.arrayBuffer()
          .then((arrayBuffer) => {
            audioContext.decodeAudioData(arrayBuffer)
              .then((audioBuffer) => {
                this.setState({ duration: audioBuffer.duration });
                console.log(this.state.duration);
                const audioData = audioBuffer.getChannelData(0);
                console.log(audioData);
                const detectPitch = new Pitchfinder.YIN();
                // Pitchfinder.frequencies();
                const testing = frequencies(detectPitch, audioData, {
                  tempo: this.state.tempo, // in BPM, defaults to 120
                  quantization: 4, // samples per beat, defaults to 4 (i.e. 16th notes)
                  sampleRate: 44100,
                });
                let measure = this.state.duraiton * this.state.tempo;
                measure /= (this.state.quantization * 4);
                this.setState({
                  measure,
                });
                console.log(this.state.measure);
                console.log(testing);
                const keys = ['c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b', 'c'];
                const c0 = 440.0 * Math.pow(2.0, -4.75);
                let i;
                const notes = [];
                // now we do dat musical math; creds to https://stackoverflow.com/questions/41174545/pitch-detection-node-js?rq=1 for the actual math
                // eslint-disable-next-line no-plusplus
                for (i = 0; i < testing.length; i++) {
                  const halfStepsBelowMiddleC = Math.round(12.0 * Math.log2(testing[i] / c0));
                  const octave = Math.floor(halfStepsBelowMiddleC / 12.0);
                  const key = keys[Math.floor(halfStepsBelowMiddleC % 12)];

                  if (testing[i] != null && octave != 10 && octave != -Infinity && key != null) {
                    const note = key.toString() + '/' + octave.toString();
                    notes.push(note);
                    console.log('octave: ', octave, 'key: ', key);
                  }
                }

                let currentNote = 0; // current note to check
                let measureBeats = 0; // beats in a measure
                let singleMeasure = [];

                while (currentNote < notes.length) {
                  let inARow = 1; // number of same note in a row
                  let nextNote = currentNote + 1; // next note to check
                  measureBeats += 1; // beats in a measure

                  // if all of the beats in a measure are filled
                  if (measureBeats != 16) {
                    // if the note after the current note is the same, add 1 to the count of same notes in a row
                    while (notes[nextNote] == notes[currentNote] && nextNote < notes.length) {
                      inARow += 1;
                      nextNote += 1;
                      measureBeats += 1;

                      if (measureBeats == 16) {
                        break;
                      }
                    }
                  }

                  let length = '';
                  switch (inARow) {
                    case 1:
                      length = '16';
                      break;
                    case 2:
                      length = '8';
                      break;
                    case 3:
                      length = '8d';
                      break;
                    case 4:
                      length = 'q';
                      break;
                    case 5:
                      length = 'q';
                      nextNote -= 1;
                      measureBeats -= 1;
                      break;
                    case 6:
                      length = 'qd';
                      break;
                    case 7:
                      length = 'qd';
                      nextNote -= 1;
                      measureBeats -= 1;
                      break;
                    case 8:
                      length = 'h';
                      break;
                    case 9:
                      length = 'h';
                      nextNote -= 1;
                      measureBeats -= 1;
                      break;
                    case 10:
                      length = 'h';
                      nextNote -= 2;
                      measureBeats -= 2;
                      break;
                    case 11:
                      length = 'h';
                      nextNote -= 3;
                      measureBeats -= 3;
                      break;
                    case 12:
                      length = 'hd';
                      break;
                    case 13:
                      length = 'hd';
                      nextNote -= 1;
                      measureBeats -= 1;
                      break;
                    case 14:
                      length = 'hd';
                      nextNote -= 2;
                      measureBeats -= 2;
                      break;
                    case 15:
                      length = 'hd';
                      nextNote -= 3;
                      measureBeats -= 3;
                      break;
                    case 16:
                      length = 'w';
                      break;
                    default:
                      break;
                  }
                  // make note object!!
                  const noteObj = new VF.StaveNote({ clef: 'treble', keys: [notes[currentNote]], duration: length });
                  singleMeasure.push(noteObj);

                  // make array to hold da note
                  if (measureBeats == 16) {
                    if (notes[currentNote] == notes[nextNote]) {
                      const tie = new VF.StaveTie({
                        first_note: notes[currentNote],
                        last_note: notes[nextNote],
                        first_indices: [0],
                        last_indices: [0],
                      });
                      tieArray.push(tie);
                    }
                    measuresArray.push(singleMeasure);
                    singleMeasure = [];
                    measureBeats = 0;
                  }
                  inARow = 0;
                  currentNote = nextNote;

                  // check for full measure, then check for tie
                }

                while (measureBeats < 16) {
                  const rest = new VF.StaveNote({ clef: 'treble', keys: ['b/4'], duration: '16r' });
                  singleMeasure.push(rest);
                  measureBeats += 1;
                }

                measuresArray.push(singleMeasure);
                singleMeasure = [];

                done = true;
              });
          });
      });
    console.log(data);
    console.log(stringOfNotes);
    while (!done) {
      // eslint-disable-next-line no-await-in-loop
      await this.timeout(1000);
    }
    this.createSheetMusic(measuresArray, tieArray);
  }

  createSheetMusic = async (measuresArray, tieArray) => {
    // Create an SVG renderer and attach it to the DIV element named "boo".
    const div = document.getElementById('staff');
    const renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);

    // Size our SVG:
    renderer.resize(500, 500);

    // And get a drawing context:
    const context = renderer.getContext();
    // var ctx = new contextBuilder(options.elementId, 400, 300);
    // Create a stave at position 10, 40 of width 400 on the canvas.
    let stave = new VF.Stave(10, 40, 400);
    stave.setContext(context);

    // Add a clef and time signature.
    stave.addClef('treble').addTimeSignature('4/4');
    stave.draw();
    const voice = new VF.Voice({ num_beats: 4, beat_value: 4 });
    voice.addTickables(measuresArray[0]);
    const formatter = new VF.Formatter().joinVoices([voice]).format([voice], 400);
    voice.draw(context, stave);

    // if we have more measures:
    for (let measureIndex = 1; measureIndex < measuresArray.length; measureIndex += 1) {
      let newstave = new VF.Stave(10 + 400 * measureIndex, 40, 400);
      newstave.setContext(context).draw();

      const newvoice = new VF.Voice({ num_beats: 4, beat_value: 4 });
      newvoice.addTickables(measuresArray[measureIndex]);
      const newformatter = new VF.Formatter().joinVoices([newvoice]).format([newvoice], 400);
      newvoice.draw(context, newstave);
      const connector = new VF.StaveConnector(stave, newstave);
      connector.setContext(context);
      connector.draw();
      connector.setType(VF.StaveConnector.type.SINGLE);
      connector.draw();
      // ties.forEach(function(t) {t.setContext(context).draw()})
      stave = newstave;
      newstave = '';
    }
  };

  deleteVideo(videoURL) {
    // filter out current videoURL from the list of saved videos
    const videos = this.state.videos.filter((v) => v !== videoURL);
    this.setState({ videos });
  }

  render() {
    const { recording, videos } = this.state;
    return (
      <div className="audiowriting-main">
        <NavBar />
        <div className="audiowriting-content">
          <div className="writing-header">
            Write your own sheet music!
          </div>
          <input className="input" id="tempo" placeholder="input tempo here (ex. 110)" onChange={this.setTempo} />
          <video
            style={{ width: 400 }}
            ref={(v) => {
              this.video = v;
            }}
          >
            Video stream not available.
          </video>
          <div>
            {!recording && <button type="button" className="button" id="start-record" onClick={(e) => this.startRecording(e)}>Record</button>}
            {recording && <button type="button" className="button" id="stop-record" onClick={(e) => this.stopRecording(e)}>Stop</button>}
          </div>
          <div id="staff"></div>
        </div>
      </div>
    );
  }
}

export default AudioWriting;

// console.log('videoURL:', videoURL);
// const arrayBuffer = videoURL.arrayBuffer();
// console.log('ArrayBuffer: ', arrayBuffer);
// const audioBuffer = audioContext.decodeAudioData(arrayBuffer);
// console.log('AudioBuffer: ', arrayBuffer);
// const audioData = audioBuffer.getChannelData(0);
// console.log('Audiodata: ', audioData);

// const frequency = detectPitch(audioData); // when we use this, make sure it's not null because it returns null if it can't detect the pitch
// console.log('frequency: ', frequency);
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

/* const halfStepsBelowMiddleC = Math.round(12.0 * Math.log2(testing[i] / c0));
  const octave = Math.floor(halfStepsBelowMiddleC / 12.0);
  const key = keys[Math.floor(halfStepsBelowMiddleC % 12)];
  notestring.concat(notestring, key.toString());
  notestring.concat(notestring, octave.toString());
  notestring.concat(notestring, ',');
  console.log('octave: ', octave, 'key: ', key); */
