import Container from './container';
import Node from './node';

export default class Comment extends Node {
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
}

Container.registerWalker(Comment);
