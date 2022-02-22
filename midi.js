currentMidi = null;
var notes = [];

function parseFile(file) {
//read the file
const reader = new FileReader();
reader.onload = function (e) {
const midi = new Midi(e.target.result);
//document.getElementById("out").innerHTML = JSON.stringify(midi, undefined, 2);
currentMidi = midi;

//create an array
midi.tracks.forEach((t)=>{
  data = t.notes;
  data.forEach((n)=>{
    notes.push({
      pitch : n.midi,
      volume : n.velocity,
      start : n.time,
      duration : n.duration
    });
});
});
//sort notes by start time
quicksort(0,notes.length-1);
};
console.log(currentMidi)
reader.readAsArrayBuffer(file);
}

function exchange(i,j){
  var temp = notes[i];
  notes[i] = notes[j];
  notes[j] = temp;
}

function quicksort(low,high){
  var i = low, j = high;
        // Get the pivot element from the middle of the list
        var pivot = notes[Math.floor(low + (high-low)/2)].start;

        // Divide into two lists
        while (i <= j) {
            // If the current value from the left list is smaller than the pivot
            // element then get the next element from the left list
            while (notes[i].start < pivot) {
                i++;
            }
            // If the current value from the right list is larger than the pivot
            // element then get the next element from the right list
            while (notes[j].start > pivot) {
                j--;
            }

            // If we have found a value in the left list which is larger than
            // the pivot element and if we have found a value in the right list
            // which is smaller than the pivot element then we exchange the
            // values.
            // As we are done we can increase i and j
            if (i <= j) {
                exchange(i, j);
                i++;
                j--;
            }
        }
        // Recursion
        if (low < j){
            quicksort(low, j);}
        if (i < high){
            quicksort(i, high);}
}

//read custom file
document.getElementById("filereader")
					.addEventListener("change", (e) => {
						//get the files
						const files = e.target.files;
						if (files.length > 0) {
							const file = files[0];
							parseFile(file);
						}
					});

//read a default file
//sample song from: https://www.youtube.com/channel/UCVSJyQ0r1U4QNPzVaki30dQ
document.getElementById("samplesong")
					.addEventListener("click", (e) => {
						//get the files
            var xmlhttp = new XMLHttpRequest();
            var url = "sampleSong.txt";

            xmlhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    var midi = JSON.parse(this.responseText);
                    currentMidi = midi;//transfer midi data to currentMidi
                    //create an array
                    currentMidi.tracks.forEach((t)=>{
                      data = t.notes;
                      data.forEach((n)=>{
                        notes.push({
                          pitch : n.midi,
                          volume : n.velocity,
                          start : n.time,
                          duration : n.duration
                        });
                    });
                    });
                    //sort notes by start time
                    quicksort(0,notes.length-1);
                }
            };
            xmlhttp.open("GET", url, false);
            xmlhttp.send();
					});

//play music + event listener
const synths = [];
  document
    .getElementById("start")
    .addEventListener("click", (e) => {
	if (currentMidi) {
        const now = Tone.now() + 1.5;//delayed start
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
