/*
  Copyright © 2025 Andrew Powell

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of this Source Code Form.
*/
import { Dimension, NumberNode, Percentage } from 'css-tree';

import { Node, NodeOptions } from './Node.js';

export class Numeric extends Node {
  readonly unit: string = '';
  declare type: string;

  constructor(options: NodeOptions) {
    super(options);
    this.type = 'numeric';

    if (
      options &&
      options.node &&
      (options.node.type === 'Dimension' ||
        options.node.type === 'Number' ||
        options.node.type === 'Percentage')
    ) {
      const node = options.node as Dimension | NumberNode | Percentage;

      if (node.type === 'Dimension') {
        this.unit = (node as Dimension).unit;
        (this as any).value = String((node as Dimension).value);
      } else if (node.type === 'Number') {
        this.unit = '';
        (this as any).value = String((node as NumberNode).value);
      } else if (node.type === 'Percentage') {
        this.unit = '%';
        (this as any).value = String((node as Percentage).value) + '%';
      }
    }
  }
}
