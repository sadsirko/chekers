'use strict';

class Rules {
  constructor(desk, draw) {
    this.spec = desk;
    this.drawing = draw;
    this.LINES = 4;
  }

  fillPos(now, pre) {
    const a1 = this.spec.findSpecAr(now).a;
    const b1 = this.spec.findSpecAr(now).b;
    const a2 = this.spec.findSpecAr(pre).a;
    const b2 = this.spec.findSpecAr(pre).b;
    const pos = { a1, b1, a2, b2 };
    return pos;
  }

  fillDir(a1, b1, a2, b2, length) {
    const up =  (a2 - a1 === length && (b1 === b2));
    const down = (a1 - a2 === length && (b1 === b2));
    const left = (a1 === a2 && b1 - b2 === length);
    const right = (a1 === a2 && (b2 - b1 === length));
    const res = { up, down, left, right };
    return res;
  }

  ruleForStep(now, pre, clr) {
    const pos = this.fillPos(now, pre);
    const dir = this.fillDir(pos.a1, pos.b1, pos.a2, pos.b2, 1);
    const white = (clr === 'w' && (dir.up || dir.left));
    const black = (clr === 'b' && (dir.down || dir.right));
    const cr = (clr === 'Cr' && (dir.up || dir.down || dir.right || dir.left));
    if (white || black || cr) return true;
    return false;
  }

  ruleToKill(now, pre) {

    const locHelp = (a, b, clr, clrCr, sa, pos) => {
      const saLoc = sa[pos.a1 + a][pos.b1 + b];
      if (saLoc.cheker === clr || saLoc.cheker === clrCr)
        return saLoc;
    };

    const pos = this.fillPos(now, pre);
    const sa = this.spec.arr;
    const dir = this.fillDir(pos.a1, pos.b1, pos.a2, pos.b2, 2);

    if (dir.up) {
      const cell = locHelp(1, 0, 'b', 'bCr', sa, pos);
      if (cell) return cell;
    }
    if (dir.left) {
      const cell = locHelp(0, -1, 'b', 'bCr', sa, pos);
      if (cell) return cell;
    }
    if (dir.down) {
      const cell = locHelp(-1, 0, 'w', 'wCr', sa, pos);
      if (cell) return cell;
    }
    if (dir.right) {
      const cell = locHelp(0, 1, 'w', 'wCr', sa, pos);
      if (cell) return cell;
    }
    return false;
  }

