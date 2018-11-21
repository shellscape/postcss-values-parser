/*
  Copyright © 2018 Andrew Powell

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of this Source Code Form.
*/

// TODO: handle invalid css; 5+5 etc.

const isNumber = require('is-number');
const Parser = require('postcss/lib/parser');

const Comment = require('./nodes/Comment');
const Func = require('./nodes/Func');
const Interpolation = require('./nodes/Interpolation');
const Numeric = require('./nodes/Numeric');
const Operator = require('./nodes/Operator');
const Punctuation = require('./nodes/Punctuation');
const Quoted = require('./nodes/Quoted');
const UnicodeRange = require('./nodes/UnicodeRange');
const Word = require('./nodes/Word');

const defaults = {
  // interpolation: { prefix: '@' }
  interpolation: false,
  variables: {
    prefixes: ['--']
  }
};

module.exports = class ValuesParser extends Parser {
  constructor(input, opts = {}) {
    super(input);

    this.lastNode = null;
    this.options = Object.assign({}, defaults, opts);
  }

  back(tokens) {
    for (const token of tokens.reverse()) {
      this.tokenizer.back(token);
    }
  }

  comment(token) {
    super.comment(token);

    const inline = Comment.testInline(token);
    const node = this.lastNode;
    node.inline = inline;
  }

  fromFirst(tokens, Constructor) {
    const [first] = tokens;
    const [, value, startLine, startChar] = first;
    const node = new Constructor({ value });

    this.init(node, startLine, startChar);
    this.current = node;
    this.end(first);
    this.back(tokens.slice(1));
  }

  init(node, line, column) {
    super.init(node, line, column);

    // base methods like comment() don't set this.current, so we need some way of tracking the last
    // node for manipulation
    this.lastNode = node;
  }

  other(start) {
    // console.log('other', start);

    const brackets = [];
    const tokens = [];
    let token = start;
    let type = null;
    let bracket = null;

    while (token) {
      [type] = token;
      tokens.push(token);

      if (type === '(' || type === '[') {
        if (!bracket) {
          bracket = token;
        }

        brackets.push(type === '(' ? ')' : ']');
      } else if (type === brackets[brackets.length - 1]) {
        brackets.pop();
        if (brackets.length === 0) {
          bracket = null;
        }
      }

      token = this.tokenizer.nextToken();
    }

    if (brackets.length > 0) {
      this.unclosedBracket(bracket);
    }

    this.unknownWord(tokens);
  }

  // overriden to remove certain node types we don't need
  parse() {
    let token;
    while (!this.tokenizer.endOfFile()) {
      token = this.tokenizer.nextToken();

      switch (token[0]) {
        case 'space':
          this.spaces += token[1];
          break;

        case 'comment':
          this.comment(token);
          break;

        case 'at-word':
          this.atrule(token);
          break;

        default:
          this.other(token);
          break;
      }
    }
    this.endFile();
  }

  unicodeRange(tokens) {
    this.fromFirst(tokens, UnicodeRange);
  }

  unknownWord(tokens) {
    // NOTE: keep commented for examining unknown structures
    // console.log('unknown', tokens);

    const [first] = tokens;
    const [type, value] = first;

    if (Punctuation.chars.includes(type)) {
      Punctuation.fromTokens(tokens, this);
    } else if (Func.test(tokens)) {
      if (!Func.fromTokens(tokens, this)) {
        super.unknownWord(tokens);
      }
    } else if (this.options.interpolation && Interpolation.test(tokens, this)) {
      if (!Interpolation.fromTokens(tokens, this)) {
        super.unknownWord(tokens);
      }
    } else if (type === 'brackets') {
      Punctuation.tokenizeBrackets(tokens, this);
    } else if (type === 'string') {
      Quoted.fromTokens(tokens, this);
    } else if (type === 'word') {
      if (value === ',') {
        Punctuation.fromTokens(tokens, this);
      } else if (value === '//') {
        Comment.tokenizeNext(tokens, this);
      } else if (Comment.testInline(first)) {
        Comment.tokenizeInline(tokens, this);
      } else if (value.includes(',')) {
        Punctuation.tokenizeCommas(tokens, this);
      } else if (Word.testVariable(first, this)) {
        // this may seem redundant, but we need to catch variables before the numeric and operator
        // tests
        Word.fromTokens(tokens, this);
      } else if (isNumber(value) || Numeric.unitTest(value)) {
        Numeric.fromTokens(tokens, this);
      } else if (UnicodeRange.test(value)) {
        UnicodeRange.fromTokens(tokens, this);
      } else if (/^\w+$/.test(value)) {
        Word.fromTokens(tokens, this);
      } else if (Operator.chars.includes(value)) {
        Operator.fromTokens(tokens, this);
      } else if (Operator.regex.test(value)) {
        Operator.tokenize(tokens, this);
      } else {
        super.unknownWord(tokens);
      }
    } else {
      super.unknownWord(tokens);
    }
  }
};
