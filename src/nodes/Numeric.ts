/*
  Copyright © 2018 Andrew Powell

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of this Source Code Form.
*/
import { NumberNode } from 'css-tree';

import { Node, NodeOptions } from './Node.js';

export class Numeric extends Node {
  readonly unit: string = '';
  readonly numericValue: number = 0;
  declare type: string;
  constructor(options: NodeOptions) {
    super(options);
    this.type = 'numeric';
    this.unit = options.node.type === 'Dimension' ? options.node.unit : '';
    (this as any).value = String((options.node as NumberNode).value);
    (this as any).numericValue = (options.node as NumberNode).value;
  }
}