  ruleToKillCr(now, pre, color) {

    const lockBull = (letter, spec, col) => {
      if ((letter !== spec) && (letter !== 'null') && (letter !== col))
        return true;
      return false;
    };

    const lockHelp = (firstB, secB, a, b, sa, sam) => {
      if (firstB === 2) {
        const tmp = sa[a][b];
        if (!secB && lockBull(tmp.cheker, sam, color))
          return tmp;
      }
    };

    let tmp;
    const pos = this.fillPos(now, pre);
    const sa = this.spec.arr;
    const sam = this.spec.arr[pos.a2][pos.b2].cheker;
    const up = pos.a1 - pos.a2;
    const bott = pos.b1 - pos.b2;
    tmp = lockHelp(pos.a2 - pos.a1, bott, pos.a2 - 1, pos.b1, sa, sam);
    if (tmp) return tmp;
    tmp = lockHelp(pos.b1 - pos.b2, up, pos.a1, pos.b2 + 1, sa, sam);
    if (tmp) return tmp;
    tmp = lockHelp(pos.a1 - pos.a2, bott, pos.a2 + 1, pos.b1, sa, sam);
    if (tmp) return tmp;
    tmp = lockHelp(pos.b2 - pos.b1, up, pos.a1, pos.b2 - 1, sa, sam);
    if (tmp) return tmp;
    return false;
  }
  // chek opportunities to beat
  ruleOpportTo(col) {
    let a1,  b1;
    let antcol, anClCr;
    const locBool = (info, preA, preB, nowA, nowB) => {
      const firstCell = this.spec.arr[preA][preB].cheker;
      const secondCell = this.spec.arr[nowA][nowB].cheker;
      const e = (firstCell ===  info.antcolCr || firstCell === info.antcol);
      return (e && secondCell === 'null' && info.sam === info.col);
    };

    if (col === 'w') { antcol = 'b'; anClCr = 'bCr'; }
    if (col === 'b') { antcol = 'w'; anClCr = 'wCr'; }

    const checkOport = (a, b) => {
      if (this.spec.arr[a][b].cheker === col) {
        a1 = a;
        b1 = b;
        const sam = this.spec.arr[a1][b1].cheker;
        const info = { col, antcol, sam, anClCr };
        if (col === 'w') {
          if (a1 - 2 >= 0)   {
            const aa = locBool(info, a1 - 1, b1, a1 - 2, b1,);
            if (aa)  return this.spec.arr[a1 - 1][b1];
          }
          if (b1 + 2 <= this.spec.specArrWidth - 1)  {
            const bb = locBool(info, a1, b1 + 1, a1, b1 + 2);
            if (bb) return this.spec.arr[a1][b1 + 1];
          }
        }
        if (col === 'b') {
          if (a1 + 2 <= this.spec.specArrHeight - 1)  {
            const dd = locBool(info, a1 + 1, b1, a1 + 2, b1);
            if (dd)  return this.spec.arr[a1 + 1][b1];
          }
          if (b1 - 2 >= 0) {
            const cc = locBool(info, a1, b1 - 1, a1, b1 - 2);
            if (cc) return this.spec.arr[a1][b1 - 1];
          }
        }
      }
    };

    for (let j = 0; j < this.LINES; j++) {
      for (let i = 0; i < this.LINES; i++) {
        const a = 0 + i + j;
        const b = 4 + i - j;
        const high = checkOport(a, b);
        const lower = checkOport(a, b - 1);
        if (high) return high;
        if (lower) return lower;
      }
    }
    return false;
  }

  ruleOpportToCr(col) {

    let a1,  b1, Cr;
    if (col === 'w') Cr = 'wCr';
    if (col === 'b') Cr = 'bCr';
    const locBool = (col, colCr, a, b, a2, b2,) => {
      const firstCell = this.spec.arr[a][b].cheker;
      const secondCell = this.spec.arr[a2][b2].cheker;
      const e = (firstCell !==  colCr && firstCell !== col);
      if (e && secondCell === 'null' && firstCell !== 'null')
        return true;
      return false;
    };

    const checkOportCr = (a, b, Cr) => {
      if (this.spec.arr[a][b].cheker === Cr) {
        a1 = a;
        b1 = b;
        if (a1 - 2 >= 0) {
          const aa = locBool(col, Cr, a1 - 1, b1, a1 - 2, b1,);
          if (aa)  return this.spec.arr[a1 - 1][b1];
        }
        if (b1 + 2 <= this.specArrWidth - 1)  {
          const bb = locBool(col, Cr, a1, b1 + 1, a1, b1 + 2,);
          if (bb) return this.spec.arr[a1][b1 + 1];
        }
        if (a1 + 2 <= this.spec.specArrHeight - 1)  {
          const dd = locBool(col, Cr, a1 + 1, b1, a1 + 2, b1,);
          if (dd)  return this.spec.arr[a1 + 1][b1];
        }
        if (b1 - 2 >= 0) {
          const cc = locBool(col, Cr, a1, b1 - 1, a1, b1 - 2,);
          if (cc) return this.spec.arr[a1][b1 - 1];
        }
      }
      return false;
    };
    for (let j = 0; j < this.LINES; j++) {
      for (let i = 0; i < this.LINES; i++) {
        const a = 0 + i + j;
        const b = 4 + i - j;

        const higher = checkOportCr(a, b, Cr);
        const lower = checkOportCr(a, b - 1, Cr);
        if (higher) return higher;
        if (lower) return lower;
      }
    }
    return false;
  }
}
