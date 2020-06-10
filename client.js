
'use strict';

const socket = new WebSocket('ws://127.0.0.1:8080/');

const  canvas = document.getElementById('myCanvas');
const turncanvas = document.getElementById('secCanvas');
const ctx = canvas.getContext('2d');
const ctxturn = turncanvas.getContext('2d');

canvas.addEventListener('mousemove', mouseMoveHandlerY, false);
canvas.addEventListener('mousemove', mouseMoveHandlerX, false);
canvas.addEventListener('mousedown', mousedown, false);
canvas.addEventListener('mouseup', mouseup, false);
/*


*/


class Cells {
  constructor() {
    this.ctx = canvas.getContext('2d');
    this.ctxturn = turncanvas.getContext('2d');
    this.CHEKER_R = 25;
    this.cell = { height: 60, width: 60 };
  }


  drawMust(x, y) {
    this.ctx.beginPath();
    this.ctx.rect(x, y, this.cell.height, this.cell.width);
    this.ctx.fillStyle = 'red';
    this.ctx.fill();
    this.ctx.closePath();

    this.ctx.beginPath();
    this.ctx.rect(x + 5, y + 5, this.cell.height - 10, this.cell.width - 10);
    this.ctx.fillStyle = '#4a8ef6';
    this.ctx.fill();
    this.ctx.closePath();
  }

  drawDeskCells(x, y) {
    this.ctx.beginPath();
    this.ctx.rect(x, y, this.cell.height, this.cell.width);
    this.ctx.fillStyle = '#e7ecfb';
    this.ctx.fill();
    this.ctx.closePath();
  }

  drawcheker(x, y, color) {

    this.ctx.beginPath();
    this.ctx.arc(x, y, this.CHEKER_R, 0, Math.PI * 2, false);
    if (color === 'b')
      this.ctx.fillStyle = 'black';
    else
      this.ctx.fillStyle = 'white';
    this.ctx.fill();
    this.ctx.closePath();
  }

  drawchekerCr(x, y, color) {
    ctx.beginPath();
    ctx.arc(x, y, this.CHEKER_R, 0, Math.PI * 2, false);
    if (color === 'b')
      ctx.fillStyle = 'black';
    else
      ctx.fillStyle = 'white';
    ctx.fill();
    ctx.closePath();
    ctx.beginPath();
    ctx.arc(x, y, this.CHEKER_R - 5, 0, Math.PI * 2, false);
    ctx.fillStyle = '#0774a6';
    ctx.fill();
    ctx.closePath();
  }

}

const cells = new Cells();

const zone = [];
const cell =  { height: 60, width: 60 };
const LINES = 4;
const USABLE_CELL = 32;
let specArr = [];
let click = false;
let relativeX;
let relativeY;
let choosenCellNow = 0, choosenCellPrev = 19;
let flag = 1;

const  findZones = () => {
  let num = 1;
  const side = cell.height;
  for (let i  = 0; i < 8; i++) {
    for (let j  = 0; j < 4; j++) {
      zone[num] = { };
      if (i % 2 === 0) zone[num] = { x: side + 2 * side * j, y: i * side  };
      else zone[num] = { x:  2 * side * j, y: i * side  };
      num++;
    }
  }
};

const workWithSpecArr = () => {
  let numCell = 1;
  const specArrHeight = 7;
  const specArrWidth = 8;
  for (let i = 0; i < specArrHeight; i++) {
    specArr[i] = [];
    for (let j = 0; j < specArrWidth; j++) {
      specArr[i][j] = {};
    }
  }

  const side = cell.height;
  for (let j = 0; j < 4; j++) {
    for (let i = 0; i < 4; i++) {
      const a = 0 + i + j;
      const b = 4 + i - j;
      specArr[a ][b] = { num: numCell, choose: false, cheker: 'null',
        x: side + 2 * side * i, y: 0 +  2 * side * j, a, b };
      specArr[a ][b - 1] = { num: numCell + 4, choose: false, cheker: 'null',
        x: 0 + 2 * side * i, y: side +  2 * side * j, a, b: b - 1 };
      numCell++;
    } numCell += 4;
  }
};

