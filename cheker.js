'use strict';

document.addEventListener('mousemove', mouseMoveHandlerY, false);
document.addEventListener('mousemove', mouseMoveHandlerX, false);
document.addEventListener('mousedown', mousedown, false);
document.addEventListener('mouseup', mouseup, false);


const canvas = document.getElementById('myCanvas');
const turncanvas = document.getElementById('secCanvas');
const ctx = canvas.getContext('2d');
const ctxturn = turncanvas.getContext('2d'); 
// desk cells
const cell = { };
cell.height = 60;
cell.width = 60;
let click = false;
let Xmouse;
let Ymouse;
const zone = [];
let choosenCellNow = 0, choosenCellPrev = 19;
const specArr = [];
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


function workWithSpecArr() {
  let n = 1;
  for (let i = 0; i < 7; i++) {
    specArr[i] = [];
    for (let j = 0; j < 8; j++) {
      specArr[i][j] = 0;
    }
  }

  for (let j = 0; j < 4; j++) {
    for (let i = 0; i < 4; i++) {
      const a = 0 + i + j;
      const b = 4 + i - j;
      specArr[a ][b] = { num: n, choose: false, cheker: 'null', x: 60 + 120 * i, y: 0 +  120 * j, a, b };
      specArr[a ][b - 1] = { num: n + 4, choose: false, cheker: 'null', x: 0 + 120 * i, y: 60 +  120 * j, a, b: b - 1  };
      n++;
    } n += 4;
  }
}

//filling desk by chekers
function firstFilling() {

  for (let j = 0; j < 4; j++) {
    for (let i = 0; i < 4; i++) {
      const a = 0 + i + j;
      const b = 4 + i - j;
      if (specArr[a][b].num <= 12) specArr[a][b].cheker = 'b';
      if (specArr[a][b - 1].num <= 12) specArr[a][b - 1].cheker = 'b';
      if (specArr[a][b].num >= 21) specArr[a][b].cheker = 'w';
      if (specArr[a][b - 1].num >= 21) specArr[a][b - 1].cheker = 'w';
    }
  }
}


function drawDeskCells(x, y) {
  ctx.beginPath();
  //ctx.rect( cell.x, cell.y, cell.width, cell.height)
  ctx.rect(x, y, cell.height, cell.width);
  ctx.fillStyle = '#e7ecfb';
  ctx.fill();
  ctx.closePath();


}

function drawMust(x, y) {
  ctx.beginPath();
  //ctx.rect( cell.x, cell.y, cell.width, cell.height)
  ctx.rect(x, y, cell.height, cell.width);
  ctx.fillStyle = 'red';
  ctx.fill();
  ctx.closePath();

  ctx.beginPath();
  //ctx.rect( cell.x, cell.y, cell.width, cell.height)
  ctx.rect(x + 5, y + 5, cell.height - 10, cell.width - 10);
  ctx.fillStyle = '#4a8ef6';
  ctx.fill();
  ctx.closePath();
}
//draw cheker
function draw_turn(flag){
  let color;
  
  ctxturn.beginPath();
  ctxturn.arc(40, 40, 35, 0, Math.PI * 2, false);
 if (!flag) ctxturn.fillStyle = 'black';
 else  ctxturn.fillStyle = 'white';
  ctxturn.fill();
  ctxturn.closePath();
  console.log('Bllaaack');
}

function drawchekerB(x, y) {
  ctx.beginPath();
  ctx.arc(x, y, 25, 0, Math.PI * 2, false);
  ctx.fillStyle = 'black';
  ctx.fill();
  ctx.closePath();
}

function drawchekerBCr(x, y) {
  ctx.beginPath();
  ctx.arc(x, y, 25, 0, Math.PI * 2, false);
  ctx.fillStyle = 'black';
  ctx.fill();
  ctx.closePath();
  ctx.beginPath();
  ctx.arc(x, y, 20, 0, Math.PI * 2, false);
  ctx.fillStyle = '#0774a6';
  ctx.fill();
  ctx.closePath();
}


