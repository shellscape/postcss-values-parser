/*
  Copyright © 2025 Andrew Powell

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of this Source Code Form.

  These tests exist because of the use-case submitted in https://github.com/shellscape/postcss-values-parser/issues/63
  Multiple successive parses yielded results that were not duplicated in ava's individual process model
*/
import { describe, expect, it } from 'vitest';

import { nodeToString, parse } from '../src/index.js';
import { Func, Operator } from '../src/nodes/index.js';

describe('integration tests', () => {
  it('should handle multiple successive parses', () => {
    let root = parse(`normal normal 1em/1 'Source Sans Pro', serif`);

    expect(root.nodes.length).toBe(8);

    root = parse('1/-1');
    expect(root.nodes.length).toBe(3);

    root = parse('1 / -1');
    expect(root.nodes.length).toBe(3);
  });

  it('should handle manipulation', () => {
    const source = 'rgb(100% 100% 100%)';
    const root = parse(source);
    const { first } = root;

    let string = nodeToString(root);
    expect(string).toBe(source);

    (first as Func)!.nodes!.splice(1, 0, new Operator({ value: ',', parent: first }) as any);
    (first as Func)!.nodes!.splice(3, 0, new Operator({ value: ',', parent: first }) as any);

    string = nodeToString(root);
    expect(string).not.toBe(source);
    expect(string).toMatchSnapshot();
  });
});
