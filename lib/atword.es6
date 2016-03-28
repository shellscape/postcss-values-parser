import Container from './container';

export default class AtWord extends Container {
  constructor (opts) {
    super(opts);
    this.type = 'atword';
  }
}

Container.registerWalker(AtWord);
