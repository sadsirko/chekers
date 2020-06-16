'use strict';

function everyStep(drawing, rule, spec, mover, choosCellNow, choosCellPrev) {
  drawing.drawDesk();
  drawing.druwTurn(spec.flag);

  const highlight = col => {
    if (rule.ruleOpportToCr(col)) {
      drawing.drawMust(rule.ruleOpportToCr(col).x, rule.ruleOpportToCr(col).y);
    }
    if (rule.ruleOpportTo(col)) {
      drawing.drawMust(rule.ruleOpportTo(col).x, rule.ruleOpportTo(col).y);
    }
  };

  const makeMove = (flag, col, colCr, antCl, char) => {
    if (spec.findSpecAr(choosCellPrev) && flag) {
      const cBool = spec.findSpecAr(choosCellPrev).cheker === col;
      const aBool = spec.findSpecAr(choosCellPrev).cheker === colCr;
      if (cBool || aBool) {
        mover.moveCr(choosCellNow, choosCellPrev, col, antCl, colCr, spec.flag);
        mover.move(choosCellNow, choosCellPrev, col, antCl, spec.flag);
        if (spec.findSpecAr(choosCellPrev).cheker === 'null') {
          spec.changeFlag(char);       socket.send(JSON.stringify(spec.arr));
        }
      }
      spec.chekOnCrown();
    }
  };

  if (!spec.flag) {
    highlight('b');
  } else {
    highlight('w');
  }
  makeMove(spec.flag, 'w', 'wCr', 'b', '-');
  makeMove(!spec.flag, 'b', 'bCr', 'w', '+');
  spec.drawChekers();

  if (spec.findSpecAr(choosCellPrev)  && !spec.flag) {
    const dBool = spec.findSpecAr(choosCellPrev).cheker === 'b';
    const bBool = spec.findSpecAr(choosCellPrev).cheker === 'bCr';
    if (bBool || dBool) {
      mover.moveCr(choosCellNow, choosCellPrev, 'b', 'w', 'bCr', spec.flag);
      mover.move(choosCellNow, choosCellPrev, 'b', 'w', spec.flag);
      if (spec.findSpecAr(choosCellPrev).cheker === 'null') {
        spec.changeFlag('+');      socket.send(JSON.stringify(spec.arr));
      }
    }
    spec.chekOnCrown();
  }
}
