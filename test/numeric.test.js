const test = require('ava');

const { nodeToString, parse } = require('../lib');

const { snapshot, throws } = require('./fixtures/numeric');

for (const fixture of snapshot) {
  test(fixture, (t) => {
    const root = parse(fixture);

    t.snapshot(nodeToString(root));
    t.snapshot(root);
  });
}

for (const fixture of throws) {
  test(fixture, (t) => {
    t.throws(() => parse(fixture));
  });
}