function drawchekerW(x, y) {
  ctx.beginPath();
  ctx.arc(x, y, 25, 0, Math.PI * 2, false);
  ctx.fillStyle = 'white';
  ctx.fill();
  ctx.closePath();
}

function drawchekerWCr(x, y) {
  ctx.beginPath();
  ctx.arc(x, y, 25, 0, Math.PI * 2, false);
  ctx.fillStyle = 'white';
  ctx.fill();
  ctx.closePath();
  ctx.beginPath();
  ctx.arc(x, y, 20, 0, Math.PI * 2, false);
  ctx.fillStyle = '#0774a6';
  ctx.fill();
  ctx.closePath();
}

// we use desk cells to paint desk
function drawDesk() {
  for (let xCell = 0; xCell < canvas.width; xCell += 2 * cell.width) {
    for (let yCell = 0; yCell < canvas.height; yCell += 2 * cell.height) {
      drawDeskCells(xCell, yCell);
      drawDeskCells(xCell + cell.height, yCell + cell.width);
    }
  }
}


function drawChekers() {
  for (let j = 0; j < 4; j++) {
    for (let i = 0; i < 4; i++) {
      const a = 0 + i + j;
      const b = 4 + i - j;
      if (specArr[a][b].cheker === 'w') drawchekerW(specArr[a][b].x + 30, specArr[a][b].y + 30);
      if (specArr[a][b - 1].cheker === 'w') drawchekerW(specArr[a][b - 1].x + 30, specArr[a][b - 1].y + 30);
      if (specArr[a][b].cheker === 'b') drawchekerB(specArr[a][b].x + 30, specArr[a][b].y + 30);
      if (specArr[a][b - 1].cheker === 'b') drawchekerB(specArr[a][b - 1].x + 30, specArr[a][b - 1].y + 30);
      if (specArr[a][b].cheker === 'wCr') drawchekerWCr(specArr[a][b].x + 30, specArr[a][b].y + 30);
      if (specArr[a][b - 1].cheker === 'wCr') drawchekerWCr(specArr[a][b - 1].x + 30, specArr[a][b - 1].y + 30);
      if (specArr[a][b].cheker === 'bCr') drawchekerBCr(specArr[a][b].x + 30, specArr[a][b].y + 30);
      if (specArr[a][b - 1].cheker === 'bCr') drawchekerBCr(specArr[a][b - 1].x + 30, specArr[a][b - 1].y + 30);
    }
  }
}

// find zones coordinates
function findZones() {
  let num = 1;

  for (let i  = 0; i < 8; i++) {
    for (let j  = 0; j < 4; j++) {
      zone[num] = { };
      if (i % 2 === 0) zone[num] = { x: 60 + 120 * j, y: i * 60  };
      else zone[num] = { x:  120 * j, y: i * 60  };
      num++;
    }
  }
}


function findChoosedCell() {
  let buffer;
  if (click && Xmouse <= 480 && Ymouse <= 480) {
    for (let i = 1; i < 33; i++) {
      const a = Xmouse > zone[i].x;
      const b = Xmouse < zone[i].x + 60;
      const c = Ymouse > zone[i].y;
      const d = Ymouse < zone[i].y + 60;
      if (a && b & c && d && i !== choosenCellNow) {
        // zone[ i ].choose = true;
        choosenCellPrev = choosenCellNow;
        choosenCellNow = i;
      }
    }
  }
  if (click && (Xmouse >= 480 || Ymouse >= 480)) {
    choosenCellNow = 0;
  }
  if (choosenCellNow !== buffer) buffer = choosenCellNow;
}

function chekOnCrown() {
  for (let j = 1; j <= 4; j++) {
    if (findSpecAr(j + 28).cheker === 'b') findSpecAr(j + 28).cheker = 'bCr';
    if (findSpecAr(j).cheker === 'w') findSpecAr(j).cheker = 'wCr';
  }
}

