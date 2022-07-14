/*
  Copyright © 2018 Andrew Powell

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of this Source Code Form.
*/
import { Node } from 'postcss';

import * as Nodes from './nodes';

interface Container {
  prototype: any;
}

console.log(Object.values(Nodes));

export const registerWalkers = (container: Container) => {
  for (const Constructor of Object.values(Nodes)) {
    let walkerName = `walk${Constructor.name}`;

    // plural sugar
    if (walkerName.lastIndexOf('s') !== walkerName.length - 1) {
      walkerName += 's';
    }

    /* istanbul ignore next */
    if (container.prototype[walkerName]) {
      return;
    }

    // we need access to `this` so we can't use an arrow function
    container.prototype[walkerName] = function walker(callback: any) {
      return this.walkType(Constructor, callback);
    };
  }

  container.prototype.walkType = function walkType(type: string, callback: any) {
    /* istanbul ignore next */
    if (!type || !callback) {
      throw new Error('Parameters {type} and {callback} are required.');
    }

    // allow users to pass a constructor, or node type string; eg. Word.
    const isTypeCallable = typeof type === 'function';

    // eslint-disable-next-line consistent-return
    return this.walk((node: Node, index: any) => {
      if ((isTypeCallable && node instanceof type) || (!isTypeCallable && node.type === type)) {
        return callback.call(this, node, index);
      }
    });
  };
};
