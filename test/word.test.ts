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
    { fixture: 'url(https://example.com/image.png)', label: 'unquoted full URL' },
    { fixture: 'url(/images/image.png)', label: 'unquoted absolute file path' },
    { fixture: 'url(images/image.png)', label: 'unquoted relative file path' },
    { fixture: 'url(./images/image.png)', label: 'unquoted relative file path with leading ./' },

    { fixture: "url('https://example.com/image.png')", label: 'single-quoted full URL' },
    { fixture: "url('/images/image.png')", label: 'single-quoted absolute file path' },
    { fixture: "url('images/image.png')", label: 'single-quoted relative file path' },
    { fixture: "url('./images/image.png')", label: 'single-quoted relative file path with leading ./' },

    { fixture: 'url("https://example.com/image.png")', label: 'double-quoted full URL' },
    { fixture: 'url("/images/image.png")', label: 'double-quoted absolute file path' },
    { fixture: 'url("images/image.png")', label: 'double-quoted relative file path' },
    { fixture: 'url("./images/image.png")', label: 'double-quoted relative file path with leading ./' },

    { fixture: "url('https://example.com/image.png?1234567890#abcdef')", label: 'single-quoted full URL with query and fragment' },
    { fixture: "url('/images/image.png?1234567890#abcdef')", label: 'single-quoted absolute file path with query and fragment' },
    { fixture: "url('images/image.png?1234567890#abcdef')", label: 'single-quoted relative file path with query and fragment' },
    { fixture: "url('./images/image.png?1234567890#abcdef')", label: 'single-quoted relative file path with leading ./, query, and fragment' },

    { fixture: 'url("https://example.com/image.png?1234567890#abcdef")', label: 'double-quoted full URL with query and fragment' },
    { fixture: 'url("/images/image.png?1234567890#abcdef")', label: 'double-quoted absolute file path with query and fragment' },
    { fixture: 'url("images/image.png?1234567890#abcdef")', label: 'double-quoted relative file path with query and fragment' },
    { fixture: 'url("./images/image.png?1234567890#abcdef")', label: 'double-quoted relative file path with leading ./, query, and fragment' },

    { fixture: 'url()', label: 'empty URL value' },
    { fixture: "url('')", label: 'empty single-quoted URL value' },
    { fixture: 'url("")', label: 'empty double-quoted URL value' }
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
