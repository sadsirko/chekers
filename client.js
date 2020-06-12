
'use strict';
const  canvas = document.getElementById('myCanvas');
const turncanvas = document.getElementById('secCanvas');

canvas.addEventListener('mousemove', mouseMoveHandlerY, false);
canvas.addEventListener('mousemove', mouseMoveHandlerX, false);
canvas.addEventListener('mousedown', mousedown, false);
canvas.addEventListener('mouseup', mouseup, false);

const arr = [];
let click = false;
let relativeX;
let relativeY;
let choosenCellNow = 0, choosenCellPrev = 19;
let flag = 1;


class Draw {
  constructor() {
    this.ctx = canvas.getContext('2d');
    this.ctxturn = turncanvas.getContext('2d');
    this.CHEKER_R = 25;
    this.cell = { h: 60, w: 60 };
  }

  drawMust(x, y) {
    this.ctx.beginPath();
    this.ctx.rect(x, y, this.cell.h, this.cell.w);
    this.ctx.fillStyle = 'red';
    this.ctx.fill();
    this.ctx.closePath();

    this.ctx.beginPath();
    this.ctx.rect(x + 5, y + 5, this.cell.h - 10, this.cell.w - 10);
    this.ctx.fillStyle = '#4a8ef6';
    this.ctx.fill();
    this.ctx.closePath();
  }

  drawDeskCells(x, y) {
    this.ctx.beginPath();
    this.ctx.rect(x, y, this.cell.h, this.cell.w);
    this.ctx.fillStyle = '#e7ecfb';
    this.ctx.fill();
    this.ctx.closePath();
  }

  drawcheker(x, y, color) {
    const xR = x + this.cell.w / 2;
    const yR = y + this.cell.h / 2;

    this.ctx.beginPath();
    this.ctx.arc(xR, yR, this.CHEKER_R, 0, Math.PI * 2, false);
    if (color === 'b')
      this.ctx.fillStyle = 'black';
    else
      this.ctx.fillStyle = 'white';
    this.ctx.fill();
    this.ctx.closePath();
  }

  drawchekerCr(x, y, color) {
    const xR = x + this.cell.w / 2;
    const yR = y + this.cell.h / 2;
    this.ctx.beginPath();
    this.ctx.arc(xR, yR, this.CHEKER_R, 0, Math.PI * 2, false);
    if (color === 'b')
      this.ctx.fillStyle = 'black';
    else
      this.ctx.fillStyle = 'white';
    this.ctx.fill();
    this.ctx.closePath();
    this.ctx.beginPath();
    this.ctx.arc(xR, yR, this.CHEKER_R - 5, 0, Math.PI * 2, false);
    this.ctx.fillStyle = '#0774a6';
    this.ctx.fill();
    this.ctx.closePath();
  }

  drawDesk() {
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let xCell = 0; xCell < canvas.width; xCell += 2 * this.cell.w) {
      for (let yCell = 0; yCell < canvas.height; yCell += 2 * this.cell.h) {
        this.drawDeskCells(xCell, yCell);
        this.drawDeskCells(xCell + this.cell.h, yCell + this.cell.w);
      }
    }
  }

  druwTurn(flag) {
    const pos = turncanvas.width / 2;

    this.ctxturn.clearRect(0, 0, 80, 80);
    this.ctxturn.beginPath();
    this.ctxturn.arc(pos, pos, pos - 5, 0, Math.PI * 2, false);
    if (!flag) this.ctxturn.fillStyle = 'black';
    else  this.ctxturn.fillStyle = 'white';
    this.ctxturn.fill();
    this.ctxturn.closePath();
  }
}

class Cell {
  constructor(num, cheker, x, y, a, b) {
    this.num = num;
    this.cheker = cheker;
    this.x = x;
    this.y = y;
    this.a = a;
    this.b = b;
  }
}

class ChekArr {
  constructor(arr, drawMeth) {
    this.arr = arr;
    this.zone = [];
    this.drawing = drawMeth;
    this.cell = { h: 60, w: 60 };
    this.LINES = 4;
    this.USABLE_CELL = 32;
  }

