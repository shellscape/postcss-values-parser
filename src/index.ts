/*
  Copyright © 2018 Andrew Powell

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of this Source Code Form.
*/

// Breaking Changes:
// - Comments and Spaces filtered out (upstream; css-tree)
// - Node Interfaces changed
//

import { parse } from './parser';
// import { stringify } from './ValuesStringifier';

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

// export const nodeToString = (node: Node) => {
//   let result = '';
//
//   stringify(node, (bit: string) => {
//     result += bit;
//   });
//
//   return result;
// };

export { parse /* , stringify */ };
