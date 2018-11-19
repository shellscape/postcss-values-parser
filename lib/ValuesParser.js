/*
  Copyright © 2018 Andrew Powell

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of this Source Code Form.
*/

/* eslint no-param-reassign: off */

const isNumber = require('is-number');
const Comment = require('postcss/lib/comment');
const Parser = require('postcss/lib/parser');

const { tokenizer } = require('./tokenize');

const Numeric = require('./nodes/Numeric');
const Operator = require('./nodes/Operator');
const Punctuation = require('./nodes/Punctuation');
const Quoted = require('./nodes/Quoted');
const UnicodeRange = require('./nodes/UnicodeRange');

module.exports = class ValuesParser extends Parser {
  constructor(...args) {
    super(...args);

    this.lastNode = null;
  }

  back(tokens) {
    for (const token of tokens.reverse()) {
      this.tokenizer.back(token);
    }
  }

  createTokenizer() {
    this.tokenizer = tokenizer(this.input);
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
    this.lastNode = node;
  }

  inlineComment(tokens) {
    const comment = [];
    const [first] = tokens;
    let last = first;

    for (const token of tokens) {
      const [, value] = token;
      if (value === '\n') {
        break;
      }
      comment.push(value);
      last = token;
    }

    const token = ['comment', comment.join(''), first[2], first[3], last[2], last[3]];
    const node = new Comment();
    const body = token[1].slice(2);

    this.init(node, token[2], token[3]);

    node.source.end = { line: token[4], column: token[5] };
    node.inline = true;
    node.raws.begin = '//';

    if (/^\s*$/.test(body)) {
      node.text = '';
      node.raws.left = body;
      node.raws.right = '';
    } else {
      const match = body.match(/^(\s*)([^]*[^\s])(\s*)$/);
      [, node.raws.left, node.text, node.raws.right] = match;
    }
  }

  numeric(tokens) {
    this.fromFirst(tokens, Numeric);
    let [[, value]] = tokens;
    const unit = Numeric.parseUnit(value);

    value = value.replace(unit, '');

    if (!isNumber(value)) {
      super.unknownWord(tokens);
      return;
    }

    this.current.unit = unit || '';
    this.current.value = value;
  }

  operator(tokens) {
    this.fromFirst(tokens, Operator);
  }

  other(start) {
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

  punctuation(tokens) {
    this.fromFirst(tokens, Punctuation);
  }

  quoted(tokens) {
    this.fromFirst(tokens, Quoted);
  }

  // eslint-disable-next-line class-methods-use-this
  // rule(tokens) {
  //   // we want to no-op here because rules don't exist in values
  //   // side-effect of using the postcss parser
  //   this.unknownWord(tokens);
  // }

  unicodeRange(tokens) {
    this.fromFirst(tokens, UnicodeRange);
  }

  unknownWord(tokens) {
    // NOTE: keep commented for examining unknown structures
    // console.log('unknown', tokens);

    const [first] = tokens;
    const [type, value] = first;
    const puncs = [':', '(', ')', '[', ']', '{', '}'];

    if (puncs.includes(type)) {
      this.punctuation(tokens);
    } else if (type === 'operator') {
      this.operator(tokens);
    } else if (type === 'string') {
      this.quoted(tokens);
    } else if (type === 'comma') {
      this.punctuation(tokens);
    } else if (type === 'word') {
      if (value === ',') {
        this.punctuation(tokens);
      } else if (value === '//') {
        this.inlineComment(tokens);
      } else if (isNumber(value) || Numeric.unitTest(value)) {
        this.numeric(tokens);
      } else if (UnicodeRange.test(value)) {
        this.unicodeRange(tokens);
      } else {
        super.unknownWord(tokens);
      }
    } else {
      super.unknownWord(tokens);
    }
  }
};
