/*
  Copyright © 2025 Andrew Powell

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of this Source Code Form.
*/
import { StringNode } from 'css-tree';
import { unquote } from 'quote-unquote';

import { Node, NodeOptions } from './Node.js';

export class Quoted extends Node {
  readonly quote: string = '';
  readonly contents: string = '';
  declare type: string;

  constructor(options: NodeOptions) {
    super(options);
    this.type = 'quoted';

    if (options && options.node && options.node.type === 'String') {
      const node = options.node as StringNode;
      const contents = node.value; // CSS-tree already gives us unquoted content

      // Get the original quoted string from source if we have location info
      let fullValue = `"${contents}"`;
      let quote = '"';

      if (node.loc && node.loc.source && typeof node.loc.source === 'string') {
        const original = node.loc.source.substring(node.loc.start.offset, node.loc.end.offset);
        if (original) {
          fullValue = original;
          quote = original.charAt(0);
        }
      }

      (this as any).value = fullValue;
      (this as any).quote = quote;
      (this as any).contents = contents;
    } else if (options && options.value) {
      const fullValue = options.value;
      const quote = fullValue.charAt(0);
      const contents = unquote(fullValue);

      (this as any).value = fullValue;
      (this as any).quote = quote;
      (this as any).contents = contents;
    }
  }
}
