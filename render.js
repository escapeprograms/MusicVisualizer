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
effect:string value (fall, shrink)
duration:int value (seconds)
}]
*/
var shapes = [];
var ctx = document.getElementById('canvas').getContext('2d');
ctx.canvas.width = window.innerWidth;
ctx.canvas.height = window.innerHeight;
ctx.fillStyle = 'rgba(0, 0, 0, 1)';
ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height); // background
var t = 0;
var fps = 50;

function run(){
//close menus
document.getElementsByClassName("main")[0].style="display:none;";

//reset shapes and time
t = 0;
shapes = [];
//turn notes into shapes
for (let i = 0; i<notes.length; i++) {
  var volume = notes[i].volume;
	var pitch = notes[i].pitch;
  var duration = notes[i].duration;

  var type;
	var color;
  var effect;
  var x;
  var y;
  var dur;
  var size = volume*30+duration*10;
	if (duration <0.4) { 
    type="triangle"; 
    effect= "none";
    dur = 0.4;
  }
  else if (duration<1) {
	    type="circle"; 
	    effect= "fall";
      dur = duration+0.3;
	  }
  	else { 
	    type="square"; 
	    effect= "shrink";
      dur = duration+0.5;
  	}

  if (pitch % 8 == 0) {
    color="white";
  }
	else if (pitch%8==1){
		color="255, 0, 0";
	}
	else if (pitch%8==2){
		color="255, 165, 0";
    type="circle";
	}
	else if (pitch%8==3){
		color="255, 255, 0";
	}
	else if (pitch%8==4){
		color="0, 255, 0";
	}
	else if (pitch%8==5){
		color="0, 0, 255";
	}
	else if (pitch%8==6){
		color="160, 32, 240";
	}
  else if (pitch%8==7){
		color="200, 0, 255";
    type="circle";
	}
  x = (volume*0.5)+(pitch%12)/24-Math.random()/10;//between 0 and 1
	y = pitch/128-Math.random()/10;//between 0 and 1
  

  shapes.push({
    shape:type,
    x:x*ctx.canvas.width,
    y:y*ctx.canvas.height,
    dy:0,
    size:size,
    color:color,
    effect:effect,
    duration:dur,
    opa:1
  });
}
//wait 0.5 sec for song to load
setTimeout(()=>{runAnimation()},500);

//animation loop
function runAnimation(){
var animation = setInterval(()=>{
    //background
  ctx.fillStyle = 'rgba(0, 0, 0, 1)';
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height); // clear canvas

  for (var i = 0; i < Math.min(15,notes.length); i++){//only process x shapes at a time
    var s = shapes[i];
    //terminate shapes
    if (t<notes[i].start) {
      continue;
    }else if (t>notes[i].start+s.duration) {
      //console.log("deleting note "+i+"at time "+t);
      notes = notes.slice(0,i).concat(notes.slice(i+1));//delete one specific element
      shapes = shapes.slice(0,i).concat(shapes.slice(i+1));
      i--;
      continue;
    }
    //apply effects
    if (s.effect=="fall"){//fall
      s.y+=s.dy/fps;
      s.dy+=1000/fps;
    }
    if (s.effect=="shrink"&&t>notes[i].start+s.duration-1){//shrink
      s.size*=1-(0.7/fps);
    }

    if ((t-notes[i].start)/s.duration>0.8){//fade (all objects)
      s.opa-=5/fps;
      if (s.opa<0) s.opa = 0
    }
    //draw shapes
    ctx.fillStyle = "rgba("+s.color+","+s.opa+")"
    //console.log("rgba("+s.color+","+s.opa+")")
      switch (s.shape) {
        case "triangle"://triangles
          ctx.beginPath();
          ctx.moveTo(s.x, s.y-s.size);
          ctx.lineTo(s.x+0.86*s.size, s.y+s.size/2);
          ctx.lineTo(s.x-0.86*s.size, s.y+s.size/2);
          ctx.fill();
          break;
        case "square"://squares
          ctx.fillRect(s.x-s.size,s.y-s.size,s.size*2,s.size*2);
          break;
        default://circles
          ctx.beginPath();
          ctx.arc(s.x, s.y, s.size, 0, 2 * Math.PI);
          ctx.fill();
          break;
      }
  }
  //update time (s) + terminate loop
  t+=1/fps;
  if (notes.length==0){
    clearInterval(animation);
    document.getElementsByClassName("main")[0].style="display:block;";
    currentMidi = null;
  }
},1000/fps);
}
}
