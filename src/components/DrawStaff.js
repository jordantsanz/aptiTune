/* eslint-disable new-cap */
import Vex from 'vexflow';

// IMPORTANT!! - define the id of the div where the staff will be drawn in your render method!
const drawStaff = (clef, notes, divId) => {
  console.log('DRAWSTAFF CALLED');
  if (notes != null && (clef === 'treble' || clef === 'bass')) {
    const vexnotes = notes.join(', '); // convert user's notes into string that can be rendered by vexflow
    const vf = new Vex.Flow.Factory({
      renderer: { elementId: divId, width: 500, height: 170 },
    });

    const score = vf.EasyScore();
    const system = vf.System();
    if (clef === 'treble') {
      system.addStave({
        voices: [
          score.voice(score.notes(vexnotes, { stem: 'up' })),
        ],
      }).addClef(clef).addTimeSignature('4/4');
    } else if (clef === 'bass') {
      system.addStave({
        voices: [
          score.voice(score.notes(vexnotes, { clef: 'bass', stem: 'up' })),
        ],
      }).addClef(clef).addTimeSignature('4/4');
    }
    console.log('drawing');
    vf.draw();
  }
};

export default drawStaff;
