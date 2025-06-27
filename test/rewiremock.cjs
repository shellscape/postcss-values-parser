module.exports = function () {
  const rewiremock = require('rewiremock/node');

  // Configure and enable Rewiremock
  rewiremock.overrideEntryPoint(module);
  rewiremock.enable();

  // Override the nanoid/non-secure module to produce a predictable nonrandom ID
  // This is necessary because the Input module of PostCSS uses this to generate
  // Random IDs and this breaks snapshots since these are different at each run.
  rewiremock('nanoid/non-secure').with({ nanoid: () => 1 });
};
