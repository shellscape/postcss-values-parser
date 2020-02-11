/*
  Copyright © 2018 Andrew Powell

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of this Source Code Form.
*/
const assert = require('assert').strict;

const Input = require('postcss/lib/input');

const Parser = require('./ValuesParser');
const SubInput = require('./SubInput');
const { stringify } = require('./ValuesStringifier');

const NEWLINE = '\n'.charCodeAt(0);
const FEED = '\f'.charCodeAt(0);
const CR = '\r'.charCodeAt(0);

function positionAfter(node, chunks) {
  let { line } = node.source.start;
  let { column } = node.source.start;
  for (const chunk of chunks) {
    for (let i = 0; i < chunk.length; i++) {
      const code = chunk.charCodeAt(i);
      if (
        code === NEWLINE ||
        code === FEED ||
        (code === CR && chunk.charCodeAt(i + 1) !== NEWLINE)
      ) {
        column = 1;
        line += 1;
      } else {
        column += 1;
      }
    }
  }

  return { line, column };
}

module.exports = {
  parse(css, options) {
    let input;
    if (options.context) {
      assert(options.lineInContext);
      assert(options.columnInContext);
      input = new SubInput(css, options.context, options.lineInContext, options.columnInContext);
    } else {
      input = new Input(css, options);
    }

    const parser = new Parser(input, options);

    parser.parse();

    const { root } = parser;
    const ogToString = root.toString;

    function toString(stringifier) {
      return ogToString.bind(root)(stringifier || module.exports.stringify);
    }

    root.toString = toString.bind(root);

    return parser.root;
  },

  parseDeclValue(decl) {
    const { line, column } = positionAfter(decl, [decl.prop, decl.raws.between]);
    return module.exports.parse(decl.value, {
      context: decl.source.input,
      lineInContext: line,
      columnInContext: column
    });
  },

  parseAtRuleParams(rule) {
    const { line, column } = positionAfter(rule, ['@', rule.name, rule.raws.afterName]);
    return module.exports.parse(rule.value, {
      context: rule,
      lineInContext: line,
      columnInContext: column
    });
  },

  stringify,

  nodeToString(node) {
    let result = '';

    module.exports.stringify(node, (bit) => {
      result += bit;
    });

    return result;
  }
};
