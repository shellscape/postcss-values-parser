/*
  Copyright © 2018 Andrew Powell

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of this Source Code Form.
*/
const Input = require('postcss/lib/input');
const tokenizer = require('postcss/lib/tokenize');

const operators = ['*', '-', '%', '+'];

const getTokens = (what) => {
  const input = new Input(what, {});
  const tokenize = wrapTokenizer(input); // eslint-disable-line no-use-before-define
  const result = [];

  // this shouldn't ever be slow as the string being tokenized will always be small
  while (!tokenize.endOfFile()) {
    const token = tokenize.nextToken();
    result.push(token);
  }

  return result;
};

const wrapTokenizer = (...args) => {
  const tokenize = tokenizer(...args);
  const ogNextToken = tokenize.nextToken;

  tokenize.nextToken = (...nextArgs) => {
    let token = ogNextToken(...nextArgs);

    if (!token) {
      return token;
    }

    // TODO: need to adjust the line/char offsets
    if (token[0] === 'brackets') {
      const [, , startLine, startChar, endLine, endChar] = token;
      const part = token[1].slice(1, token[1].length - 1);
      const subTokens = getTokens(part);

      // adjust line position numbers
      for (const sub of subTokens) {
        if (sub[0] !== 'space') {
          const length = sub[5] - sub[3];
          sub[2] = startLine;
          sub[3] += startChar;
          sub[4] += endLine - 1;
          sub[5] = sub[3] + length;
        }
      }

      const tokens = [['(', '(', startLine, startChar, startLine, startChar], ...subTokens];
      tokens.push([')', ')', startLine, endChar, endLine, endChar]);

      for (const tokn of tokens.reverse()) {
        tokenize.back(tokn);
      }

      token = ogNextToken(...nextArgs);
    } else if (token[0] === 'word' && token[1].length > 1 && token[1].includes(',')) {
      const bits = token[1].split(',');
      const tokens = [];
      const [, , startLine, , endLine] = token;
      let [, , , startChar, , endChar] = token;

      for (let bit of bits) {
        bit = bit || ',';
        const name = bit === ',' ? 'comma' : 'word';

        if (bit !== bits[0]) {
          startChar = endChar + 1;
        }

        endChar = startChar + bit.length - 1;

        tokens.push([name, bit, startLine, startChar, endLine, endChar]);
      }

      for (const tokn of tokens.reverse()) {
        tokenize.back(tokn);
      }

      token = ogNextToken(...nextArgs);
    } else if (operators.includes(token[1])) {
      token[0] = 'operator';
    }

    return token;
  };

  return tokenize;
};

module.exports = { getTokens, tokenizer: wrapTokenizer };
