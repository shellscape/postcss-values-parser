/*
  Copyright © 2020 Andrew Powell

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of this Source Code Form.
*/
const test = require('ava');

const postcss = require('postcss');
const scss = require('postcss-scss');

const { parse, parseDeclValue, parseAtRuleParams } = require('../lib');

const { throws, functionCall } = require('./fixtures/errors');

function snapshotError(t, callback) {
  try {
    callback();
    throw Error('Expected an error.');
  } catch (error) {
    if (!('showSourceCode' in error)) {
      throw error;
    }

    t.snapshot(error);
    t.snapshot(error.showSourceCode(false));
  }
}

test(throws.decl, (t) => {
  const root = postcss.parse(throws.decl, {
    from: 'file:///fixtures/errors.js'
  });
  snapshotError(t, () => parseDeclValue(root.nodes[0].nodes[0]));
});

test(throws.atRule, (t) => {
  const root = postcss.parse(throws.atRule, {
    from: 'file:///fixtures/errors.js'
  });
  snapshotError(t, () => parseAtRuleParams(root.nodes[0]));
});

test(throws.interpolation, (t) => {
  const root = scss.parse(throws.interpolation, {
    from: 'file:///fixtures/errors.js'
  });

  const [decl] = root.nodes[0].nodes;
  snapshotError(t, () =>
    parse(decl.prop, {
      interpolation: { prefix: '#' },
      context: root.source.input,
      lineInContext: decl.source.start.line,
      columnInContext: decl.source.start.column
    })
  );
});

test(functionCall, (t) => {
  const root = scss.parse(functionCall, {
    from: 'file:///fixtures/errors.js'
  });

  const value = parseDeclValue(root.nodes[0].nodes[0]);
  value.walk((node) => {
    delete node.parent; // eslint-disable-line no-param-reassign
  });

  snapshotError(t, () =>
    value.walkFuncs((func) => {
      if (func.name === 'var') throw func.error('Undefined variable!');
    })
  );
});
