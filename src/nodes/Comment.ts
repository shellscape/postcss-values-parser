/*
  Copyright © 2025 Andrew Powell

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of this Source Code Form.
*/
import { Node, NodeOptions } from './Node.js';

export class Comment extends Node {
  readonly inline: boolean = false;
  readonly text: string = '';
  declare type: string;

  constructor(options: NodeOptions) {
    super(options);
    this.type = 'comment';

    if (options && options.node) {
      const node = options.node as any;
      const value = node.value || '';

      (this as any).value = value;
      (this as any).text = value.replace(/^\/\*|\*\/$/g, '').trim();
      (this as any).inline = value.startsWith('//');
    } else if (options && options.value) {
      const value = options.value;
      (this as any).value = value;
      (this as any).text = value.replace(/^\/\*|\*\/$/g, '').trim();
      (this as any).inline = value.startsWith('//');
    }
  }
}
