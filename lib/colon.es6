import Container from './container';
import Node from './node';

export default class Colon extends Node {
  constructor (opts) {
    super(opts);
    this.type = 'colon';
  }
}

Container.registerWalker(Colon);