const firstFilling = () => { //
  const chekInLine = 4;
  const fillCell = (arr, a, b, col, pos1, pos2) => {
    const d = arr[a][b];
    const e = arr[a][b - 1];
    if (d.num <= pos2 && d.num >= pos1) d.cheker = col;
    if (e.num <= pos2 && e.num >= pos1) e.cheker = col;
  };
  for (let j = 0; j < chekInLine; j++) {
    for (let i = 0; i < chekInLine; i++) {
      const a = 0 + i + j;
      const b = 4 + i - j;
      fillCell(specArr, a, b, 'b', 0, 12);
      fillCell(specArr, a, b, 'w', 21, 32);
    }
  }
};

const drawDesk = () => {
  for (let xCell = 0; xCell < canvas.width; xCell += 2 * cell.width) {
    for (let yCell = 0; yCell < canvas.height; yCell += 2 * cell.height) {
      cells.drawDeskCells(xCell, yCell);
      cells.drawDeskCells(xCell + cell.height, yCell + cell.width);
    }
  }
};

function mousedown(e) {
  click = true;
  relativeY = mouseMoveHandlerY(e);
  relativeX = mouseMoveHandlerX(e);

  findChoosedCell();
  draw();
}

function mouseup() {
  click = false;
  draw();
}

function mouseMoveHandlerY(e) {
  return e.clientY;
}

function mouseMoveHandlerX(e) {
  return e.clientX;
}



//draw cheker
const druwTurn = flag => {
  const pos = turncanvas.width / 2;
  ctxturn.beginPath();
  ctxturn.arc(pos, pos, pos - 5, 0, Math.PI * 2, false);
  if (!flag) ctxturn.fillStyle = 'black';
  else  ctxturn.fillStyle = 'white';
  ctxturn.fill();
  ctxturn.closePath();
};

// we use desk cells to paint desk

const  drawChekers = () => {
  const color = c => {
    const halfS = cell.width / 2;
    switch (c.cheker) {
    case 'w': return cells.drawcheker(c.x + halfS, c.y + halfS, 'w');
    case 'b': return cells.drawcheker(c.x + halfS, c.y + halfS, 'b');
    case 'wCr': return cells.drawchekerCr(c.x + halfS, c.y + halfS, 'w');
    case 'bCr': return cells.drawchekerCr(c.x + halfS, c.y + halfS, 'b');

    }
  };

  for (let j = 0; j < 4; j++) {
    for (let i = 0; i < 4; i++) {
      const a = 0 + i + j;
      const b = 4 + i - j;
      const c = specArr[a][b];
      const d = specArr[a][b - 1];
      color(c);
      color(d);
    }
  }
};

// find zones coordinates

function findChoosedCell() {
  let buffer;

  for (let i = 1; i <= USABLE_CELL; i++) {
    const a = relativeX > zone[i].x;
    const b = relativeX < zone[i].x + cell.width;
    const c = relativeY > zone[i].y;
    const d = relativeY < zone[i].y + cell.width;
    if (a && b & c && d && i !== choosenCellNow) {
      choosenCellPrev = choosenCellNow;
      choosenCellNow = i;
    }
  }
  if (choosenCellNow !== buffer) buffer = choosenCellNow;
}

const chekOnCrown = () => {
  for (let j = 1; j <= LINES; j++) {
    if (findSpecAr(j + USABLE_CELL - LINES).cheker === 'b')
      findSpecAr(j + USABLE_CELL - LINES).cheker = 'bCr';
    if (findSpecAr(j).cheker === 'w')
      findSpecAr(j).cheker = 'wCr';
  }
};

function findSpecAr(nn) {
  for (let j = 0; j < LINES; j++) {
    for (let i = 0; i < LINES; i++) {
      const a = 0 + i + j;
      const b = 4 + i - j;
      if (specArr[a][b].num === nn) return specArr[a][b];
      if (specArr[a][b - 1].num === nn) return specArr[a][b - 1];
    }
  }
  return null;

}

const move = (now, pre, you, enemy) => {

  const inside = (e, d, now, pre) => {
    if (e && (e === d)) {
      ruleToKill(now, pre).cheker = 'null';
      findSpecAr(now).cheker = you;
      findSpecAr(pre).cheker = 'null';
      if (ruleOpportTo(enemy)) flag++;
    }
  };

  const c = ruleForStep(now, pre, you);
  const a = findSpecAr(now).cheker;
  const b = findSpecAr(pre).cheker;
  const d = ruleToKill(now, pre);
  const e = ruleOpportTo(enemy);
  const f = ruleOpportToCr(you);
  if (b === you && a === 'null' && c && !e && !f) {
    if (c) {
      findSpecAr(now).cheker = you;
      findSpecAr(pre).cheker = 'null';
    }
    if (d) {
      ruleToKill(now, pre).cheker = 'null';
      findSpecAr(now).cheker = you;
      findSpecAr(pre).cheker = 'null';
    }
  }

  inside(e, d, now, pre);

};



