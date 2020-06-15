'use strict';

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

        if (this.rule.ruleOpportTo(enemy)) {
          if (you === 'b')
            this.spec.changeFlag('-');
          else
            this.spec.changeFlag('+');
        }

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
        this.rule.ruleToKillCr(now, pre, you).cheker = 'null';
        this.spec.findSpecAr(now).cheker = youCr;
        this.spec.findSpecAr(pre).cheker = 'null';
        if (this.rule.ruleOpportToCr(you)) {
          if (you === 'b')
            this.spec.changeFlag('-');
          else
            this.spec.changeFlag('+');
        }

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
