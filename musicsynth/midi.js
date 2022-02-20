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

})

};
alert("file loaded!");
console.log(notes)
reader.readAsArrayBuffer(file);
}

document.getElementById("filereader")
					.addEventListener("change", (e) => {
						//get the files
						const files = e.target.files;
						if (files.length > 0) {
							const file = files[0];
							//document.querySelector("#FileDrop #Text").textContent = file.name;
							parseFile(file);
						}
					});