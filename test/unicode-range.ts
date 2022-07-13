/*
  Copyright © 2018 Andrew Powell

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of this Source Code Form.
*/
import test from 'ava';

import { nodeToString, parse } from '../src';

import { snapshot } from './fixtures/unicode-range.json';

for (const fixture of snapshot) {
  test(fixture, (t) => {
    const root = parse(fixture);
    const nodes = root.nodes.map((node) => {
      delete node.parent; // eslint-disable-line no-param-reassign
      return node;
    });
    const string = nodeToString(root);

    // FIXME: css-tree doesn't track spaces. we'll need to improve that module before we can do this
    // again. once fixed, add these two lines back to every test
    // t.is(string, fixture);
    // t.is(fixture, root.toString());
    t.snapshot(root.first?.toString());
    t.snapshot(string);
    t.snapshot(nodes);
  });
}
