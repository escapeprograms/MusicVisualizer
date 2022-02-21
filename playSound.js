function play(){
const synths = [];
  document
    .querySelector("tone-play-toggle")
    .addEventListener("play", (e) => {
      const playing = e.detail;
      if (playing && currentMidi) {
        const now = Tone.now() + 0.5;
        currentMidi.tracks.forEach((track) => {
          //create a synth for each track
          const synth = new Tone.PolySynth(Tone.Synth, {
            envelope: {
              attack: 0.02,
              decay: 0.1,
              sustain: 0.3,
              release: 1,
            },
          }).toDestination();
          synths.push(synth);
          //schedule all of the events
          track.notes.forEach((note) => {
            synth.triggerAttackRelease(
              note.name,
              note.duration,
              note.time + now,
              note.velocity
            );
          });
        });
      } else {
        //dispose the synth and make a new one
        while (synths.length) {
          const synth = synths.shift();
          synth.disconnect();
        }
      }
    });
}