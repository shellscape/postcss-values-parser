/*
  Copyright © 2025 Andrew Powell

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of this Source Code Form.
*/

interface WalkCallback {
  (node: any, index: number): any;
}

const createWalker = (type: string) => {
  return function (this: any, callback: WalkCallback) {
    let index = 0;
    const walk = (node: any): any => {
      if (node.type === type.toLowerCase()) {
        const result = callback(node, index++);
        if (result === false) return false;
      }

      if (node.nodes && node.nodes.length > 0) {
        for (const child of node.nodes) {
          const result = walk(child);
          if (result === false) return false;
        }
      }
    };

    return walk(this);
  };
};

export const registerWalkers = (Container: any) => {
  const walkerTypes = [
    'Funcs',
    'Words',
    'Numerics',
    'Operators',
    'Quoteds',
    'UnicodeRanges',
    'Comments',
    'Punctuations'
  ];

  for (const walkerType of walkerTypes) {
    const methodName = `walk${walkerType}`;
    const nodeType = walkerType.toLowerCase().slice(0, -1); // Remove 's' and lowercase

    Container.prototype[methodName] = createWalker(nodeType);
  }

  // Special case for walkType
  Container.prototype.walkType = function (type: string, callback: WalkCallback) {
    return createWalker(type).call(this, callback);
  };
};
