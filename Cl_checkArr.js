'use strict';

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
  constructor(arr, drawMeth, listener) {
    this.arr = arr;
    this.zone = [];
    this.drawing = drawMeth;
    this.cell = { h: 60, w: 60 };
    this.LINES = 4;
    this.USABLE_CELL = 32;
    this.listen = listener;
    this.choosenCellNow = 0;
    this.choosenCellPrev = 19;
    this.flag = 1;
  }
  changeFlag(sym) {
    if (sym === '+')
      this.flag++;
    else this.flag--;
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

  findChoosedCell(relativeX, relativeY) {
    let buffer;
    for (let i = 1; i <= this.USABLE_CELL; i++) {
      const a = relativeX > this.zone[i].x;
      const b = relativeX < this.zone[i].x + this.cell.w;
      const c = relativeY > this.zone[i].y;
      const d = relativeY < this.zone[i].y + this.cell.w;
      if (a && b & c && d && i !== this.choosenCellNow) {
        this.choosenCellPrev = this.choosenCellNow;
        this.choosenCellNow = i;
      }
    }
    if (this.choosenCellNow !== buffer) buffer = this.choosenCellNow;
    return { now: this.choosenCellNow, pre: this.choosenCellPrev };
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