const moveCr = (now, pre, you, enemy, youCr) => {

  const inside = (now, pre, e, d) => {
    if (e && (e === d)) {
      ruleToKillCr(now, pre, 'b').cheker = 'null';
      findSpecAr(now).cheker = 'bCr';
      findSpecAr(pre).cheker = 'null';
      if (ruleOpportToCr('b')) flag--;
    }
  };

  const a = findSpecAr(now).cheker;
  const b = findSpecAr(pre).cheker;
  const c = ruleForStep(now, pre, 'Cr');
  const d = ruleToKillCr(now, pre, you);
  const e = ruleOpportToCr(you);
  const f = ruleOpportTo(enemy);

  if (a === 'null' && b === youCr && !e && !f) {
    if (c) {
      findSpecAr(now).cheker = youCr;
      findSpecAr(pre).cheker = 'null';
    }
    if (d) {
      ruleToKillCr(now, pre, you).cheker = 'null';
      findSpecAr(now).cheker = youCr;
      findSpecAr(pre).cheker = 'null';
    }
  }
  inside(now, pre, e, d);
};

// similar move
function ruleForStep(now, pre, color) {
  const a1 = findSpecAr(now).a;
  const b1 = findSpecAr(now).b;
  const a2 = findSpecAr(pre).a;
  const b2 = findSpecAr(pre).b;
  const c = (b1 - b2);
  const d = (a1 - a2);
  if (color === 'w') {
    if (((a2 - a1) === 1) && (c === 0)) return true;
    if ((d === 0) && (c === 1)) return true;

  }
  if (color === 'b') {
    if ((d === 1) && (c === 0)) return true;
    if ((d === 0) && ((b2 - b1) === 1)) return true;

  }
  if (color === 'Cr') {
    if (((a2 - a1) === 1) && (c === 0)) return true;
    if ((d === 0) && (c === 1)) return true;
    if ((d === 1) && (c === 0)) return true;
    if ((d === 0) && ((b2 - b1) === 1)) return true;
  }
  return false;
}


// kill by ususal cheker

function ruleToKill(now, pre) {

  const a1 = findSpecAr(now).a;
  const b1 = findSpecAr(now).b;
  const a2 = findSpecAr(pre).a;
  const b2 = findSpecAr(pre).b;
  const sa = specArr;
  const a = (a1 - a2);
  const b = (b1 - b2);


  if (((a2 - a1) === 2) && (b === 0)) {
    const sa1 = sa[a2 - 1][b1].cheker;
    if (sa1 === 'b' || sa1 === 'bCr') {
      return specArr[a2 - 1][b1];
    }
  }

  if ((a === 0) && (b === 2)) {
    const sa2 = sa[a1][b2 + 1].cheker;
    if (sa2 === 'b' || sa2 === 'bCr') {
      return specArr[a1][b2 + 1];
    }
  }

  if ((a === 2) && (b === 0)) {
    const sa3 = sa[a2 + 1][b1].cheker;
    if (sa3 === 'w' || sa3 === 'wCr') {
      return specArr[a2 + 1][b1];
    }
  }
  if ((a === 0) && ((b2 - b1) === 2)) {
    const sa4 = sa[a1][b2 - 1].cheker;
    if (sa4 === 'w' || sa4 === 'wCr') {
      return specArr[a1][b2 - 1];
    }
  }
  return false;

}

