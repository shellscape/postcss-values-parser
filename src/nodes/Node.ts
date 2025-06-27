/*
  Copyright © 2018 Andrew Powell

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of this Source Code Form.
*/
import { CssNode } from 'css-tree';
import { Input, Node as PostCssNode } from 'postcss';

import { stringify } from '../stringify.js';

export interface NodeOptions {
  node: CssNode;
}

export class Node extends PostCssNode {
  public readonly value: string = '';

  constructor(options?: NodeOptions) {
    super({});

    if (!options) return;

    const { end, source, start } = options.node.loc as any;

    this.source = { end, input: new Input(source), start };
  }

  toString(stringifier = stringify) {
    return super.toString(stringifier || {});
  }
}
