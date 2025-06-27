/*
  Copyright © 2025 Andrew Powell

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of this Source Code Form.
*/
import { FunctionNode } from 'css-tree';

import { Container } from './Container.js';
import { NodeOptions } from './Node.js';

const reColorFunctions = /^(hsla?|hwb|(ok)?lab|(ok)?lch|rgba?)$/i;
const reVar = /^var$/i;

export class Func extends Container {
  readonly isColor: boolean = false;
  readonly isVar: boolean = false;
  readonly name: string = '<unknown>';
  readonly params: string = '';
  declare type: string;

  constructor(options: NodeOptions) {
    super(options);
    this.type = 'func';

    if (options && options.node && options.node.type === 'Function') {
      this.name = (options.node as FunctionNode).name;
      this.isColor = reColorFunctions.test(this.name);
      this.isVar = reVar.test(this.name);
      (this as any).params = '';
    }
  }
}
