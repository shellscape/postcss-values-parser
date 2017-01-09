const Container = require('./container');

class AtWord extends Container {
  constructor (opts) {
    super(opts);
    this.type = 'atword';
  }
}

Container.registerWalker(AtWord);

module.exports = AtWord;
