/*
  Copyright © 2025 Andrew Powell

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of this Source Code Form.
*/
import { describe, expect, it } from 'vitest';

import { nodeToString, parse } from '../src/index.js';
import { snapshot, throws } from './fixtures/variable.json';

describe('variable parsing', () => {
  for (const fixture of snapshot) {
    it(`should parse: ${fixture}`, () => {
      const root = parse(fixture);
      const nodes = root.nodes.map((node) => {
        delete node.parent; // eslint-disable-line no-param-reassign
        return node;
      });
      const string = nodeToString(root);

      expect(root.first?.toString()).toMatchSnapshot();
      expect(string).toMatchSnapshot();
      expect(nodes).toMatchSnapshot();
    });
  }

  if (throws) {
    for (const fixture of throws) {
      it(`should throw for: ${fixture}`, () => {
        expect(() => parse(fixture)).toThrow();
      });
    }
  }
});
