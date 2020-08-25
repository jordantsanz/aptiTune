const currentNote = 0; // current note to check
let measureBeats = 0; // beats in a measure
const singleMeasure = [];
const tieArray = [];
const measuresArray = [];

while (currentNote < notes.length) {
  let inARow = 1; // number of same note in a row
  let nextNote = currentNote + 1; // next note to check
  measureBeats += 1; // beats in a measure
  const measureFilled = false; // if a measure is filled

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
singleMeeasure = [];

done = true;

createSheetMusic = async (measuresArray, tieArray) => {
  VF = Vex.Flow;

  // Create an SVG renderer and attach it to the DIV element named "boo".
  const div = document.getElementById('staff');
  const renderer = new VF.Renderer(div, VF.Renderer.Backends.SVG);

  // Size our SVG:
  renderer.resize(500, 500);

  // And get a drawing context:
  const context = renderer.getContext();
  var ctx = new contextBuilder(options.elementId, 400, 300);

  // Create a stave at position 10, 40 of width 400 on the canvas.
  const stave = new VF.Stave(10, 40, 400);
  stave.setContext(context);
  stave.draw();

  // Add a clef and time signature.
  stave.addClef('treble').addTimeSignature('4/4');

  var voice = new VF.Voice({num_beats: 4,  beat_value: 4});
  voice.addTickables(measuresArray[0]);
  var formatter = new VF.Formatter().joinVoices([voice]).format([voice], 400);
  voice.draw(context, stave);
  

  // if we have more measures:
  for (let measureIndex = 1; measureIndex < measuresArray.length; measureIndex += 1){
    var newstave = new VF.Stave(10, 40, 300);
    newstave.setContext(context).draw();

    var voice = new VF.Voice({num_beats: 4,  beat_value: 4});
    voice.addTickables(measuresArray[measureIndex]);
    var formatter = new VF.Formatter().joinVoices([voice]).format([voice], 300);
    voice.draw(context, newstave);
    var connector = new VF.StaveConnector(stave, stave2);
    connector.setContext(context);

    connector.draw();
    line.setType(VF.StaveConnector.type.SINGLE);
    line.draw();
    // ties.forEach(function(t) {t.setContext(context).draw()})
    stave1 = newstave;
    newstave = '';
  }

  https://github.com/0xfe/vexflow/blob/master/tests/staveconnector_tests.js

};
