/*
  Copyright © 2018 Andrew Powell

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of this Source Code Form.
*/
const test = require('ava');

const { parse } = require('../lib');

const { values } = require('./fixtures/walker');

for (const { value, walkers } of values) {
  const root = parse(value);

  for (const { length, type } of walkers) {
    test(type, (t) => {
      const nodes = [];

      root[`walk${type}`]((node) => {
        nodes.push(node);
      });

      t.is(length, nodes.length, type);
    });
  }
}