  workWithSpecArr() {
    let numCell = 1;
    const specArrHeight = 7;
    const specArrWidth = 8;
    for (let i = 0; i < specArrHeight; i++) {
      this.arr[i] = [];
      for (let j = 0; j < specArrWidth; j++) {
        this.arr[i][j] = {};
      }
    }

    const side = this.cell.h;
    for (let j = 0; j < 4; j++) {
      for (let i = 0; i < 4; i++) {
        const a = 0 + i + j;
        const b = 4 + i - j;
        this.arr[a][b] = new Cell(numCell, 'null', side + 2 * side * i,
          2 * side * j, a, b);
        this.arr[a][b - 1] = new Cell(numCell + 4, 'null', 2 * side * i,
          side +  2 * side * j, a, b - 1);
        numCell++;
      } numCell += 4;
    }
  }

  drawChekers() {
    const color = c => {
      switch (c.cheker) {
      case 'w': return this.drawing.drawcheker(c.x, c.y, 'w');
      case 'b': return this.drawing.drawcheker(c.x, c.y, 'b');
      case 'wCr': return this.drawing.drawchekerCr(c.x, c.y, 'w');
      case 'bCr': return this.drawing.drawchekerCr(c.x, c.y, 'b');

      }
    };

    for (let j = 0; j < 4; j++) {
      for (let i = 0; i < 4; i++) {
        const a = 0 + i + j;
        const b = 4 + i - j;
        const c = this.arr[a][b];
        const d = this.arr[a][b - 1];
        color(c);
        color(d);
      }
    }
  }

  findSpecAr(nn) {
    for (let j = 0; j < this.LINES; j++) {
      for (let i = 0; i < this.LINES; i++) {
        const a = 0 + i + j;
        const b = 4 + i - j;
        if (this.arr[a][b].num === nn) return this.arr[a][b];
        if (this.arr[a][b - 1].num === nn) return this.arr[a][b - 1];
      }
    }
    return null;
  }

  findZones() {
    let num = 1;
    const side = this.cell.h;
    for (let i  = 0; i < 8; i++) {
      for (let j  = 0; j < 4; j++) {
        this.zone[num] = { };
        if (i % 2 === 0)
          this.zone[num] = { x: side + 2 * side * j, y: i * side  };

        else this.zone[num] = { x:  2 * side * j, y: i * side  };
        num++;
      }
    }
  }

  findChoosedCell() {
    let buffer;
    for (let i = 1; i <= this.USABLE_CELL; i++) {
      const a = relativeX > this.zone[i].x;
      const b = relativeX < this.zone[i].x + this.cell.w;
      const c = relativeY > this.zone[i].y;
      const d = relativeY < this.zone[i].y + this.cell.w;
      if (a && b & c && d && i !== choosenCellNow) {
        choosenCellPrev = choosenCellNow;
        choosenCellNow = i;
      }
    }
    if (choosenCellNow !== buffer) buffer = choosenCellNow;
  }

  firstFilling() {
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
        fillCell(this.arr, a, b, 'b', 0, 12);
        fillCell(this.arr, a, b, 'w', 21, 32);
      }
    }
  }

  chekOnCrown() {
    for (let j = 1; j <= this.LINES; j++) {
      if (this.findSpecAr(j + this.USABLE_CELL - this.LINES).cheker === 'b')
        this.findSpecAr(j + this.USABLE_CELL - this.LINES).cheker = 'bCr';
      if (this.findSpecAr(j).cheker === 'w')
        this.findSpecAr(j).cheker = 'wCr';
    }
  }
}

class Rules {
  constructor(desk, draw) {
    this.spec = desk;
    this.spec = draw;
  }


