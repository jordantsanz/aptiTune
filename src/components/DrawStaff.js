/* eslint-disable new-cap */
import Vex from 'vexflow';

// IMPORTANT!! - define the id of the div where the staff will be drawn!
const drawStaff = (notes, divId) => {
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
  }).addClef('treble').addTimeSignature('4/4'); // default is treble clef & 4/4 time, but we can change that and pass it in as a variable if needed!
  console.log('drawing');
  vf.draw();
};

export default drawStaff;