function moveW(now, pre) {
  const c = rules1(now, pre, 'white');
  const a = findSpecAr(now).cheker;
  const b = findSpecAr(pre).cheker;
  const d = rules2(now, pre);
  const e = rules3('b');
  const f = rules3Cr('w');
  if (b === 'w' && a === 'null' && c && !e && !f) {
    findSpecAr(now).cheker = 'w';
    findSpecAr(pre).cheker = 'null';
  }
  if (b === 'w' && a === 'null'  && d && !e && !f) {
    rules2(now, pre).cheker = 'null';
    findSpecAr(now).cheker = 'w';
    findSpecAr(pre).cheker = 'null';
  // flag++;
  }
  inside();
  function inside() {
    if (e && (e === d)) {
      rules2(now, pre).cheker = 'null';
      findSpecAr(now).cheker = 'w';
      findSpecAr(pre).cheker = 'null';
      if (rules3('b')) flag++;
    }
  }
  //if(e) flag++;
  //  while( click && e) inside();

}



function moveB(now, pre) {
  const a = findSpecAr(now).cheker;
  const b = findSpecAr(pre).cheker;
  const c = rules1(now, pre, 'black');
  const d = rules2(now, pre);
  const e = rules3('w');
  const f = rules3Cr('b');


  if (a === 'null' && b === 'b' &&  c && !e && !f) {
    findSpecAr(now).cheker = 'b';
    findSpecAr(pre).cheker = 'null';
  }

  if (a === 'null' && b === 'b' && d && !e && !f) {
    rules2(now, pre).cheker = 'null';
    findSpecAr(now).cheker = 'b';
    findSpecAr(pre).cheker = 'null';
    // flag--;
  }
  inside();
  function inside() {
    if (e && (e === d)) {
      rules2(now, pre).cheker = 'null';
      findSpecAr(now).cheker = 'b';
      findSpecAr(pre).cheker = 'null';
      if (rules3('w')) flag--;
    }
  }
  // while( click && e) inside();

}

function moveBCr(now, pre) {
  const a = findSpecAr(now).cheker;
  const b = findSpecAr(pre).cheker;
  const c = rules1(now, pre, 'Cr');
  const d = rules2Cr(now, pre, 'b');
  const e = rules3Cr('b');
  const f = rules3('w');

 

  if (a === 'null' && b === 'bCr' &&  c && !e && !f) {
    findSpecAr(now).cheker = 'bCr';
    findSpecAr(pre).cheker = 'null';
  }
  if (a === 'null' && b === 'bCr' && d && !e && !f) {
    rules2Cr(now, pre, 'b').cheker = 'null';
    findSpecAr(now).cheker = 'bCr';
    findSpecAr(pre).cheker = 'null';
    // flag--;
  }
  inside();

  function inside() {
    if (e && (e === d)) {
      rules2Cr(now, pre, 'b').cheker = 'null';
      findSpecAr(now).cheker = 'bCr';
      findSpecAr(pre).cheker = 'null';
      if (rules3Cr('b')) flag--;
    }
  }

}
function moveWCr(now, pre) {
  const a = findSpecAr(now).cheker;
  const b = findSpecAr(pre).cheker;
  const c = rules1(now, pre, 'Cr');
  const d = rules2Cr(now, pre, 'w');
  const e = rules3Cr('w');
  const f = rules3('b');

  if (a === 'null' && b === 'wCr' &&  c && !e && !f) {
    findSpecAr(now).cheker = 'wCr';
    findSpecAr(pre).cheker = 'null';
  }

  if (a === 'null' && b === 'wCr' && d && !e && !f) {
    rules2Cr(now, pre, 'w').cheker = 'null';
    findSpecAr(now).cheker = 'wCr';
    findSpecAr(pre).cheker = 'null';
  }
  inside();
  function inside() {
    if (e && (e === d)) {
      rules2Cr(now, pre, 'w').cheker = 'null';
      findSpecAr(now).cheker = 'wCr';
      findSpecAr(pre).cheker = 'null';
      if (rules3Cr('w')) flag++;
    }
  }

}
// similar move
function rules1(now, pre, color) {
  let a1, a2, b1, b2;
  a1 = findSpecAr(now).a;
  b1 = findSpecAr(now).b;

  a2 = findSpecAr(pre).a;
  b2 = findSpecAr(pre).b;
  if (color === 'white') {
    if (((a2 - a1) === 1) && ((b1 - b2) === 0)) return true;
    if (((a1 - a2) === 0) && ((b1 - b2) === 1)) return true;

  }
  if (color === 'black') {
    if (((a1 - a2) === 1) && ((b1 - b2) === 0)) return true;
    if (((a1 - a2) === 0) && ((b2 - b1) === 1)) return true;

  }
  if (color === 'Cr') {
    if (((a2 - a1) === 1) && ((b1 - b2) === 0)) return true;
    if (((a1 - a2) === 0) && ((b1 - b2) === 1)) return true;
    if (((a1 - a2) === 1) && ((b1 - b2) === 0)) return true;
    if (((a1 - a2) === 0) && ((b2 - b1) === 1)) return true;
  }
  return false;
}