  ruleForStep(now, pre, color) {
    const a1 = this.spec.findSpecAr(now).a;
    const b1 = this.spec.findSpecAr(now).b;
    const a2 = this.spec.findSpecAr(pre).a;
    const b2 = this.spec.findSpecAr(pre).b;
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


  ruleToKill(now, pre) {

    const a1 = this.spec.findSpecAr(now).a;
    const b1 = this.spec.findSpecAr(now).b;
    const a2 = this.spec.findSpecAr(pre).a;
    const b2 = this.spec.findSpecAr(pre).b;
    const sa = this.spec.arr;
    const a = (a1 - a2);
    const b = (b1 - b2);


    if (((a2 - a1) === 2) && (b === 0)) {
      const sa1 = sa[a2 - 1][b1].cheker;
      if (sa1 === 'b' || sa1 === 'bCr') {
        return this.spec.arr[a2 - 1][b1];
      }
    }

    if ((a === 0) && (b === 2)) {
      const sa2 = sa[a1][b2 + 1].cheker;
      if (sa2 === 'b' || sa2 === 'bCr') {
        return this.spec.arr[a1][b2 + 1];
      }
    }

    if ((a === 2) && (b === 0)) {
      const sa3 = sa[a2 + 1][b1].cheker;
      if (sa3 === 'w' || sa3 === 'wCr') {
        return this.spec.arr[a2 + 1][b1];
      }
    }
    if ((a === 0) && ((b2 - b1) === 2)) {
      const sa4 = sa[a1][b2 - 1].cheker;
      if (sa4 === 'w' || sa4 === 'wCr') {
        return this.spec.arr[a1][b2 - 1];
      }
    }
    return false;
  }

  ruleToKillCr(now, pre, color) {

    const lockBull = (letter, spec, col) => {
      if ((letter !== spec) && (letter !== 'null') && (letter !== col))
        return true;
      return false;
    };

    let a, b, c, d;
    const a1 = this.spec.findSpecAr(now).a;
    const b1 = this.spec.findSpecAr(now).b;
    const a2 = this.spec.findSpecAr(pre).a;
    const b2 = this.spec.findSpecAr(pre).b;
    const sa = this.spec.arr;
    const sam = this.spec.arr[a2][b2].cheker;

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
  ruleOpportTo(anctol) {
    let a1,  b1;
    let col;

    const locBool = (col, colCr, anctol, a, b, a2, b2, sam) => {
      const firstCell = this.spec.arr[a][b].cheker;
      const secondCell = this.spec.arr[a2][b2].cheker;
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

        if (this.spec.arr[a][b].cheker === col) {
          a1 = a;
          b1 = b;
          const sam = this.spec.arr[a1][b1].cheker;
          if (anctol === 'b') {
            if (a1 - 2 >= 0)   {
              const aa = locBool('b', 'bCr', 'w', a1 - 1, b1, a1 - 2, b1, sam);
              if (aa)  return this.spec.arr[a1 - 1][b1];
            }

            if (b1 + 2 <= 7)  {
              const bb = locBool('b', 'bCr', 'w', a1, b1 + 1, a1, b1 + 2, sam);
              if (bb) return this.spec.arr[a1][b1 + 1];
            }
          }
          if (anctol === 'w') {

            if (a1 + 2 <= 6)  {
              const dd = locBool('w', 'wCr', 'b', a1 + 1, b1, a1 + 2, b1, sam);

              if (dd)  return this.spec.arr[a1 + 1][b1];

            }
            if (b1 - 2 >= 0) {
              const cc = locBool('w', 'wCr', 'b', a1, b1 - 1, a1, b1 - 2, sam);
              if (cc) return this.spec.arr[a1][b1 - 1];
            }
          }
        }
        if (this.spec.arr[a][b - 1].cheker === col) {
          a1 = a;
          b1 = b - 1;
          const sam = this.spec.arr[a1][b1].cheker;
          if (anctol === 'b') {
            if (a1 - 2 >= 0)   {
              const aa = locBool('b', 'bCr', 'w', a1 - 1, b1, a1 - 2, b1, sam);

              if (aa)  return this.spec.arr[a1 - 1][b1];
            }

            if (b1 + 2 <= 7)  {
              const bb = locBool('b', 'bCr', 'w', a1, b1 + 1, a1, b1 + 2, sam);

              if (bb) return this.spec.arr[a1][b1 + 1];
            }
          }
          if (anctol === 'w') {

            if (a1 + 2 <= 6)  {
              const dd = locBool('w', 'wCr', 'b', a1 + 1, b1, a1 + 2, b1, sam);

              if (dd)  return this.spec.arr[a1 + 1][b1];

            }
            if (b1 - 2 >= 0) {
              const cc = locBool('w', 'wCr', 'b', a1, b1 - 1, a1, b1 - 2, sam);
              if (cc) return this.spec.arr[a1][b1 - 1];
            }
          }
        }
      }
    }
    return false;
  }

  ruleOpportToCr(col) {

    let a1,  b1, Cr;

    const locBool = (col, colCr, a, b, a2, b2, sam) => {
      const firstCell = this.spec.arr[a][b].cheker;
      const secondCell = this.spec.arr[a2][b2].cheker;
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
        if (this.spec.arr[a][b].cheker === Cr) {
          a1 = a;
          b1 = b;
          const sam = this.spec.arr[a1][b1].cheker;
          if (a1 - 2 >= 0) {
            const aa = locBool('b', 'bCr', a1 - 1, b1, a1 - 2, b1, sam);
            if (aa)  return this.spec.arr[a1 - 1][b1];
          }

          if (b1 + 2 <= 7)  {
            const bb = locBool('b', 'bCr', a1, b1 + 1, a1, b1 + 2, sam);

            if (bb) return this.spec.arr[a1][b1 + 1];
          }
          if (a1 + 2 <= 6)  {
            const dd = locBool('w', 'wCr', a1 + 1, b1, a1 + 2, b1, sam);

            if (dd)  return this.spec.arr[a1 + 1][b1];

          }
          if (b1 - 2 >= 0) {
            const cc = locBool('w', 'wCr', a1, b1 - 1, a1, b1 - 2, sam);
            if (cc) return this.spec.arr[a1][b1 - 1];
          }
        }
        if (this.spec.arr[a][b - 1].cheker === Cr) {
          a1 = a;
          b1 = b - 1;

          const sam = this.spec.arr[a1][b1].cheker;
          if (a1 - 2 >= 0)   {
            const aa = locBool('b', 'bCr', a1 - 1, b1, a1 - 2, b1, sam);

            if (aa)  return this.spec.arr[a1 - 1][b1];
          }

          if (b1 + 2 <= 7)  {
            const bb = locBool('b', 'bCr', a1, b1 + 1, a1, b1 + 2, sam);

            if (bb) return this.spec.arr[a1][b1 + 1];
          }
          if (a1 + 2 <= 6)  {
            const dd = locBool('w', 'wCr', a1 + 1, b1, a1 + 2, b1, sam);

            if (dd)  return this.spec.arr[a1 + 1][b1];

          }
          if (b1 - 2 >= 0) {
            const cc = locBool('w', 'wCr', a1, b1 - 1, a1, b1 - 2, sam);
            if (cc) return this.spec.arr[a1][b1 - 1];
          }
        }
      }
    }
    return false;

  }
}

