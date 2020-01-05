'use strict';

document.addEventListener('mousemove', mouseMoveHandlerY, false);
document.addEventListener('mousemove', mouseMoveHandlerX, false);
document.addEventListener('mousedown', mousedown, false);
document.addEventListener('mouseup', mouseup, false);

const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
// desk cells
const cell = { };
cell.height = 60;
cell.width = 60;
const black = [];
const white = [];
let click = false;
let Xmouse;
let Ymouse;
const zone = [];
let choosen_cell_now = 0, choosen_cell_prev = 'null';
const spec_arr = [];
let flag = 1;
//for desk cells

function mouseMoveHandlerX(e) {
  const relativeX = e.clientX - canvas.offsetLeft;
  Xmouse = relativeX;
}


function mouseMoveHandlerY(e) {
  const relativeY = e.clientY - canvas.offsetLeft;
  Ymouse = relativeY;
}
function mousedown(e) {
  click = true;
}

function mouseup(e) {
  click = false;
}


function work_with_spec_arr() {
  let n = 1;
  for (let i = 0; i < 7; i++) {
    spec_arr[i] = [];
    for (let j = 0; j < 8; j++) {
      spec_arr[i][j] = 0;
    }
  }

  for (let j = 0; j < 4; j++) {
    for (let i = 0; i < 4; i++) {
      const a = 0 + i + j;
      const b = 4 + i - j;
      spec_arr[a ][b] = { num: n, choose: false, cheker: 'null', x: 60 + 120 * i, y: 0 +  120 * j  };
      spec_arr[a ][b - 1] = { num: n + 4, choose: false, cheker: 'null', x: 0 + 120 * i, y: 60 +  120 * j  };
      n++;
    } n += 4;
  }
}

//filling desk by chekers
function first_filling() {

  for (let j = 0; j < 4; j++) {
    for (let i = 0; i < 4; i++) {
      const a = 0 + i + j;
      const b = 4 + i - j;
      if (spec_arr[a][b].num <= 12) spec_arr[a][b].cheker = 'b';
      if (spec_arr[a][b - 1].num <= 12) spec_arr[a][b - 1].cheker = 'b';
      if (spec_arr[a][b].num >= 21) spec_arr[a][b].cheker = 'w';
      if (spec_arr[a][b - 1].num >= 21) spec_arr[a][b - 1].cheker = 'w';

    }
  }
}




function draw_desk_cells(x, y) {
  ctx.beginPath();
  //ctx.rect( cell.x, cell.y, cell.width, cell.height)
  ctx.rect(x, y, cell.height, cell.width);
  ctx.fillStyle = '#e7ecfb';
  ctx.fill();
  ctx.closePath();
}
//draw cheker


function drawcheker_b(x, y) {
  ctx.beginPath();
  ctx.arc(x, y, 25, 0, Math.PI * 2, false);
  ctx.fillStyle = 'black';
  ctx.fill();
  ctx.closePath();
}


function drawcheker_w(x, y) {
  ctx.beginPath();
  ctx.arc(x, y, 25, 0, Math.PI * 2, false);
  ctx.fillStyle = 'white';
  ctx.fill();
  ctx.closePath();
}

// we use desk cells to paint desk
function draw_desk() {
  for (let x_cell = 0; x_cell < canvas.width; x_cell += 2 * cell.width) {
    for (let y_cell = 0; y_cell < canvas.height; y_cell += 2 * cell.height) {
      draw_desk_cells(x_cell, y_cell);
      draw_desk_cells(x_cell + cell.height, y_cell + cell.width);
    }
  }
}


function draw_chekers() {
  for (let j = 0; j < 4; j++) {
    for (let i = 0; i < 4; i++) {
      const a = 0 + i + j;
      const b = 4 + i - j;
      if (spec_arr[a][b].cheker == 'w') drawcheker_w(spec_arr[a][b].x + 30, spec_arr[a][b].y + 30);
      if (spec_arr[a][b - 1].cheker == 'w') drawcheker_w(spec_arr[a][b - 1].x + 30, spec_arr[a][b - 1].y + 30);
      if (spec_arr[a][b].cheker == 'b') drawcheker_b(spec_arr[a][b].x + 30, spec_arr[a][b].y + 30);
      if (spec_arr[a][b - 1].cheker == 'b') drawcheker_b(spec_arr[a][b - 1].x + 30, spec_arr[a][b - 1].y + 30);
    }
  }
}

// find zones coordinates
function find_zones() {
  let num = 1;

  for (let i  = 0; i < 8; i++) {
    for (let j  = 0; j < 4; j++) {
      zone[num] = { };
      if (i % 2 == 0) zone[num] = { x: 60 + 120 * j, y: i * 60  };
      else zone[num] = { x:  120 * j, y: i * 60  };
      num++;
    }
  }
}


