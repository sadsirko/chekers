'use strict'

document.addEventListener("mousemove", mouseMoveHandlerY, false);
document.addEventListener("mousemove", mouseMoveHandlerX, false);
document.addEventListener("mousedown", mousedown, false);
document.addEventListener("mouseup", mouseup, false);

const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
// desk cells 
let cell = { };
 cell.height = 60;
 cell.width = 60;
 let black = [];
 let white = [];
 let click = false;
 let Xmouse ;
 let Ymouse ;

//for desk cells
function draw_desk_cells(x,y){
ctx.beginPath();
//ctx.rect( cell.x, cell.y, cell.width, cell.height)
ctx.rect( x, y, cell.height, cell.width)
ctx.fillStyle = "#e7ecfb";
ctx.fill();
ctx.closePath();
}
//draw cheker
function drawcheker_b(x,y) {
  ctx.beginPath();
  ctx.arc( x, y, 25, 0, Math.PI*2, false);
  ctx.fillStyle = 'black';
  ctx.fill();
  ctx.closePath();
}
function drawcheker_w(x,y) {
  ctx.beginPath();
  ctx.arc( x, y, 25, 0, Math.PI*2, false);
  ctx.fillStyle = 'white';
  ctx.fill();
  ctx.closePath();
}
// we use desk cells to paint desk 
function draw_desk( ){
for(let x_cell = 0; x_cell < canvas.width; x_cell += 2 * cell.width ){
	for(let y_cell = 0; y_cell < canvas.height; y_cell += 2 * cell.height){
		draw_desk_cells(x_cell, y_cell);
		draw_desk_cells(x_cell + cell.height ,y_cell + cell.width);
	}
}
}
// black chekers
function draw_b_chekers_first(){
for(let num  = 0; num < 3; num ++ ){
	black[num] = [];
        for(let n  = 0; n < 4; n ++ ){        	 
             if( num != 1 ) black [num][n] = { x : 90 + n * 120, y : 30 + num * 60  };
             else black [num][n] = { x : 30 + n * 120, y : 30 + num * 60  }    
        drawcheker_b(black[num][n].x,black[num][n].y);
        }	
}
}

function draw_w_chekers_first(){
for(let num  = 0; num < 3; num ++ ){
	white[num] = [];
        for(let n  = 0; n < 4; n ++ ){        	 
             if( num == 1 ) white [num][n] = { x : 90 + n * 120, y : 330 + num * 60  };
             else white [num][n] = { x : 30 + n * 120, y : 330 + num * 60  }    
        drawcheker_w(white[num][n].x,white[num][n].y);
        }	
}
}
function draw_chekers(){
for(let num  = 0; num < 3; num ++ ){
        for(let n  = 0; n < 4; n ++ ){        	 
        drawcheker_w(white[num][n].x,white[num][n].y);
        drawcheker_b(black[num][n].x,black[num][n].y);
        }	
}
}
function mouseMoveHandlerX(e) {
  let relativeX = e.clientX - canvas.offsetLeft;
  //console.log("X + "relativeX)
//console.log(" X " + relativeX);
Xmouse = relativeX;
}
function mouseMoveHandlerY(e) {
  let relativeY = e.clientY - canvas.offsetLeft;
 // console.log(" Y " + relativeY);
  Ymouse = relativeY;
1
}
function mousedown(e) {
  click = true;
}
function mouseup(e) {
  click = false;
}
draw_b_chekers_first();
draw_w_chekers_first();
function draw(){

 ctx.clearRect(0, 0, canvas.width, canvas.height);
    draw_chekers();
	draw_desk();
	 
if(click ) console.log(" lakhfldkajhlksfdjhgladjaglkdjfh " + Xmouse + " " + Ymouse );

}

setInterval(draw, 10);

