/*
  Copyright © 2018 Andrew Powell

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of this Source Code Form.
*/

// Breaking Changes:
// - Node v12+
// - postcss-values-parser is now using css-tree which makes its behavior closers to how browsers parse values
// - Comments and superfluous spaces filtered out (upstream; css-tree)
// - Node interfaces changed
// - Walkers must be manually registered to avoid conflicts between different installed versions of
//   postcss
// - `2.` is non-spec and invalid (upstream; css-tree)
// - `.2.3rem` Shouldn't Be Compliant(upstream; https://github.com/csstree/csstree/issues/194)
// - modulus operators no longer spec-compliant https://www.w3.org/TR/css3-values/#calc-notation
// - custom variable prefix no longer supported (upstream; css-tree)
// - at-words (@word) aren't spec compliant within css values and have been removed
// - `variables` option has been removed. only the `--` prefix is spec compliant for variables
// - url-modifiers (e.g. functions within url(), url(var(...))) aren't spec compliant and aren't supported (upstream; https://github.com/csstree/csstree/issues/197)
// - a comma (,) is considered an operator
// - strings (Quoted) which are quoted, but unterminated with an ending matching quote mark no longer throw
// - interpolation had to be removed as it is not spec compliant
// - bare parens have their own node type (upstream; css-tree)
// - comparison operators are not spec compliant and not supported. e.g. `(width < 1px)`, `(width < 1px) and (width < 2px)`

import { parse } from './parser';
import { stringify } from './stringify';

export { registerWalkers } from './walker';

interface Builder {
  (part: string, node?: Node, type?: 'start' | 'end'): void;
}

export interface InterpolationOptions {
  prefix: string;
}

export interface ParseOptions {
  ignoreUnknownWords?: boolean;
  interpolation?: boolean | InterpolationOptions;
  variables?: VariablesOptions;
}

export interface Stringifier {
  (node: Node, builder: Builder): void;
}

export interface VariablesOptions {
  prefixes: string[];
}

export const nodeToString = (node: any) => {
  let result = '';

  stringify(node, (bit: string) => {
    result += bit;
  });

  return result;
};

export { parse, stringify };
