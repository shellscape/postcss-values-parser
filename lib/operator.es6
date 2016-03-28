import Container from './container';
import Node from './node';

export default class Operator extends Node {
  constructor (opts) {
    super(opts);
    this.type = 'operator';
  }
}

Container.registerWalker(Operator);
