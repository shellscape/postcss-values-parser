const Node = require('postcss/lib/node');

class Operator extends Node {
  constructor(opts) {
    super(opts);
    this.type = 'operator';
  }
}

module.exports = Operator;