function find_choosed_cell() {
  let buffer;
  if (click && Xmouse <= 480 && Ymouse <= 480) {
    for (let i = 1; i < 33; i++) {
      const a = Xmouse > zone[i].x;
      const b = Xmouse < zone[i].x + 60;
      const c = Ymouse > zone[i].y;
      const d = Ymouse < zone[i].y + 60;
      if (a && b & c && d && i != choosen_cell_now) {
        // zone[ i ].choose = true;
        choosen_cell_prev = choosen_cell_now;
        choosen_cell_now = i;
      }
    }
  }
  if (click && (Xmouse >= 480 || Ymouse >= 480)) {
    choosen_cell_now = 0;
  }
  if (choosen_cell_now != buffer) buffer = choosen_cell_now;
}


function move_w(now, pre) {
  const c = rules_1(now, pre, 'white');
  const a = find_spec_ar(now).cheker;
  const b = find_spec_ar(pre).cheker;
  const d = rules_2(now, pre);
  const e = rules_3('b');
  if (b == 'w' && a == 'null' && c && !e) {
    find_spec_ar(now).cheker = 'w';
    find_spec_ar(pre).cheker = 'null';
  }
  if (b == 'w' && a == 'null'  && d && !e) {
    rules_2(now,pre).cheker = 'null';
    find_spec_ar(now).cheker = 'w';
    find_spec_ar(pre).cheker = 'null';
  // flag++;
  }
   if( e && e == d) {
     rules_2(now,pre).cheker = 'null';
     find_spec_ar(now).cheker = 'w';
     find_spec_ar(pre).cheker = 'null';
      }

}



function move_b(now, pre) {
  const a = find_spec_ar(now).cheker;
  const b = find_spec_ar(pre).cheker;
  const c = rules_1(now, pre, 'black');
  const d = rules_2(now, pre);
  const e = rules_3('w');

  if (a == 'null' && b == 'b' &&  c && !e) {
    find_spec_ar(now).cheker = 'b';
    find_spec_ar(pre).cheker = 'null';
  }

  if (a == 'null' && b == 'b' && d && !e) {
    //    console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
    rules_2(now,pre).cheker = 'null';
    find_spec_ar(now).cheker = 'b';
    find_spec_ar(pre).cheker = 'null';
   // flag--;
  }
   if(e && e == d) {
     rules_2(now,pre).cheker = 'null';
     find_spec_ar(now).cheker = 'b';
     find_spec_ar(pre).cheker = 'null';
      }

}

