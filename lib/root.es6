import Container from './container';

export default class Root extends Container {
  constructor (opts) {
    super(opts);
    this.type = 'root';
  }
}
