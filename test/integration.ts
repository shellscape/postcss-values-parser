/*
  Copyright © 2018 Andrew Powell

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of this Source Code Form.

  These tests exist because of the use-case submitted in https://github.com/shellscape/postcss-values-parser/issues/63
  Multiple successive parses yielded results that were not duplicated in ava's individual process model
*/
import test from 'ava';

import { nodeToString, parse } from '../src';

import { Operator } from '../src/nodes';

test('integration', (t) => {
  let root = parse(`normal normal 1em/1 'Source Sans Pro', serif`);

  t.is(root.nodes.length, 8);

  root = parse('1/-1');
  t.is(root.nodes.length, 3);

  root = parse('1 / -1');
  t.is(root.nodes.length, 3);
});

test('manipulation', (t) => {
  const source = 'rgb(100% 100% 100%)';
  const root = parse(source);
  const { first } = root;

  let string = nodeToString(root);
  t.is(source, string);

  first.nodes.splice(1, 0, new Operator({ value: ',', parent: first }));
  first.nodes.splice(3, 0, new Operator({ value: ',', parent: first }));

  string = nodeToString(root);
  t.not(source, string);
  t.snapshot(string);
});