class Move {
  constructor(arr, draw, rules) {
    this.spec = arr;
    this.drawing = draw;
    this.rule = rules;
  }

  move(now, pre, you, enemy) {

    const inside = (e, d, now, pre) => {
      if (e && (e === d)) {
        this.rule.ruleToKill(now, pre).cheker = 'null';
        this.spec.findSpecAr(now).cheker = you;
        this.spec.findSpecAr(pre).cheker = 'null';
        if (this.rule.ruleOpportTo(enemy)) flag++;
      }
    };

    const c = this.rule.ruleForStep(now, pre, you);
    const a = this.spec.findSpecAr(now).cheker;
    const b = this.spec.findSpecAr(pre).cheker;
    const d = this.rule.ruleToKill(now, pre);
    const e = this.rule.ruleOpportTo(enemy);
    const f = this.rule.ruleOpportToCr(you);
    if (b === you && a === 'null' && c && !e && !f) {
      if (c) {
        this.spec.findSpecAr(now).cheker = you;
        this.spec.findSpecAr(pre).cheker = 'null';
      }
      if (d) {
        this.rule.ruleToKill(now, pre).cheker = 'null';
        this.spec.findSpecAr(now).cheker = you;
        this.spec.findSpecAr(pre).cheker = 'null';
      }
    }
    inside(e, d, now, pre);
  }

