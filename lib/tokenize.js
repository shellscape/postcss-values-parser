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

    // TODO: need to adjust the line/char offsets
    if (token[0] === 'brackets') {
      const part = token[1].slice(1, token[1].length - 1);
      const tokens = [['(', '('], ...getTokens(part)];
      tokens.push([')', ')']);

      for (const tokn of tokens.reverse()) {
        tokenize.back(tokn);
      }

      token = ogNextToken(...nextArgs);
    } else if (token[0] === 'word' && token[1].length > 1 && token[1].includes(',')) {
      const bits = token[1].split(',');
      for (const bit of bits.reverse()) {
        tokenize.back(['word', bit || ',']);
      }
      token = ogNextToken(...nextArgs);
    }

    return token;
  };

  return tokenize;
};

module.exports = { getTokens, tokenizer: wrapTokenizer };
