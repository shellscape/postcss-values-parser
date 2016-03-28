import Container from './container';
import Node from './node';

export default class Word extends Node {
  constructor (opts) {
    super(opts);
    this.type = 'word';
  }
}

Container.registerWalker(Word);
