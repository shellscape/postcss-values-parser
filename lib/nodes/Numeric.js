/*
  Copyright © 2018 Andrew Powell

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of this Source Code Form.
*/

const { registerWalker } = require('../walker');
const { numericRegex } = require('../tokensRegExp');

const Node = require('./Node');

class Numeric extends Node {
  constructor(options = {}) {
    super(options);
    this.type = 'numeric';
    this.unit = options.unit || '';
  }

  static fromTokens(tokens, parser) {
    parser.fromFirst(tokens, Numeric);

    const [[, rawValue]] = tokens;
    const [, value, unit = ''] = rawValue.match(numericRegex);

    const { lastNode } = parser;
    lastNode.unit = unit;
    lastNode.value = value;
  }

  static test(what) {
    return numericRegex.test(what);
  }
}

registerWalker(Numeric);

module.exports = Numeric;
