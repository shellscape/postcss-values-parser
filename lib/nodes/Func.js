/*
  Copyright © 2018 Andrew Powell

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of this Source Code Form.
*/
const { registerWalker } = require('../walker');

const Container = require('./Container');

const colorFunctions = ['hsl', 'hsla', 'rgb', 'rgba'];

class Func extends Container {
  constructor(options = {}) {
    super(options);
    this.type = 'func';
    this.isColor = false;
    this.name = options.name || '';
    if (!this.nodes) {
      this.nodes = [];
    }
  }

  static test(tokens) {
    return (
      tokens.length > 1 &&
      tokens[0][0] === 'word' &&
      (tokens[1][0] === 'brackets' || tokens[1][0] === '(')
    );
  }

  static fromTokens(tokens, parser) {
    const [[, , startLine, startChar]] = tokens;
    const [name, brackets] = tokens.splice(0, 2);
    const node = new Func({ name: name[1] });
    let foundParens = 0;
    let expectedParens = 1;
    let lastToken = brackets;

    parser.init(node, startLine, startChar);
    parser.current = node; // eslint-disable-line no-param-reassign

    if (brackets[0] === 'brackets') {
      expectedParens = brackets[1].match(/[(]/g).length - 1;
    }

    const rightTokens = [];
    // the number of closing parens we should expect, minus one for the closing paren of brackets

    for (const token of tokens) {
      if (foundParens < expectedParens) {
        if (token[1] === ')') {
          foundParens += 1;
        } else if (token[1] === '(') {
          expectedParens += 1;
        }
        brackets[1] += token[1];
        lastToken = token;
      } else {
        rightTokens.push(token);
      }
    }

    if (foundParens !== expectedParens) {
      parser.unclosedBracket(brackets);
    }

    [, node.params] = brackets;

    const params = brackets[1].slice(1, -1);

    if (params.length) {
      let opts = parser.options;

      if (node.name === 'url') {
        // any unknown words are likely part of a url. let the consumer scrutinize the result
        opts = Object.assign({}, parser.options, { ignoreUnknownWords: true });
      }
      opts.parentNode = node;
      // use a new parser to parse the params of the function. recursion here makes for easier maint
      // we must require this here due to circular dependency resolution
      const { parse } = require('../'); // eslint-disable-line global-require
      const root = parse(params, opts);
      const { nodes: children } = root;

      // TODO: correct line and character position (should we just pad the input? probably easiest)
      for (const child of children) {
        node.push(child);
      }

      if (root.raws.after) {
        node.last.raws.after = root.raws.after;
      }
    }

    parser.end(lastToken);
    parser.back(rightTokens);

    const { lastNode } = parser;
    lastNode.isColor = colorFunctions.includes(lastNode.name.toLowerCase());
  }
}

registerWalker(Func);

module.exports = Func;
