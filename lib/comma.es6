import Container from './container';
import Node from './node';

export default class Comma extends Node {
  constructor (opts) {
    super(opts);
    this.type = 'comma';
  }
}

Container.registerWalker(Comma);