  moveCr(now, pre, you, enemy, youCr) {

    const inside = (now, pre, e, d) => {
      if (e && (e === d)) {
        this.rule.ruleToKillCr(now, pre, 'b').cheker = 'null';
        this.spec.findSpecAr(now).cheker = 'bCr';
        this.spec.findSpecAr(pre).cheker = 'null';
        if (this.rule.ruleOpportToCr('b')) flag--;
      }
    };

    const a = this.spec.findSpecAr(now).cheker;
    const b = this.spec.findSpecAr(pre).cheker;
    const c = this.rule.ruleForStep(now, pre, 'Cr');
    const d = this.rule.ruleToKillCr(now, pre, you);
    const e = this.rule.ruleOpportToCr(you);
    const f = this.rule.ruleOpportTo(enemy);

    if (a === 'null' && b === youCr && !e && !f) {
      if (c) {
        this.spec.findSpecAr(now).cheker = youCr;
        this.spec.findSpecAr(pre).cheker = 'null';
      }
      if (d) {
        this.rule.ruleToKillCr(now, pre, you).cheker = 'null';
        this.spec.findSpecAr(now).cheker = youCr;
        this.spec.findSpecAr(pre).cheker = 'null';
      }
    }
    inside(now, pre, e, d);
  }
}

const drawing = new Draw();
const spec =  new ChekArr(arr, drawing);
const rule = new Rules(spec, drawing);
const mover = new Move(spec, drawing, rule);

function mousedown(e) {
  click = true;
  relativeY = mouseMoveHandlerY(e);
  relativeX = mouseMoveHandlerX(e);

  spec.findChoosedCell();
  everyStep();
}

function mouseup() {
  click = false;
  everyStep();
}

function mouseMoveHandlerY(e) {
  return e.clientY;
}

function mouseMoveHandlerX(e) {
  return e.clientX;
}

const socket = new WebSocket('ws://127.0.0.1:8080/');

function everyStep() {
  drawing.drawDesk();
  drawing.druwTurn(flag);

  if (!flag) {
    if (rule.ruleOpportToCr('b')) {
      drawing.drawMust(rule.ruleOpportToCr('b').x, rule.ruleOpportToCr('b').y);
    }
    if (rule.ruleOpportTo('w')) {
      drawing.drawMust(rule.ruleOpportTo('w').x, rule.ruleOpportTo('w').y);
    }

  } else {
    if (rule.ruleOpportToCr('w')) {
      drawing.drawMust(rule.ruleOpportToCr('w').x, rule.ruleOpportToCr('w').y);
    }
    if (rule.ruleOpportTo('b')) {

      drawing.drawMust(rule.ruleOpportTo('b').x, rule.ruleOpportTo('b').y);
    }
  }
  spec.drawChekers();

  if (click) {
    if (spec.findSpecAr(choosenCellPrev) && flag) {
      const cBool = spec.findSpecAr(choosenCellPrev).cheker === 'w';
      const aBool = spec.findSpecAr(choosenCellPrev).cheker === 'wCr';
      if (cBool || aBool) {
        mover.moveCr(choosenCellNow, choosenCellPrev, 'w', 'b', 'wCr');
        mover.move(choosenCellNow, choosenCellPrev, 'w', 'b');
        if (spec.findSpecAr(choosenCellPrev).cheker === 'null') {
          flag--;       socket.send(JSON.stringify(spec));

        }
      }
    }
    if (spec.findSpecAr(choosenCellPrev)  && !flag) {
      const dBool = spec.findSpecAr(choosenCellPrev).cheker === 'b';
      const bBool = spec.findSpecAr(choosenCellPrev).cheker === 'bCr';
      if (bBool || dBool) {
        mover.moveCr(choosenCellNow, choosenCellPrev, 'b', 'w', 'bCr');
        mover.move(choosenCellNow, choosenCellPrev, 'b', 'w');
        if (spec.findSpecAr(choosenCellPrev).cheker === 'null') {
          flag++;      socket.send(JSON.stringify(spec));

        }
      }

    }
    spec.chekOnCrown();
  }

}

const funcForStart = () => {
  spec.findZones();
  spec.workWithSpecArr();
  spec.firstFilling();
  everyStep();
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
  spec.arr =  JSON.parse(event.data);

  if (flag) flag--;
  else flag++;
  everyStep();
};



