/* eslint global-require: off, import/no-dynamic-require: off, import/no-extraneous-dependencies: off */
const { join } = require('path');

const chalk = require('chalk');
const globby = require('globby');
const perfy = require('perfy');
const valueParser = require('postcss-value-parser');
const v2Parser = require('postcss-values-parser');
const strip = require('strip-ansi');
const table = require('text-table');

const { parse } = require('../');

(async () => {
  const fixtures = await globby([join(__dirname, '../test/fixtures/*.js')]);
  const results = [];

  for (const path of fixtures) {
    const fixture = require(path);
    const { options, snapshot } = fixture;

    if (!snapshot) {
      continue; // eslint-disable-line no-continue
    }

    for (const test of snapshot) {
      let theirs;
      let v2;

      perfy.start('values-parser');
      parse(test, options);
      const ours = perfy.end('values-parser');

      perfy.start('value-parser');
      try {
        valueParser(test);
        theirs = perfy.end('value-parser');
      } catch (e) {
        theirs = { milliseconds: NaN };
      }

      perfy.start('v2');
      try {
        v2Parser(test).parse();
        v2 = perfy.end('v2');
      } catch (e) {
        v2 = { milliseconds: NaN };
      }

      results.push({
        test,
        ours: ours.milliseconds,
        theirs: theirs.milliseconds,
        v2: v2.milliseconds
      });
    }
  }

  const rows = [
    [chalk.blue('Test'), chalk.blue('values-parser'), chalk.blue('v2'), chalk.blue('value-parser')],
    ['----', '-------------', '--', '------------']
  ];

  for (const result of results) {
    const { test, ours, theirs, v2 } = result;
    rows.push([
      JSON.stringify(test),
      ours > theirs ? chalk.red(ours) : theirs > ours ? chalk.green(ours) : ours,
      v2,
      theirs
    ]);
  }
  const t = table(rows, {
    stringLength: (s) => strip(s).length
  });
  const { log } = console;
  log(chalk.blue(`Ran ${results.length} Tests\n`));
  log(t);
})();
