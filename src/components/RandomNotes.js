const randomNotes = (clef) => {
  // gnerate four random notes!
  const treblekeys = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5', 'D5', 'E5', 'F5', 'G5', 'A5', 'B5', 'C6'];
  const basskeys = ['C2', 'D2', 'E2', 'F2', 'G2', 'A2', 'B2', 'C3', 'D3', 'E3', 'F3', 'G3', 'A3', 'B3', 'C4'];

  // generate four numbers randomly between 0 & 14 (15 tones)
  const notesArray = [];

  if (clef === 'treble') {
    for (let i = 0; i < 4; i += 1) {
      const j = Math.floor(Math.random() * 15);
      const note = `${treblekeys[j]}/q`;
      notesArray.push(note);
    }
  } else if (clef === 'bass') {
    for (let i = 0; i < 4; i += 1) {
      const j = Math.floor(Math.random() * 15);
      const note = `${basskeys[j]}/q`;
      notesArray.push(note);
    }
  } else {
    return null;
  }

  return notesArray;
};

export default randomNotes;