function ruleToKillCr(now, pre, color) {

  const lockBull = (letter, specArr, col) => {
    if ((letter !== specArr) && (letter !== 'null') && (letter !== col))
      return true;
    return false;
  };

  let a, b, c, d;
  const a1 = findSpecAr(now).a;
  const b1 = findSpecAr(now).b;
  const a2 = findSpecAr(pre).a;
  const b2 = findSpecAr(pre).b;
  const sa = specArr;
  const sam = specArr[a2][b2].cheker;

  if ((a2 - a1) === 2) a = sa[a2 - 1][b1].cheker;
  if (((a2 - a1) === 2) && ((b1 - b2) === 0) && lockBull(a, sam, color)) {
    return sa[a2 - 1][b1];
  }
  if ((a2 - a1) === 2) b = sa[a1][b2 + 1].cheker;
  if (((a1 - a2) === 0) && ((b1 - b2) === 2) && lockBull(b, sam, color)) {
    return  sa[a1][b2 + 1];
  }
  if ((a1 - a2) === 2) c = sa[a2 + 1][b1].cheker;
  if (((a1 - a2) === 2) && ((b1 - b2) === 0) && lockBull(c, sam, color)) {
    return sa[a2 + 1][b1];
  }
  if ((a1 - a2) === 2) d = sa[a1][b2 - 1].cheker;
  if (((a1 - a2) === 0) && ((b2 - b1) === 2) && lockBull(d, sam, color)) {
    return sa[a1][b2 - 1];
  }
  return false;
}
// chek opportunities to beat
function ruleOpportTo(anctol) {
  let a1,  b1;
  let col;

  const locBool = (col, colCr, anctol, a, b, a2, b2, sam) => {
    const firstCell = specArr[a][b].cheker;
    const secondCell = specArr[a2][b2].cheker;
    const e = (firstCell ===  colCr || firstCell === col);
    if (e && secondCell === 'null' && sam === anctol)
      return true;
    return false;
  };

  if (anctol === 'w')  col = 'b';
  if (anctol === 'b')  col = 'w';

  for (let j = 0; j < 4; j++) {
    for (let i = 0; i < 4; i++) {
      const a = 0 + i + j;
      const b = 4 + i - j;

      if (specArr[a][b].cheker === col) {
        a1 = a;
        b1 = b;
        const sam = specArr[a1][b1].cheker;
        if (anctol === 'b') {
          if (a1 - 2 >= 0)   {
            const aa = locBool('b', 'bCr', 'w', a1 - 1, b1, a1 - 2, b1, sam);

            if (aa)  return specArr[a1 - 1][b1];
          }

          if (b1 + 2 <= 7)  {
            const bb = locBool('b', 'bCr', 'w', a1, b1 + 1, a1, b1 + 2, sam);

            if (bb) return specArr[a1][b1 + 1];
          }
        }
        if (anctol === 'w') {

          if (a1 + 2 <= 6)  {
            const dd = locBool('w', 'wCr', 'b', a1 + 1, b1, a1 + 2, b1, sam);

            if (dd)  return specArr[a1 + 1][b1];

          }
          if (b1 - 2 >= 0) {
            const cc = locBool('w', 'wCr', 'b', a1, b1 - 1, a1, b1 - 2, sam);
            if (cc) return specArr[a1][b1 - 1];
          }
        }
      }
      if (specArr[a][b - 1].cheker === col) {
        a1 = a;
        b1 = b - 1;
        const sam = specArr[a1][b1].cheker;
        if (anctol === 'b') {
          if (a1 - 2 >= 0)   {
            const aa = locBool('b', 'bCr', 'w', a1 - 1, b1, a1 - 2, b1, sam);

            if (aa)  return specArr[a1 - 1][b1];
          }

          if (b1 + 2 <= 7)  {
            const bb = locBool('b', 'bCr', 'w', a1, b1 + 1, a1, b1 + 2, sam);

            if (bb) return specArr[a1][b1 + 1];
          }
        }
        if (anctol === 'w') {

          if (a1 + 2 <= 6)  {
            const dd = locBool('w', 'wCr', 'b', a1 + 1, b1, a1 + 2, b1, sam);

            if (dd)  return specArr[a1 + 1][b1];

          }
          if (b1 - 2 >= 0) {
            const cc = locBool('w', 'wCr', 'b', a1, b1 - 1, a1, b1 - 2, sam);
            if (cc) return specArr[a1][b1 - 1];
          }
        }
      }
    }
  }
  return false;
}

