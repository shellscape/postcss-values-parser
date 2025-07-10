/*
  Copyright © 2025 Andrew Powell

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of this Source Code Form.
*/
import { Input, Root as PostCssRoot } from 'postcss';

import { stringify } from '../stringify.js';
import { Node, NodeOptions } from './Node.js';

export class Root extends PostCssRoot {
  public readonly value = '';
  declare type: 'root';

  constructor(options?: NodeOptions) {
    super({});
    this.type = 'root';

    if (!this.nodes) this.nodes = [];

    if (!options) return;

    if (options.value) {
      (this as any).value = options.value;
    }

    if (options.node && options.node.loc) {
      const { end, source, start } = options.node.loc as any;
      this.source = { end, input: new Input(source), start };
    }
  }

  // Note: The PostCSS types for .push seem a bit jacked up.
  // it incorrectly expects properties for types on Declaration for anything being pushed
  add(node: Node) {
    return this.push(node as any);
  }

  toString(stringifier = stringify) {
    return super.toString(stringifier || stringify);
  }
}
