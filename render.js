/*notes = [{
pitch:x (keyboard key #1-88),
volume:y (0-1),
start:z (time in s),
duration:t (time in s)
}]*/

/*
shapes = [{
x:int value (%)
y:int value (%)
shape:string value (triangle, circle, square)
size: int value
color: [r,g,b]
effect:string value (fade,fall,pop)
duration:int value (seconds)
}]
*/
var shapes = [];
var ctx = document.getElementById('canvas').getContext('2d');
ctx.canvas.width  = window.innerWidth;
ctx.canvas.height = window.innerHeight * 0.8;
var t = 0;

function run(){
play();
  //turn notes into shapes
for (let i = 0; i<notes.length; i++) {
  var size = notes[i].volume*2 + notes[i].pitch;
	var pitch = notes[i].pitch;
  var duration = notes[i].duration;

  var type;
	var color;
  var effect;
  var x;
  var y;
  var dur = duration;
	if (duration <0.3) { 
    type="triangle"; 
    effect= "fade";
    size= 14;
  }
  else if (duration<1) {
	    type="circle"; 
	    effect= "fall";
      size= 25;
	  }
  	else { 
	    type="square"; 
	    effect= "pop";
      size= 45;
  	}

  if (pitch % 8 == 0) {
    color="white";
    type="circle";
  }
	else if (pitch%8==1){
		color="rgba(255, 0, 0 ,1)";
	}
	else if (pitch%8==2){
		color="rgba(255, 165, 0, 1)";
    type="circle";
	}
	else if (pitch%8==3){
		color="rgba(255, 255, 0 ,1)";
	}
	else if (pitch%8==4){
		color="rgba(0, 255, 0 ,1)";
	}
	else if (pitch%8==5){
		color="rgba(0, 0, 255,1)";
	}
	else if (pitch%8==6){
		color="rgba(160, 32, 240,1)";
	}
  else if (pitch%8==7){
		color="pink";
    type="circle";
	}
	x = 10*pitch+Math.random()*1000;
  y = Math.random()*800;

  shapes.push({
    shape:type,
    x:x,
    y:y,
    size:size,
    color:color,
    effect:effect,
    duration:0.5
  });
}


//animation loop

setInterval(()=>{
  for (var i = 0; i < shapes.length; i++){
    var s = shapes[i];
    if (t<notes[i].start) continue;
   // console.log(notes[i].)
   ctx.fillStyle = s.color;
    switch (s.shape) {
      case "triangle":
        ctx.beginPath();
        ctx.moveTo(s.x, s.y-s.size);
        ctx.lineTo(s.x+0.86*s.size, s.y+s.size/2);
        ctx.lineTo(s.x-0.86*s.size, s.y+s.size/2);
        ctx.fill();
        break;
      case "square":
        ctx.fillRect(s.x-s.size,s.y-s.size,s.size*2,s.size*2);
        break;
      default://circles
        ctx.beginPath();
        ctx.arc(100, 75, 50, 0, 2 * Math.PI);
        ctx.fill();
        break;
    }
  }
  //background
  ctx.fillStyle = 'rgba(0, 0, 0, 1)';
  ctx.fillRect(0, 0, 3000, 3000); // clear canvas
  t+=20;
},20);
}
