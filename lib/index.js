/*
  Copyright © 2018 Andrew Powell

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of this Source Code Form.
*/
const Input = require('postcss/lib/input');

const ValuesParser = require('./ValuesParser');
// const LessStringifier = require('./LessStringifier');

// TODO: walk methods for custom nodes

module.exports = {
  parse(less, options) {
    const input = new Input(less, options);
    const parser = new ValuesParser(input);

    parser.parse();

    return parser.root;
  }

  // TODO: will we need a custom stringifier?
  // stringify(node, builder) {
  //   const stringifier = new LessStringifier(builder);
  //   stringifier.stringify(node);
  // },
  //
  // nodeToString(node) {
  //   let result = '';
  //
  //   module.exports.stringify(node, (bit) => {
  //     result += bit;
  //   });
  //
  //   return result;
  // }
};
