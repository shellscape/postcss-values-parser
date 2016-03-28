import Container from './container';
import Node from './node';

export default class Number extends Node {
  constructor (opts) {
    super(opts);
    this.type = 'number';
    this.unit = opts.unit || '';
  }

  toString () {
    // console.log('node >', 'toString:', this.value);

    return [
      this.raws.before,
      String(this.value),
      this.unit,
      this.raws.after
    ].join('');
  }
}

Container.registerWalker(Number);
