'use strict';

class Draw {
  constructor(canvas, turncanvas) {
    this.CHEKER_R = 25;
    this.cell = { h: 60, w: 60 };
    this.canv = canvas;
    this.turncanvas = turncanvas;
    this.ctx = canvas.getContext('2d');
    this.ctxturn = turncanvas.getContext('2d');
    this.turnCellW = 80;
    this.diffRad = 5;
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
    this.ctx.arc(xR, yR, this.CHEKER_R - this.diffRad, 0, Math.PI * 2, false);
    this.ctx.fillStyle = '#0774a6';
    this.ctx.fill();
    this.ctx.closePath();
  }

  drawDesk() {
    this.ctx.clearRect(0, 0, this.canv.width, this.canv.height);
    for (let xCell = 0; xCell < this.canv.width; xCell += 2 * this.cell.w) {
      for (let yCell = 0; yCell < this.canv.height; yCell += 2 * this.cell.h) {
        this.drawDeskCells(xCell, yCell);
        this.drawDeskCells(xCell + this.cell.h, yCell + this.cell.w);
      }
    }
  }

  druwTurn(flag) {
    const pos = this.turncanvas.width / 2;

    this.ctxturn.clearRect(0, 0, this.turnCellW, this.turnCellW);
    this.ctxturn.beginPath();
    this.ctxturn.arc(pos, pos, pos - this.diffRad, 0, Math.PI * 2, false);
    if (!flag) this.ctxturn.fillStyle = 'black';
    else  this.ctxturn.fillStyle = 'white';
    this.ctxturn.fill();
    this.ctxturn.closePath();
  }
}
