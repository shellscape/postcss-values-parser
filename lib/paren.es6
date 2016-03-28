import Container from './container';
import Node from './node';

export default class Parenthesis extends Node {
  constructor (opts) {
    super(opts);
    this.type = 'paren';
    this.parenType = '';
  }
}

Container.registerWalker(Parenthesis);
