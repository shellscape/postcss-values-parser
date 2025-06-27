/*
  Copyright © 2025 Andrew Powell

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of this Source Code Form.
*/
import { Container } from 'postcss';
import { describe, expect, it } from 'vitest';

import { parse, registerWalkers } from '../src/index.js';
import { values } from './fixtures/walker.json';

registerWalkers(Container);

describe('walker functionality', () => {
  for (const { value, walkers } of values) {
    const root = parse(value);

    for (const { length, type } of walkers) {
      it(`should walk ${type} in: ${value}`, () => {
        const nodes: any[] = [];

        (root as any)[`walk${type}`]((node: any) => {
          nodes.push(node);
        });

        expect(nodes.length).toBe(length);
        expect(nodes).toMatchSnapshot();
      });
    }
  }
});
