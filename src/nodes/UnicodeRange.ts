/*
  Copyright © 2025 Andrew Powell

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of this Source Code Form.
*/
import { UnicodeRange as CssUnicodeRange } from 'css-tree';

import { Node, NodeOptions } from './Node.js';

export class UnicodeRange extends Node {
  readonly name: string = '';
  declare type: string;

  constructor(options: NodeOptions) {
    super(options);
    this.type = 'unicodeRange';

    if (options && options.node && options.node.type === 'UnicodeRange') {
      const node = options.node as CssUnicodeRange;
      (this as any).value = node.value;
      (this as any).name = node.value;
    } else if (options && options.value) {
      (this as any).value = options.value;
      (this as any).name = options.value;
    }
  }
}
