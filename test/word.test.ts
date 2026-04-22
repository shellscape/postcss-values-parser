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
import { snapshot } from './fixtures/word.json';

describe('word parsing', () => {
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

  const urlFixtures = [
    { fixture: 'url(https://example.com/image.png)', label: 'unquoted absolute URL' },
    { fixture: "url('https://example.com/image.png')", label: 'single-quoted absolute URL' },
    { fixture: 'url("https://example.com/image.png")', label: 'double-quoted absolute URL' },
    { fixture: 'url(/images/image.png)', label: 'unquoted relative URL' },
    { fixture: "url('/images/image.png')", label: 'single-quoted relative URL' },
    { fixture: 'url("/images/image.png")', label: 'double-quoted relative URL' },
    { fixture: 'url(//cdn.example.com/image.png)', label: 'protocol-relative URL' },
    { fixture: 'url()', label: 'empty URL value' }
  ];

  for (const { fixture, label } of urlFixtures) {
    it(`should expose URL metadata for: ${label}`, () => {
      const root = parse(fixture);
      const node = root.first as any;

      expect({
        input: fixture,
        output: nodeToString(root),
        type: node.type,
        value: node.value,
        isUrl: node.isUrl,
        isParseableUrl: node.isParseableUrl
      }).toMatchSnapshot();
    });
  }
});
