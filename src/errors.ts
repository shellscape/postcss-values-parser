/*
  Copyright © 2025 Andrew Powell

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of this Source Code Form.
*/

export class ParseError extends Error {
  constructor(error: Error) {
    super(error.message);
    this.name = 'ParseError';
    this.stack = error.stack;
  }
}

export class AstError extends Error {
  constructor() {
    super('Invalid or empty AST');
    this.name = 'AstError';
  }
}