// kill by ususal cheker
function rules2(now, pre) {
  let a1, a2, b1, b2;
  a1 = findSpecAr(now).a;
  b1 = findSpecAr(now).b;

  a2 = findSpecAr(pre).a;
  b2 = findSpecAr(pre).b;
  const sa = specArr;
  const sam = specArr[a2][b2].cheker;
  if (((a2 - a1) === 2) && ((b1 - b2) === 0) && (sa[a2 - 1][b1].cheker === 'b' || sa[a2 - 1][b1].cheker === 'bCr')) {
    return specArr[a2 - 1][b1];
  }
  if (((a1 - a2) === 0) && ((b1 - b2) === 2) && (sa[a1][b2 + 1].cheker === 'b' || sa[a1][b2 + 1].cheker === 'bCr')) {
    return specArr[a1][b2 + 1];
  }
  if (((a1 - a2) === 2) && ((b1 - b2) === 0) && (sa[a2 + 1][b1].cheker === 'w' || sa[a2 + 1][b1].cheker === 'wCr')) {
    return specArr[a2 + 1][b1];
  }
  if (((a1 - a2) === 0) && ((b2 - b1) === 2) && (sa[a1][b2 - 1].cheker === 'w' || sa[a1][b2 - 1].cheker === 'wCr')) {
    return specArr[a1][b2 - 1];
  }
  return false;


}
function rules2Cr(now, pre, color) {
  let a1, a2, b1, b2;

  a1 = findSpecAr(now).a;
  b1 = findSpecAr(now).b;

  a2 = findSpecAr(pre).a;
  b2 = findSpecAr(pre).b;
  const sa = specArr;
  const sam = specArr[a2][b2].cheker;
  if (((a2 - a1) === 2) && ((b1 - b2) === 0) && sa[a2 - 1][b1].cheker !== sam && sa[a2 - 1][b1].cheker !== 'null' && sa[a2 - 1][b1].cheker !== color) {
    return specArr[a2 - 1][b1];
  }
  if (((a1 - a2) === 0) && ((b1 - b2) === 2) && sa[a1][b2 + 1].cheker !== sam && sa[a1][b2 + 1].cheker !== 'null' && sa[a1][b2 + 1].cheker !== color) {
    return specArr[a1][b2 + 1];
  }
  if (((a1 - a2) === 2) && ((b1 - b2) === 0) && sa[a2 + 1][b1].cheker !== sam && sa[a2 + 1][b1].cheker !== 'null' && sa[a2 + 1][b1].cheker !== color) {
    return specArr[a2 + 1][b1];
  }
  if (((a1 - a2) === 0) && ((b2 - b1) === 2) && sa[a1][b2 - 1].cheker !== sam && sa[a1][b2 - 1].cheker !== 'null' && sa[a1][b2 - 1].cheker !== color) {
    return specArr[a1][b2 - 1];
  }
  return false;


}
// chek opportunities
function rules3(anctol) {
  let a1,  b1, b2;
  const sa = specArr;
  let col;

  if (anctol === 'w')  col = 'b';
  if (anctol ==='b')  col = 'w';

  for (let j = 0; j < 4; j++) {
    for (let i = 0; i < 4; i++) {
      const a = 0 + i + j;
      const b = 4 + i - j;

      if (specArr[a][b].cheker === col) {
        a1 = a;
        b1 = b;
        const sam = specArr[a1][b1].cheker;
        if (anctol === 'b') {
          if (a1 - 2 >= 0 && (sa[a1 - 1][b1].cheker  ===  'bCr' || sa[a1 - 1][b1].cheker === 'b') && sa[a1 - 2][b1].cheker === 'null' && sam === 'w') {
            return specArr[a1 - 1][b1];
          }
          if (b1 + 2 <= 7 && (sa[a1][b1 + 1].cheker  === 'bCr' || sa[a1][b1 + 1].cheker === 'b') && sa[a1][b1 + 2].cheker === 'null' && sam === 'w') {
            return specArr[a1][b1 + 1];
          }
        }
        if (anctol === 'w') {
          if (a1 + 2 <= 6 && (sa[a1 + 1][b1 ].cheker === 'wCr' || sa[a1 + 1][b1].cheker === 'w') && sa[a1 + 2][b1].cheker === 'null' && sam === 'b') {
            return specArr[a1 + 1][b1];
          }
          if (b1 - 2 >= 0 && (sa[a1][b1 - 1].cheker  === 'wCr' ||  sa[a1][b1 - 1].cheker === 'w') && sa[a1][b1 - 2].cheker === 'null' && sam === 'b') {
            return specArr[a1][b1 - 1];
          }
        }
      }
      if (specArr[a][b - 1].cheker === col) {
        a1 = a;
        b1 = b - 1;
        const sam = specArr[a1][b1].cheker;
        if (anctol === 'b') {
          if (a1 - 2 >= 0 && (sa[a1 - 1][b1].cheker  ===  'bCr' || sa[a1 - 1][b1].cheker === 'b') && sa[a1 - 2][b1].cheker === 'null' && sam === 'w') {
            return specArr[a1 - 1][b1];
          }
          if (b1 + 2 <= 7 && (sa[a1][b1 + 1].cheker  === 'bCr' || sa[a1][b1 + 1].cheker === 'b') && sa[a1][b1 + 2].cheker === 'null' && sam === 'w') {
            return specArr[a1][b1 + 1];
          }
        }
        if (anctol === 'w') {
          if (a1 + 2 <= 6 && (sa[a1 + 1][b1 ].cheker === 'wCr' || sa[a1 + 1][b1].cheker === 'w') && sa[a1 + 2][b1].cheker === 'null' && sam === 'b') {
            return specArr[a1 + 1][b1];
          }
          if (b1 - 2 >= 0 && (sa[a1][b1 - 1].cheker  === 'wCr' ||  sa[a1][b1 - 1].cheker === 'w') && sa[a1][b1 - 2].cheker === 'null' && sam === 'b') {
            return specArr[a1][b1 - 1];
          }
        }
      }
    }
  }
  return false;

}
function rules3Cr(col) {
  let a1,  b1, Cr;
  const sa = specArr;
  for (let j = 0; j < 4; j++) {
    for (let i = 0; i < 4; i++) {
      const a = 0 + i + j;
      const b = 4 + i - j;
      if (col === 'w') Cr = 'wCr';
      if (col === 'b') Cr = 'bCr';
      if (specArr[a][b].cheker === Cr) {
        // console.log(specArr[a][b])
        a1 = a;
        b1 = b;
        const sam = specArr[a1][b1].cheker;
        if (a1 - 2 >= 0 && sa[a1 - 1][b1].cheker !== sam  && sa[a1 - 1][b1].cheker !== col && sa[a - 1][b1].cheker !== 'null' && sa[a1 - 2][b1].cheker === 'null') {
          return specArr[a1 - 1][b1];
        }
        if (b1 + 2 <= 7 && sa[a1][b1 + 1].cheker !== sam && sa[a1][b1 + 1].cheker !== col && sa[a1][b1 + 1].cheker !== 'null' && sa[a1][b1 + 2].cheker === 'null') {
          return specArr[a1][b1 + 1];
        }
        if (a1 + 2 <= 6 && sa[a1 + 1][b1 ].cheker !== sam && sa[a1 + 1][b1].cheker !== col && sa[a1 + 1][b1].cheker !== 'null' && sa[a1 + 2][b1].cheker === 'null') {
          return specArr[a1 + 1][b1];
        }
        if (b1 - 2 >= 0 && sa[a1][b1 - 1].cheker !== sam && sa[a1][b1 - 1].cheker !== col && sa[a1][b1 - 1].cheker !== 'null' && sa[a1][b1 - 2].cheker === 'null') {
          return specArr[a1][b1 - 1];
        }
      }
      if (specArr[a][b - 1].cheker === Cr) {
        a1 = a;
        b1 = b - 1;

        const sam = specArr[a1][b1].cheker;
        if (a1 - 2 >= 0 && sa[a1 - 1][b1].cheker !== sam  && sa[a1 - 1][b1].cheker !== col && sa[a - 1][b1].cheker !== 'null' && sa[a1 - 2][b1].cheker === 'null') {
          return specArr[a1 - 1][b1];
        }
        if (b1 + 2 <= 7 && sa[a1][b1 + 1].cheker !== sam && sa[a1][b1 + 1].cheker !== col && sa[a1][b1 + 1].cheker !== 'null' && sa[a1][b1 + 2].cheker === 'null') {
          return specArr[a1][b1 + 1];
        }
        if (a1 + 2 <= 6 && sa[a1 + 1][b1].cheker !== sam && sa[a1 + 1][b1].cheker !== col && sa[a1 + 1][b1].cheker !== 'null' && sa[a1 + 2][b1].cheker === 'null') {
          return specArr[a1 + 1][b1];
        }

        if (b1 - 2 >= 0 && sa[a1][b1 - 1].cheker !== sam && sa[a1][b1 - 1].cheker !== col && sa[a1][b1 - 1].cheker !== 'null' && sa[a1][b1 - 2].cheker === 'null') {
          return specArr[a1][b1 - 1];
        }
      }
    }
  }
  return false;

}
function findSpecAr(nn) {
  for (let j = 0; j < 4; j++) {
    for (let i = 0; i < 4; i++) {
      const a = 0 + i + j;
      const b = 4 + i - j;
      if (specArr[a][b].num === nn) return specArr[a][b];
      if (specArr[a][b - 1].num === nn) return specArr[a][b - 1];
    }
  }

}




