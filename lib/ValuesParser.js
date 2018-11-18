/* eslint no-param-reassign: off */

const Parser = require('postcss/lib/parser');

const { tokenizer } = require('./tokenize');

const Operator = require('./nodes/Operator');

module.exports = class ValuesParser extends Parser {
  constructor(...args) {
    super(...args);

    this.lastNode = null;
  }

  createTokenizer() {
    this.tokenizer = tokenizer(this.input);
  }

  init(node, line, column) {
    super.init(node, line, column);
    this.lastNode = node;
  }

  operator(tokens) {
    const [first] = tokens;
    const [, , startLine, startChar] = first;

    const node = new Operator();
    this.init(node, startLine, startChar);

    [, node.value] = first;
    this.current = node;
    this.end(first);

    for (const token of tokens.slice(1).reverse()) {
      this.tokenizer.back(token);
    }
  }

  unknownWord(tokens) {
    const [first] = tokens;
    // NOTE: keep commented for examining unknown structures
    // console.log('unknown', tokens);

    if (first[0] === 'operator') {
      this.operator(tokens);
    } else {
      super.unknownWord(tokens);
    }
  }
};
