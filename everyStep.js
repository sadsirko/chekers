'use strict'

function everyStep(drawing, rule, spec, mover, choosenCellNow, choosenCellPrev) {
    drawing.drawDesk();
    drawing.druwTurn(spec.flag);
  
    if (!spec.flag) {
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
  
    if (spec.findSpecAr(choosenCellPrev) && spec.flag) {
      const cBool = spec.findSpecAr(choosenCellPrev).cheker === 'w';
      const aBool = spec.findSpecAr(choosenCellPrev).cheker === 'wCr';
      if (cBool || aBool) {
        mover.moveCr(choosenCellNow, choosenCellPrev, 'w', 'b', 'wCr', spec.flag);
        mover.move(choosenCellNow, choosenCellPrev, 'w', 'b', spec.flag);
        if (spec.findSpecAr(choosenCellPrev).cheker === 'null') {
          spec.changeFlag('-');       socket.send(JSON.stringify(spec.arr));
        }
      }
    }
    if (spec.findSpecAr(choosenCellPrev)  && !spec.flag) {
      const dBool = spec.findSpecAr(choosenCellPrev).cheker === 'b';
      const bBool = spec.findSpecAr(choosenCellPrev).cheker === 'bCr';
      if (bBool || dBool) {
        mover.moveCr(choosenCellNow, choosenCellPrev, 'b', 'w', 'bCr',spec.flag);
        mover.move(choosenCellNow, choosenCellPrev, 'b', 'w',spec.flag);
        if (spec.findSpecAr(choosenCellPrev).cheker === 'null') {
          spec.changeFlag('+');      socket.send(JSON.stringify(spec.arr));
  
        }
      }
  
  
      spec.chekOnCrown();
    }
  }