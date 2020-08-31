/* eslint-disable new-cap */
import Vex from 'vexflow';

// IMPORTANT!! - define the id of the div where the staff will be drawn in your render method!
const drawStaff = (clef, notes, divId) => {
  if (notes != null && (clef === 'treble' || clef === 'bass')) {
    const vexnotes = notes.join(', '); // convert user's notes into string that can be rendered by vexflow
    const vf = new Vex.Flow.Factory({
      renderer: { elementId: divId, width: 500, height: 170 },
    });

    const score = vf.EasyScore();
    const system = vf.System();
    let stemDirection = 'up';
    if (clef === 'treble') {
      stemDirection = 'up';
    } else if (clef === 'bass') {
      stemDirection = 'down';
    }

    system.addStave({
      voices: [
        score.voice(score.notes(vexnotes, { stem: stemDirection })),
      ],
    }).addClef(clef).addTimeSignature('4/4'); // default is 4/4 time, but we can change that and pass it in as a variable if needed!
    console.log('drawing');
    vf.draw();
  }
};

export default drawStaff;
