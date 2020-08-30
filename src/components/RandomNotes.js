const randomNotes = () => {
  // gnerate four random notes!
  const keys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  // const keys2 = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

  // generate four numbers randomly between 0 & 11 (12 tones)
  const notesArray = [];
  for (let i = 0; i < 4; i += 1) {
    const j = Math.floor(Math.random() * 12); // change 12 to 7 if we don't want sharps
    const note = `${keys[j]}/q`;
    notesArray.push(note);
  }

  return notesArray;
};

export default randomNotes;
