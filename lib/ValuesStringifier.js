const Stringifier = require('postcss/lib/stringifier');

module.exports = class ValuesStringifier extends Stringifier {
  static stringify(node, builder) {
    const stringifier = new ValuesStringifier(builder);
    stringifier.stringify(node);
  }

  basic(node) {
    const after = this.raw(node, 'after');

    this.builder(node.value, node, 'start');
    this.builder(after || '', node, 'end');
  }

  atword(...args) {
    this.atrule(...args);
  }

  comment(node) {
    if (node.inline) {
      const left = this.raw(node, 'left', 'commentLeft');
      const right = this.raw(node, 'right', 'commentRight');
      this.builder(`//${left}${node.text}${right}`, node);
    } else {
      super.comment(node);
    }
  }

  func(node) {
    const after = this.raw(node, 'after');

    this.builder(node.name + node.params, node, 'start');
    this.builder(after || '', node, 'end');
  }

  interpolation(node) {
    const after = this.raw(node, 'after');

    this.builder(node.prefix + node.params, node, 'start');
    this.builder(after || '', node, 'end');
  }

  numeric(node) {
    const start = node.value + node.unit;
    const after = this.raw(node, 'after');

    this.builder(start, node, 'start');
    this.builder(after || '', node, 'end');
  }

  operator(node) {
    this.basic(node);
  }

  punctuation(node) {
    this.basic(node);
  }

  quoted(node) {
    this.basic(node);
  }

  unicodeRange(node) {
    this.basic(node);
  }

  word(node) {
    this.basic(node);
  }
};
