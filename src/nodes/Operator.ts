/*
  Copyright © 2025 Andrew Powell

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of this Source Code Form.
*/
import { Operator as CssOperator } from 'css-tree';

import { Node, NodeOptions } from './Node.js';

export class Operator extends Node {
  declare type: string;

  constructor(options: NodeOptions) {
    super(options);
    this.type = 'operator';

    if (options && options.node && options.node.type === 'Operator') {
      const node = options.node as CssOperator;
      (this as any).value = node.value;
    } else if (options && options.value) {
      (this as any).value = options.value;
    }
  }
}
