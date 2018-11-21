/*
  Copyright © 2018 Andrew Powell

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of this Source Code Form.
*/
const isNumber = require('is-number');
const Node = require('postcss/lib/node');

const unitRegex = /%|ch|cm|em|ex|in|mm|pc|pt|px|rem|vh|vmax|vmin|vw$/i;

class Numeric extends Node {
  constructor(options = {}) {
    super(options);
    this.type = 'numeric';
    this.unit = options.unit || '';
  }

  toString() {
    return [this.raws.before, String(this.value), this.unit, this.raws.after].join('');
  }

  static fromTokens(tokens, parser) {
    parser.fromFirst(tokens, Numeric);
    let [[, value]] = tokens;
    const unit = Numeric.parseUnit(value);

    value = value.replace(unit, '');

    const { current: node } = parser;
    node.unit = unit || '';
    node.value = value;
  }

  static parseUnit(what) {
    const matches = what.match(unitRegex);
    const [result] = matches || [];
    return result;
  }

  static test(what) {
    return isNumber(what);
  }

  static testUnit(what) {
    const unit = Numeric.parseUnit(what);

    if (unit) {
      const remaining = what.replace(unit, '');
      return isNumber(remaining);
    }
    return false;
  }
}

module.exports = Numeric;
