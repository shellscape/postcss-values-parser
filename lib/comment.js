'use strict';

const Container = require('./container');
const Node = require('./node');

class Comment extends Node {
  constructor (opts) {
    super(opts);
    this.type = 'comment';
  }

  toString () {
    return [
      this.raws.before,
      '/*',
      String(this.value),
      '*/',
      this.raws.after
    ].join('');
  }
};

Container.registerWalker(Comment);

module.exports = Comment;
