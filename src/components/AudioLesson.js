// make a visualized staff with array of notes input
// hold onto that array as the answer array

// ask user for input
// record audio
// filter out to four distinct pitches that are relatively believable
// check the four against the array as well as visualize the four
// rhythm not a factor

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
import ErrorNotification from './errorMessage';

const Pitchfinder = require('pitchfinder');

const videoType = 'video/webm';

class AudioLesson extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recording: false,
      videos: [],
      tempo: 60,
      quantization: 2,
      duration: '',
      measures: '',
      answer: ['A3/q', 'B3/q', 'C4/q', 'D4/q'],
      firstRender: true,
    };
  }

  async componentDidMount() {
    // get answers from database, set state !!!!!
    const stream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
    // show it to user
    this.video.srcObject = stream;
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
    if (this.state.firstRender) {
    // Correct notes:
      this.drawSheetMusic(this.state.answer, 'staff2');
      this.setState({
        firstRender: false,
      });
    }
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
                this.setState({ duration: audioBuffer.duration });
                console.log(this.state.duration);
                const audioData = audioBuffer.getChannelData(0);
                console.log(audioData);
                const detectPitch = new Pitchfinder.YIN();
                const testing = frequencies(detectPitch, audioData, {
                  tempo: this.state.tempo, // in BPM, defaults to 120
                  quantization: 2, // samples per beat, defaults to 4 (i.e. 16th notes)
                  sampleRate: 44100,
                });
                let measure = this.state.duraiton * this.state.tempo;
                measure /= (this.state.quantization * 4);
                this.setState({
                  measure,
                });
                console.log(this.state.measure);
                console.log(testing);
                const keys = ['c', 'c#', 'd', 'd#', 'e', 'f', 'f#', 'g', 'g#', 'a', 'a#', 'b'];
                const c0 = 440.0 * Math.pow(2.0, -4.75);
                let i;
                let oldnote = null;

                // musical math; creds to https://stackoverflow.com/questions/41174545/pitch-detection-node-js?rq=1 for the actual math
                // eslint-disable-next-line no-plusplus
                for (i = 0; i < testing.length; i++) {
                  const halfStepsBelowMiddleC = Math.round(12.0 * Math.log2(testing[i] / c0));
                  const octave = Math.floor(halfStepsBelowMiddleC / 12.0);
                  const key = keys[Math.floor(halfStepsBelowMiddleC % 12)];
                  if (octave >= 2 <= 4) {
                    if (testing[i] != null && octave != 10 && octave != -Infinity && key != null) {
                      const note = key.toString().toUpperCase() + octave.toString() + '/q';
                      if (note != oldnote) {
                        notes.push(note);
                      }
                      oldnote = note;
                      console.log('octave: ', octave, 'key: ', key);
                    }
                  }
                }
                done = true;
              });
          });
      });
    console.log(done);
    console.log('notes: ', notes);
    while (!done) {
      // eslint-disable-next-line no-await-in-loop
      await this.timeout(1000);
    }

    // const answer = ['A3/q', 'B3/q', 'C4/q', 'D4/q'];
    // visualize
    // check
    let correct = true;
    let j = 0;
    let k = 0;
    while (this.state.answer.length != j - 1) {
      if (this.state.answer[j] === notes[k]) {
        j += 1;
        k += 1;
      } else {
        correct = false;
        break;
      }
    }
    console.log('!!!correct: ', correct);
    console.log('answer: ', this.state.answer);
    console.log('notes: ', notes);
    // User's notes:
    this.createSheetMusic(notes, 'staff1');
  }

  drawSheetMusic = (notes, divId) => {
    const vexnotes = notes.join(', '); // convert user's notes into string that can be rendered by vexflow
    const vf = new Vex.Flow.Factory({
      renderer: { elementId: divId, width: 500, height: 200 },
    });

    const score = vf.EasyScore();
    const system = vf.System();

    system.addStave({
      voices: [
        score.voice(score.notes(vexnotes, { stem: 'up' })),
      ],
    }).addClef('treble').addTimeSignature('4/4');

    vf.draw();
  };

  createSheetMusic = async (notes, divId) => {
    if (notes.length == this.state.answer.length) {
      const vexnotes = notes.join(', '); // convert user's notes into string that can be rendered by vexflow
      const vf = new Vex.Flow.Factory({
        renderer: { elementId: divId, width: 500, height: 200 },
      });

      const score = vf.EasyScore();
      const system = vf.System();
      console.log('help');

      system.addStave({
        voices: [
          score.voice(score.notes(vexnotes, { stem: 'up' })),
        ],
      }).addClef('treble').addTimeSignature('4/4');

      vf.draw();
    } else {
      console.log('We found ' + notes.length.toString() + 'notes. We should just find four! Try again.');
      // ideally, we would have a modal pop up displaying the error that the user can close
    }

    /*
    // Create an SVG renderer and attach it to the DIV element named "boo".
    const div = document.getElementById('staff');
    const renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);

    // Size our SVG:
    renderer.resize(500, 150);

    // And get a drawing context:
    const context = renderer.getContext();
    // Create a stave at position 10, 40 of width 400 on the canvas.
    const stave = new VF.Stave(10, 40, 400);
    stave.setContext(context);

    // Add a clef and time signature.
    stave.addClef('treble').addTimeSignature('4/4');
    stave.draw();
    const voice = new VF.Voice({ num_beats: 4, beat_value: 4 });
    voice.addTickables(notes);
    const formatter = new VF.Formatter().joinVoices([voice]).format([voice], 400);
    voice.draw(context, stave); */
  };

  render() {
    const { recording } = this.state;
    return (
      <div className="audiowriting-main">
        <ErrorNotification />
        <NavBar />
        <div className="audiowriting-content">
          <div className="writing-header">
            Try to sing this score!
          </div>
          <input className="input" id="tempo" placeholder="input tempo here (ex. 110) -- default is 60" onChange={this.setTempo} />
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
        </div>
      </div>
    );
  }
}

export default AudioLesson;

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