// similar move
function rules_1(now, pre, color) {
  let a1, a2, b1, b2;
  for (let j = 0; j < 4; j++) {
    for (let i = 0; i < 4; i++) {
      const a = 0 + i + j;
      const b = 4 + i - j;
      if (spec_arr[a][b].num == now) {
        a1 = a;
        b1 = b;
      }
      if (spec_arr[a][b - 1].num == now) {
        a1 = a;
        b1 = b - 1;
      }
      if (spec_arr[a][b].num == pre) {
        a2 = a;
        b2 = b;

      }
      if (spec_arr[a][b - 1].num == pre) {
        a2 = a;
        b2 = b - 1;
      }
    }
  }
  if (color == 'white') {
    if (((a2 - a1) == 1) && ((b1 - b2) == 0)) return true;
    if (((a1 - a2) == 0) && ((b1 - b2) == 1)) return true;

  }
  if (color == 'black') {
    if (((a1 - a2) == 1) && ((b1 - b2) == 0)) return true;
    if (((a1 - a2) == 0) && ((b2 - b1) == 1)) return true;
    return false;
  }

}
// kill by ususal cheker
function rules_2(now, pre) {
  let a1, a2, b1, b2;
  for (let j = 0; j < 4; j++) {
    for (let i = 0; i < 4; i++) {
      const a = 0 + i + j;
      const b = 4 + i - j;
      if (spec_arr[a][b].num == now) {
        a1 = a;
        b1 = b;
      }
      if (spec_arr[a][b - 1].num == now) {
        a1 = a;
        b1 = b - 1;
      }
      if (spec_arr[a][b].num == pre) {
        a2 = a;
        b2 = b;

      }
      if (spec_arr[a][b - 1].num == pre) {
        a2 = a;
        b2 = b - 1;
      }
    }
  }
  let sa = spec_arr;
  let sam = spec_arr[a2][b2].cheker;
  if (((a2 - a1) == 2) && ((b1 - b2) == 0) && sa[a2 - 1][b1].cheker != sam && sa[a2 - 1][b1].cheker != 'null') {
    return spec_arr[a2 - 1][b1];
  }
  if (((a1 - a2) == 0) && ((b1 - b2) == 2) && sa[a1][b2 + 1].cheker != sam && sa[a1][b2 + 1].cheker != 'null') {
    return spec_arr[a1][b2 + 1];
  }
  if (((a1 - a2) == 2) && ((b1 - b2) == 0) && sa[a2 + 1][b1].cheker != sam && sa[a2 + 1][b1].cheker != 'null') {
    return spec_arr[a2 + 1][b1];
  }
  if (((a1 - a2) == 0) && ((b2 - b1) == 2) && sa[a1][b2 - 1].cheker != sam && sa[a1][b2 - 1].cheker != 'null') {
    return spec_arr[a1][b2 - 1];
  }
  return false;


}
// chek opportunities
function rules_3(anctol){
  let a1,b1,b2;
   let sa = spec_arr;
  for (let j = 0; j < 4; j++) {
    for (let i = 0; i < 4; i++) {
      const a = 0 + i + j;
      const b = 4 + i - j;
      if (spec_arr[a][b].cheker != 'null') {
         a1 = a;
         b1 = b;
         let sam = spec_arr[a1][b1].cheker;
  if (a1 - 2 >= 0 && sa[a1 - 1][b1].cheker != sam  && sa[a1 - 1][b1].cheker == anctol && sa[a1-2][b1].cheker == 'null' && sam != anctol) {
    return spec_arr[a1 - 1][b1];
  }
  if ( b1 + 2 <= 7 && sa[a1][b1 + 1].cheker != sam && sa[a1][b1 + 1].cheker == anctol && sa[a1][b1 + 2].cheker == 'null' && sam != anctol) {
    return spec_arr[a1][b1 + 1];
  }
  if ( a1 + 2 <= 6 && sa[a1 + 1][b1 ].cheker != sam && sa[a1 + 1][b1].cheker == anctol && sa[a1 + 2][b1].cheker == 'null' && sam != anctol) {
    return spec_arr[a1 + 1][b1];
  }
  if (b1 - 2 >=0 && sa[a1][b1 - 1].cheker != sam && sa[a1][b1 - 1].cheker == anctol && sa[a1][b1 - 2].cheker == 'null' && sam != anctol) {
    return spec_arr[a1][b1 - 1];
  }
      }
      if (spec_arr[a][b - 1].cheker != 'null') {
        a1 = a;
        b1 = b - 1;
           let sam = spec_arr[a1][b1].cheker;
  if (a1 - 2 >= 0 && sa[a1 - 1][b1].cheker != sam  && sa[a1 - 1][b1].cheker == anctol && sa[a1-2][b1].cheker == 'null' && sam != anctol) {
    return spec_arr[a1 - 1][b1];
  }
  if ( b1 + 2 <= 7 && sa[a1][b1 + 1].cheker != sam && sa[a1][b1 + 1].cheker == anctol && sa[a1][b1 + 2].cheker == 'null' && sam != anctol) {
    return spec_arr[a1][b1 + 1];
  }
  if ( a1 + 2 <= 6 && sa[a1 + 1][b1 ].cheker != sam && sa[a1 + 1][b1].cheker == anctol && sa[a1 + 2][b1].cheker == 'null' && sam != anctol) {
    return spec_arr[a1 + 1][b1];
  }
  if (b1 - 2 >=0 && sa[a1][b1 - 1].cheker != sam && sa[a1][b1 - 1].cheker == anctol && sa[a1][b1 - 2].cheker == 'null' && sam != anctol) {
    return spec_arr[a1][b1 - 1];
  }
      }  
}
}
return false;

}
function find_spec_ar(nn) {
  for (let j = 0; j < 4; j++) {
    for (let i = 0; i < 4; i++) {
      const a = 0 + i + j;
      const b = 4 + i - j;
      if (spec_arr[a][b].num == nn) return spec_arr[a][b];
      if (spec_arr[a][b - 1].num == nn) return spec_arr[a][b - 1];
    }
  }

}




//draw_b_chekers_first();
//draw_w_chekers_first();
find_zones();
work_with_spec_arr();
first_filling();
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  draw_desk();
  draw_chekers();
  find_choosed_cell();

  if (click) {
    if (find_spec_ar(choosen_cell_prev).cheker == 'w' && flag) {
      move_w(choosen_cell_now, choosen_cell_prev);
      if (find_spec_ar(choosen_cell_prev).cheker == 'null') flag--;
   }
    if (find_spec_ar(choosen_cell_prev).cheker == 'b' && !flag) {
      move_b(choosen_cell_now, choosen_cell_prev);
     if (find_spec_ar(choosen_cell_prev).cheker == 'null') flag++;
    }
   //    console.log(rules_3('w'));
    //console.log("now : " + choosen_cell_now);
    //console.log("pre : " + choosen_cell_prev);
    //console.log(find_spec_ar(choosen_cell_now));
  }

}

//console.log(spec_arr[6][3] );
setInterval(draw, 10);
console.log();
