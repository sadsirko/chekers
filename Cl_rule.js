'use strict'

class Rules {
    constructor(desk, draw) {
      this.spec = desk;
      this.drawing = draw;
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