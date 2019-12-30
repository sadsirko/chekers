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
 let zone = [];
 let choosen_cell_now = 0, choosen_cell_prev = null;
 let spec_arr = [];
//for desk cells

function mouseMoveHandlerX(e) {
  let relativeX = e.clientX - canvas.offsetLeft;
Xmouse = relativeX;
}


function mouseMoveHandlerY(e) {
  let relativeY = e.clientY - canvas.offsetLeft;
  Ymouse = relativeY;
}
function mousedown(e) {
  click = true;
}

function mouseup(e) {
  click = false;
}


function work_with_spec_arr(){
  let n = 1;
    for(let i = 0 ; i < 7; i++){
    spec_arr[i] = [];
   for (let j = 0; j < 8; j++) {
    spec_arr[i][j] = 0 ; 
    }
  }

  for(let j = 0 ; j < 4 ; j++)
  {
    for (let i= 0; i< 4;i++) {
      let a = 0 + i + j ;
      let b = 4 + i - j;
      spec_arr[a ][b] ={ num : n, choose : false , cheker : "null", x : 60 + 120 * i , y : 0 +  120 * j  } ;
     spec_arr[a ][b-1] = {num : n + 4 , choose : false , cheker : "null", x : 0 + 120 * i , y : 60 +  120 * j  } ;
      n++;
       } n += 4;
} 
}

function first_filling(){

  for(let j = 0 ; j < 4 ; j++)
  {
    for (let i = 0; i < 4; i++) {
      let a = 0 + i + j ;
      let b = 4 + i - j;
      if( spec_arr[a][b].num <= 12 ) spec_arr[a][b].cheker = 'b';
      if( spec_arr[a][b-1].num <= 12 ) spec_arr[a][b-1].cheker = 'b';
      if( spec_arr[a][b].num >=21 ) spec_arr[a][b].cheker = 'w';
      if( spec_arr[a][b-1].num >= 21 ) spec_arr[a][b-1].cheker = 'w';
      
}
}
}




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
/*function draw_b_chekers_first(){
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


/*function draw_chekers(){
for(let num  = 0; num < 3; num ++ ){
        for(let n  = 0; n < 4; n ++ ){           
        drawcheker_w(white[num][n].x,white[num][n].y);
        drawcheker_b(black[num][n].x,black[num][n].y);
        } 
}
}
*/
function draw_chekers(){
  for(let j = 0 ; j < 4 ; j++)
  {
    for (let i = 0; i < 4; i++) {
      let a = 0 + i + j ;
      let b = 4 + i - j;
      if( spec_arr[a][b].cheker == 'w' ) drawcheker_w(spec_arr[a][b].x + 30, spec_arr[a][b].y + 30) ;
      if( spec_arr[a][b - 1].cheker == 'w' ) drawcheker_w(spec_arr[a][b - 1].x + 30, spec_arr[a][b - 1].y + 30);
      if( spec_arr[a][b].cheker == 'b' ) drawcheker_b(spec_arr[a][b].x+ 30, spec_arr[a][b].y+ 30);
      if( spec_arr[a][b - 1].cheker == 'b' ) drawcheker_b(spec_arr[a][b-1].x+ 30, spec_arr[a][b - 1].y+ 30);     
}
}
}


function find_zones(){
  let num = 1;

for(let i  = 0; i < 8; i ++ ){
        for(let j  = 0; j < 4; j ++ ){           
        zone[num] = { };
        if(i % 2 == 0) zone[num] = { x : 60 + 120 * j, y : i * 60  };
        else zone[num] = {x :  120 * j, y : i * 60  };
        num++;
        } 
}
}


function find_choosed_cell(){
  let buffer;
if(click && Xmouse <= 480 && Ymouse <= 480 ){
  for(let i = 1 ; i < 33 ; i++){
    let a = Xmouse > zone[i].x;
    let b = Xmouse < zone[i].x + 60; 
    let c = Ymouse > zone[i].y;
    let d = Ymouse < zone[i].y + 60;
   if ( a && b & c && d && i != choosen_cell_now) {
   // zone[ i ].choose = true;
    choosen_cell_prev = choosen_cell_now;
    choosen_cell_now = i;
  }
  }
}
if(click && ( Xmouse >= 480 || Ymouse >= 480) ){
  choosen_cell_now = 0;
}
if(choosen_cell_now != buffer) buffer = choosen_cell_now;
}


function move_on_60(){
  if (choosen_cell_now - choosen_cell_prev == 4){

                         
  }
}


function find_choosed_cheker_on_board(nn)
{
  for(let j = 0 ; j < 4 ; j++)
    {
    for (let i = 0; i < 4; i++) 
      { 
        let a = 0 + i + j ;
      let b = 4 + i - j;
      if(spec_arr[a][b].num == nn) return spec_arr[a][b].cheker;
      if(spec_arr[a][b - 1].num == nn) return spec_arr[a][b - 1].cheker;
     } 
    }
}


//draw_b_chekers_first();
//draw_w_chekers_first();
find_zones();
work_with_spec_arr();
first_filling();
function draw(){
 ctx.clearRect(0, 0, canvas.width, canvas.height);
 draw_desk();
 draw_chekers();
 find_choosed_cell();   
if(click){
 console.log("now : " + choosen_cell_now);
 console.log("pre : " + choosen_cell_prev);
 console.log(find_choosed_cheker_on_board(choosen_cell_now));
 console.log(spec_arr);
}
}

//console.log(spec_arr[6][3] );
setInterval(draw, 100);
console.log(spec_arr);