function ruleOpportToCr(col) {

  let a1,  b1, Cr;

  const locBool = (col, colCr, a, b, a2, b2, sam) => {
    const firstCell = specArr[a][b].cheker;
    const secondCell = specArr[a2][b2].cheker;
    const e = (firstCell !==  sam && firstCell !== col);
    if (e && secondCell === 'null' && firstCell !== 'null')
      return true;
    return false;
  };


  for (let j = 0; j < 4; j++) {
    for (let i = 0; i < 4; i++) {
      const a = 0 + i + j;
      const b = 4 + i - j;
      if (col === 'w') Cr = 'wCr';
      if (col === 'b') Cr = 'bCr';
      if (specArr[a][b].cheker === Cr) {
        a1 = a;
        b1 = b;
        const sam = specArr[a1][b1].cheker;
        if (a1 - 2 >= 0) {
          const aa = locBool('b', 'bCr', a1 - 1, b1, a1 - 2, b1, sam);
          if (aa)  return specArr[a1 - 1][b1];
        }

        if (b1 + 2 <= 7)  {
          const bb = locBool('b', 'bCr', a1, b1 + 1, a1, b1 + 2, sam);

          if (bb) return specArr[a1][b1 + 1];
        }
        if (a1 + 2 <= 6)  {
          const dd = locBool('w', 'wCr', a1 + 1, b1, a1 + 2, b1, sam);

          if (dd)  return specArr[a1 + 1][b1];

        }
        if (b1 - 2 >= 0) {
          const cc = locBool('w', 'wCr', a1, b1 - 1, a1, b1 - 2, sam);
          if (cc) return specArr[a1][b1 - 1];
        }
      }
      if (specArr[a][b - 1].cheker === Cr) {
        a1 = a;
        b1 = b - 1;

        const sam = specArr[a1][b1].cheker;
        if (a1 - 2 >= 0)   {
          const aa = locBool('b', 'bCr', a1 - 1, b1, a1 - 2, b1, sam);

          if (aa)  return specArr[a1 - 1][b1];
        }

        if (b1 + 2 <= 7)  {
          const bb = locBool('b', 'bCr', a1, b1 + 1, a1, b1 + 2, sam);

          if (bb) return specArr[a1][b1 + 1];
        }
        if (a1 + 2 <= 6)  {
          const dd = locBool('w', 'wCr', a1 + 1, b1, a1 + 2, b1, sam);

          if (dd)  return specArr[a1 + 1][b1];

        }
        if (b1 - 2 >= 0) {
          const cc = locBool('w', 'wCr', a1, b1 - 1, a1, b1 - 2, sam);
          if (cc) return specArr[a1][b1 - 1];
        }
      }
    }
  }
  return false;

}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctxturn.clearRect(0, 0, 80, 80);
  drawDesk();
  druwTurn(flag);

  if (!flag) {
    if (ruleOpportToCr('b')) {
      cells.drawMust(ruleOpportToCr('b').x, ruleOpportToCr('b').y);
    }
    if (ruleOpportTo('w')) {
      cells.drawMust(ruleOpportTo('w').x, ruleOpportTo('w').y);
    }

  }
  if (flag) {
    if (ruleOpportToCr('w')) {
      cells.drawMust(ruleOpportToCr('w').x, ruleOpportToCr('w').y);
    }
    if (ruleOpportTo('b')) {

      cells.drawMust(ruleOpportTo('b').x, ruleOpportTo('b').y);
    }
  }
  drawChekers();

  if (click) {
    if (findSpecAr(choosenCellPrev) && flag) {
      const cBool = findSpecAr(choosenCellPrev).cheker === 'w';
      const aBool = (cBool || findSpecAr(choosenCellPrev).cheker === 'wCr');
      if (aBool) {
        moveCr(choosenCellNow, choosenCellPrev, 'w', 'b', 'wCr');
        move(choosenCellNow, choosenCellPrev, 'w', 'b');
        if (findSpecAr(choosenCellPrev).cheker === 'null') {
          flag--;       socket.send(JSON.stringify(specArr));

        }
      }
    }
    if (findSpecAr(choosenCellPrev)  && !flag) {
      const dBool = findSpecAr(choosenCellPrev).cheker === 'b';
      const bBool = (dBool || findSpecAr(choosenCellPrev).cheker === 'bCr');
      if (bBool) {
        moveCr(choosenCellNow, choosenCellPrev, 'b', 'w', 'bCr');
        move(choosenCellNow, choosenCellPrev, 'b', 'w');
        if (findSpecAr(choosenCellPrev).cheker === 'null') {
          flag++;      socket.send(JSON.stringify(specArr));

        }
      }

    }
    chekOnCrown();
  }

}


const funcForStart = () => {
  findZones();
  workWithSpecArr();
  firstFilling();
  draw();
};



funcForStart();

socket.onopen = () => {

  console.log('connected');

};

socket.onerror = err => {
  console.log(err);
};

socket.onclose = () => {
  console.log('closed');
};

socket.onmessage = event => {
  specArr =  JSON.parse(event.data);

  if (flag) flag--;
  else flag++;
  draw();
};



