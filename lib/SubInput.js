/*
  Copyright © 2018 Andrew Powell

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of this Source Code Form.
*/

// A PostCSS Input that exposes a substring of a larger Input as though it were
// the entire text to be parsed.
module.exports = class SubInput {
  constructor(css, context, lineInContext, columnInContext) {
    this.css = css;
    this.context = context;
    this.lineInContext = lineInContext;
    this.columnInContext = columnInContext;
  }

  error(message, line, column, opts = {}) {
    let lineInContext;
    let columnInContext;
    if (line === 1) {
      lineInContext = this.lineInContext; // eslint-disable-line prefer-destructuring
      columnInContext = column + this.columnInContext - 1;
    } else {
      lineInContext = this.lineInContext + line - 1;
      columnInContext = column;
    }

    return this.context.error(message, lineInContext, columnInContext, opts);
  }

  origin(line, column) {
    let lineInContext;
    let columnInContext;
    if (line === 1) {
      lineInContext = this.lineInContext; // eslint-disable-line prefer-destructuring
      columnInContext = column + this.columnInContext - 1;
    } else {
      lineInContext = this.lineInContext + line - 1;
    }

    return this.context.origin(lineInContext, columnInContext);
  }

  mapResolve(file) {
    return this.context.mapResolve(file);
  }

  get from() {
    return this.context.from;
  }
};
