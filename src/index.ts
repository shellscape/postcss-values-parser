/*
  Copyright © 2025 Andrew Powell

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0.

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of this Source Code Form.
*/

import { parse as parseInternal, ParseOptions } from './parser.js';
import { stringify } from './stringify.js';

export { registerWalkers } from './walker.js';
export { ParseOptions } from './parser.js';
export * from './nodes/index.js';

interface Builder {
  (part: string, node?: any, type?: 'start' | 'end'): void;
}

export interface Stringifier {
  (node: any, builder: Builder): void;
}

export const parse = (css: string, options?: ParseOptions) => {
  const root = parseInternal(css, options);

  const ogToString = root.toString;

  function toString(stringifier?: Stringifier) {
    return ogToString.bind(root)(stringifier || stringify);
  }

  root.toString = toString.bind(root);

  return root;
};

export const nodeToString = (node: any) => {
  let result = '';

  stringify(node, (bit: string) => {
    result += bit;
  });

  return result;
};

export { stringify };
