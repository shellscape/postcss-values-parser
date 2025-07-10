/*
  Copyright © 2025 Andrew Powell

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of this Source Code Form.
*/
import colorNames from 'color-name';
import { Hash, Identifier, StringNode } from 'css-tree';
import isUrl from 'is-url-superb';

import { Node, NodeOptions } from './Node.js';

const reHex = /^#([0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;
const reVariable = /^--/;

export class Word extends Node {
  readonly isColor: boolean = false;
  readonly isHex: boolean = false;
  readonly isUrl: boolean = false;
  readonly isVariable: boolean = false;
  declare type: string;

  constructor(options: NodeOptions) {
    super(options);
    this.type = 'word';

    let value = '';

    if (
      options &&
      options.node &&
      (options.node.type === 'Identifier' ||
        options.node.type === 'Hash' ||
        options.node.type === 'String')
    ) {
      const node = options.node as Identifier | Hash | StringNode;

      if (node.type === 'Identifier') {
        value = (node as Identifier).name;
      } else if (node.type === 'Hash') {
        value = `#${(node as Hash).value}`;
      } else if (node.type === 'String') {
        value = (node as StringNode).value;
      } else {
        // Fallback for other node types
        value = (node as any).value || (node as any).name || '';
      }
    } else if (options && options.value) {
      value = options.value;
    }

    (this as any).value = value;

    // Determine word properties
    this.isHex = reHex.test(value);
    this.isVariable = reVariable.test(value);
    this.isUrl = !this.isVariable && isUrl(value);
    this.isColor = this.isHex || (colorNames as any)[value.toLowerCase()] !== undefined;
  }
}
