/*
  Copyright © 2018 Andrew Powell

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of this Source Code Form.
*/
const Node = require('postcss/lib/node');

const unitRegex = /%|ch|cm|em|ex|in|mm|pc|pt|px|rem|vh|vmax|vmin|vw$/i;

class Numeric extends Node {
  constructor(options = {}) {
    super(options);
    this.type = 'numeric';
    this.unit = options.unit || '';
  }

  static unitTest(what) {
    return unitRegex.test(what);
  }

  static parseUnit(what) {
    const matches = what.match(unitRegex);
    const [result] = matches || [];
    return result;
  }

  toString() {
    return [this.raws.before, String(this.value), this.unit, this.raws.after].join('');
  }
}

module.exports = Numeric;
