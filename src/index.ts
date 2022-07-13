/*
  Copyright © 2018 Andrew Powell

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of this Source Code Form.
*/

// Breaking Changes:
// - Comments and superfluous spaces filtered out (upstream; css-tree)
// - Node interfaces changed
// - Walkers must be manually registered to avoid conflicts between different installed versions of
//   postcss
// - `2.` is non-spec and invalid (upstream; supported by css-tree)
// - `.2.3rem` Shouldn't Be Compliant(upstream; https://github.com/csstree/csstree/issues/194)
// - modulus operators no longer spec-compliant https://www.w3.org/TR/css3-values/#calc-notation
// - custom variable prefix no longer supported (upstream; css-tree)

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
