/*
  Copyright © 2018 Andrew Powell

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of this Source Code Form.
*/
const Node = require('postcss/lib/node');

/**
 * @desc Punctuation nodes can contain:
 *       , : ( ) { } [ ]
 */
class Punctuation extends Node {
  constructor(options) {
    super(options);
    this.type = 'punctuation';
  }

  static get chars() {
    return [':', '(', ')', '[', ']', '{', '}'];
  }

  static fromTokens(tokens, parser) {
    parser.fromFirst(tokens, Punctuation);
  }

  static test(what) {
    return /,|:|\(|\)|\{|\}|\[|\]/.test(what);
  }

  static tokenizeBrackets(tokens, parser) {
    const [first, ...rest] = tokens;
    const bits = first[1].split(/([()])/g).filter((t) => !!t);
    const newTokens = [];
    const [, , startLine, , endLine] = first;
    let [, , , startChar, , endChar] = first;

    for (const bit of bits) {
      let type = bit === '(' ? '(' : bit === ')' ? ')' : 'word';

      if (/^\s+$/.test(bit)) {
        type = 'space';
      }

      if (bit !== bits[0]) {
        startChar = endChar + 1;
      }

      endChar = startChar + bit.length - 1;

      newTokens.push([type, bit, startLine, startChar, endLine, endChar]);
    }

    parser.back(newTokens.concat(rest));
  }

  static tokenizeCommas(tokens, parser) {
    const [first, ...rest] = tokens;
    const bits = first[1].split(/([,])/g).filter((t) => !!t);
    const newTokens = [];
    const [, , startLine, , endLine] = first;
    let [, , , startChar, , endChar] = first;

    for (const bit of bits) {
      if (bit !== bits[0]) {
        startChar = endChar + 1;
      }

      endChar = startChar + bit.length - 1;

      newTokens.push(['word', bit, startLine, startChar, endLine, endChar]);
    }

    parser.back(newTokens.concat(rest));
  }
}

module.exports = Punctuation;
