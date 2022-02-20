var x = 0;//0-100% of the screen width
var y = 0;
var angle = 0;//0-360 degrees



document.getElementById("obs").style.left=x+"%";
         document.getElementById("obs").style.top=y+"%";
         document.getElementById("obs").style.transform="translate(-50%,-50%) rotate("+angle+"deg)";