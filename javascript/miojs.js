
    (function() {
    var win = window,
        doc = document,
        w = win.innerWidth,
        h = win.innerHeight,
        container = doc.getElementById('container'),
        canvas = doc.getElementById('canvas');
    
    if( win.navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/i) ) {
      canvas.height = h;
      canvas.width  = w;
      container.style.height = h+"px";
      container.style.width = w+"px";
    }
  })();
 var requestAnimFrame = (function(){
         return window.requestAnimationFrame       || 
         window.webkitRequestAnimationFrame || 
         window.mozRequestAnimationFrame    || 
         window.oRequestAnimationFrame      || 
         window.msRequestAnimationFrame     || 
         function( callback ){
           window.setTimeout(callback, 1000 / 60);
         };
    })();

var canvas = document.getElementById("canvas");
var c = canvas.getContext("2d");
var N=3;
document.getElementById("Num").value=3;
var lineWidth = 4;
var gravity = 0;
var dampening = 1;
var animate = false;
var sommaraggi=0, M,dX,dY,distance;
var delta;
var Xdistance=0;
var Ydistance=0;
var rho=0.001;
var v1t,v1n,v2t,v2n, nx,ny,v1fn,v2fn;
var mouse = {
  x : 0, 
  y : 0,
  down: false
};
/**/
class ball{
    constructor()
    {
            // massa inferiore 10 e massima 210
            this.mass=10+200*Math.random();
            this.radius=5+50*Math.random();
            //crea una posizione casuale nel canvas
            this.x=this.radius+(canvas.width-2*this.radius)*Math.random();
            this.y=this.radius+(canvas.height-2*this.radius)*Math.random();
            this.vx= (2*Math.random()-1)*5;
            this.vy= (2*Math.random()-1)*5;
            this.colore='rgb('+(255*Math.random()).toString()+','+(255*Math.random()).toString()+','+(255*Math.random()).toString()+')';
    }
    drawBall(cont)
    {
          cont.beginPath();
          cont.arc(this.x, this.y, this.radius - lineWidth/2, 0 , 2 * Math.PI, false);
          cont.fillStyle = this.colore;
          cont.fill();
          cont.lineWidth = 4;
          cont.strokeStyle = 'black';
          cont.stroke();

    }


}
var Balls=[];
for(i=0;i<N;i++)Balls.push(new ball());
var energy=0;
var print=document.getElementById("print");
function executeFrame(){
  if(animate)
    requestAnimFrame(executeFrame);
  incrementSimulation();
  c.clearRect(0, 0, canvas.width, canvas.height);
  drawBox();
  energy=0;
  for(i=0;i<N;i++){ Balls[i].drawBall(c); energy+=0.5*Balls[i].mass*(Balls[i].vx*Balls[i].vx +Balls[i].vy*Balls[i].vy);}
  print.innerHTML=energy.toString();
}

function incrementSimulation(){

  
for(i=0;i<N;i++)
{
    // Execute gravity
    Balls[i].vy+=gravity;
    //Execute dampening (slowing down)
    Balls[i].vx *= dampening;
    Balls[i].vy *= dampening;
    //Increment the position by the velocity
    Balls[i].x +=  Balls[i].vx;
    Balls[i].y +=  Balls[i].vy;
    
    //Bounce off the floor
    if( Balls[i].y +  Balls[i].radius > canvas.height){
         Balls[i].y = canvas.height - Balls[i].radius;
         Balls[i].vy = -  Balls[i].vy;
    } 
    //Bounce off the ceiling
    if(Balls[i].y - Balls[i].radius < 0){
        Balls[i].y = Balls[i].radius;
        Balls[i].vy = -Balls[i].vy;
     }
    //Bounce off the right wall
    if(Balls[i].x + Balls[i].radius > canvas.width){
        Balls[i].x = canvas.width - Balls[i].radius;
        Balls[i].vx = - Balls[i].vx;
    }
   //Bounce off the left wall
   if(Balls[i].x - Balls[i].radius < 0){
    Balls[i].x = Balls[i].radius;
    Balls[i].vx = -Balls[i].vx;
   }
    //Bounce other ball
    for(j=0;j<i; j++)
    {
        M=Balls[i].mass+Balls[j].mass;
        sommaraggi= Balls[i].radius + Balls[j].radius;
        dX = (Balls[i].x - Balls[j].x);
        dY = (Balls[i].y - Balls[j].y);
        distance=Math.sqrt(dX*dX+dY*dY);
        nx=dX/distance;
        ny=dY/distance;
        if(distance<=sommaraggi){
            delta=(sommaraggi-distance)/(Balls[i].mass+Balls[j].mass);
            Balls[i].x+=nx*delta*Balls[j].mass;
            Balls[i].y+=ny*delta*Balls[j].mass;
            Balls[j].x-=nx*delta*Balls[i].mass;
            Balls[j].y-=ny*delta*Balls[i].mass;
            v1t=-Balls[i].vx*ny+Balls[i].vy*nx;
            v1n=Balls[i].vx*nx+Balls[i].vy*ny;
            v2t=-Balls[j].vx*ny+Balls[j].vy*nx;
            v2n=Balls[j].vx*nx+Balls[j].vy*ny;
            v1fn=((Balls[i].mass-Balls[j].mass)*v1n +2*Balls[j].mass*v2n)/M;
            v2fn=(2*Balls[i].mass* v1n-(Balls[i].mass-Balls[j].mass)*v2n)/M;
            Balls[i].vx=-v1t*ny+v1fn*nx;
            Balls[i].vy=v1t*nx+v1fn*ny;
            Balls[j].vx=-v2t*ny+v2fn*nx;
            Balls[j].vy=v2t*nx+v2fn*ny;
        }
    }







}


  








}

function drawBox(){
  c.lineWidth = 1;
  c.strokeRect(0.5, 0.5, canvas.width - 1, canvas.height - 1);
}

canvas.addEventListener('mouseup', function(e){
  mouse.down = false;
});

// Start animating when the mouse enters the canvas
canvas.addEventListener('mouseover', function(e){
  animate = true;
  executeFrame();
});

// Stop animating when the mouse exits the canvas
canvas.addEventListener('mouseout', function(e){
  mouse.down = false;
  animate = false;
});

function changeN()
{
N=document.getElementById("Num").value;
Balls=[];
for(i=0;i<N;i++)Balls.push(new ball());
executeFrame();
}

// Draw the initial scene once, so something
// is displayed before animation starts.
executeFrame();

