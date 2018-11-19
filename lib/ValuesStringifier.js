const Stringifier = require('postcss/lib/stringifier');

module.exports = class LessStringifier extends Stringifier {
  comment(node) {
    if (node.inline) {
      const left = this.raw(node, 'left', 'commentLeft');
      const right = this.raw(node, 'right', 'commentRight');
      this.builder(`//${left}${node.text}${right}`, node);
    } else {
      super.comment(node);
    }
  }

  numeric(node) {
    const start = node.value + node.unit;
    const after = this.raw(node, 'after');

    this.builder(start, node, 'start');
    this.builder(after || '', node, 'end');
  }

  operator(node) {
    const after = this.raw(node, 'after');

    this.builder(node.value, node, 'start');
    this.builder(after || '', node, 'end');
  }
};
