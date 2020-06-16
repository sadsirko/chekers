'use strict';

class Rules {
  constructor(desk, draw) {
    this.spec = desk;
    this.drawing = draw;
    this.LINES = 4;
  }

  ruleForStep(now, pre, color) {
    const a1 = this.spec.findSpecAr(now).a;
    const b1 = this.spec.findSpecAr(now).b;
    const a2 = this.spec.findSpecAr(pre).a;
    const b2 = this.spec.findSpecAr(pre).b;
    const c = (b1 - b2);
    const d = (a1 - a2);
    // cheker change the cell ,
    const up =  (((a2 - a1) === 1) && (b1 === b2));
    const down = ((d === 1) && (b1 === b2));
    const left = ((a1 === a2) && (c === 1));
    const right = ((a1 === a2) && ((b2 - b1) === 1));

    const white = (color === 'w' && (up || left));
    const black = (color === 'b' && (down || right));
    const crown = (color === 'Cr' && (up || down || right || left));

    if (white || black || crown) return true;
    return false;
  }

  ruleToKill(now, pre) {

    const a1 = this.spec.findSpecAr(now).a;
    const b1 = this.spec.findSpecAr(now).b;
    const a2 = this.spec.findSpecAr(pre).a;
    const b2 = this.spec.findSpecAr(pre).b;
    const sa = this.spec.arr;

    const up = ((a2 - a1) === 2) && (b1 === b2);
    const down = ((a1 - a2) === 2) && (b1 === b2);
    const left =  (a1 === a2) && (b1 - b2 === 2);
    const right = (a1 === a2) && ((b2 - b1) === 2);

    if (up) {
      const sa1 = sa[a1 + 1][b1];
      if (sa1.cheker === 'b' || sa1.cheker === 'bCr') {
        return sa1;
      }
    }
    if (left) {
      const sa2 = sa[a1][b1 - 1];
      if (sa2.cheker === 'b' || sa2.cheker === 'bCr') {
        return sa2;
      }
    }
    if (down) {
      const sa3 = sa[a1 - 1][b1];
      if (sa3.cheker === 'w' || sa3.cheker === 'wCr') {
        return sa3;
      }
    }
    if (right) {
      const sa4 = sa[a1][b1 + 1];
      if (sa4.cheker === 'w' || sa4.cheker === 'wCr') {
        return sa4;
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

    if ((a2 - a1) === 2) {
      a = sa[a2 - 1][b1];
      if (((b1 - b2) === 0) && lockBull(a.cheker, sam, color)) {
        return a;
      }
    }
    if ((b1 - b2) === 2) {
      b = sa[a1][b2 + 1];
      if (((a1 - a2) === 0) && lockBull(b.cheker, sam, color)) {
        return  b;
      }
    }
    if ((a1 - a2) === 2) {
      c = sa[a2 + 1][b1];
      if (((b1 - b2) === 0) && lockBull(c.cheker, sam, color)) {
        return c;
      }
    }
    if ((b2 - b1) === 2) {
      d = sa[a1][b2 - 1];
      if (((a1 - a2) === 0) && lockBull(d.cheker, sam, color)) {
        return d;
      }
    }
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
      if (e && secondCell === 'null' && info.sam === info.col)
        return true;
      return false;
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