findZones();
workWithSpecArr();
firstFilling();
function draw() {
  ctx.clearRect(0, 0, canvas.width , canvas.height);
  ctxturn.clearRect(0, 0 , 80, 80);
  drawDesk();
  findChoosedCell();
  draw_turn(flag);
  if (!flag) {
    if (rules3Cr('b')) { drawMust(rules3Cr('b').x, rules3Cr('b').y);/*console.log(rules3Cr('b'))*/ }
    if (rules3('w')) { drawMust(rules3('w').x, rules3('w').y);/*console.log(rules3('w'));*/ }

  }
  if (flag) {
    if (rules3Cr('w')) { drawMust(rules3Cr('w').x, rules3Cr('w').y);/*console.log(rules3Cr('w'))*/ }
    if (rules3('b')) { drawMust(rules3('b').x, rules3('b').y);/*console.log(rules3('b'));*/ }
  }
  drawChekers();


   
  if (click) {
    if ((findSpecAr(choosenCellPrev).cheker === 'w' || findSpecAr(choosenCellPrev).cheker === 'wCr') && flag) {
      moveWCr(choosenCellNow, choosenCellPrev);
      moveW(choosenCellNow, choosenCellPrev);

      if (findSpecAr(choosenCellPrev).cheker === 'null') {
        flag--;

      }

    }
    if ((findSpecAr(choosenCellPrev).cheker === 'b' || findSpecAr(choosenCellPrev).cheker === 'bCr') && !flag) {
      moveBCr(choosenCellNow, choosenCellPrev);
      moveB(choosenCellNow, choosenCellPrev);

      if (findSpecAr(choosenCellPrev).cheker === 'null') {
        flag++;

      }

    }
chekOnCrown();
  }

}

setInterval(draw, 30);
