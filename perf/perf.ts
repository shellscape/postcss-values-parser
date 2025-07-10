import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import chalk from 'chalk';
import { globby } from 'globby';
import perfy from 'perfy';
import valueParser from 'postcss-value-parser';
import stripAnsi from 'strip-ansi';
import table from 'text-table';

import { parse } from '../dist/index.js';

interface Fixture {
  options?: Record<string, unknown>;
  snapshot?: string[];
}

interface PerfResult {
  milliseconds: number;
}

interface TestResult {
  test: string;
  ours: number;
  theirs: number;
}

(async () => {
  const fixtures = await globby([join(import.meta.dirname, '../test/fixtures/*.json')]);
  const results: TestResult[] = [];

  for (const path of fixtures) {
    const fixtureContent = await readFile(path, 'utf-8');
    const fixture: Fixture = JSON.parse(fixtureContent);
    const { options, snapshot } = fixture;

    if (!snapshot) {
      continue; // eslint-disable-line no-continue
    }

    for (const test of snapshot) {
      let theirs: PerfResult;

      perfy.start('values-parser');
      parse(test, options);
      const ours: PerfResult = perfy.end('values-parser');

      perfy.start('value-parser');
      try {
        valueParser(test);
        theirs = perfy.end('value-parser');
      } catch (e) {
        theirs = { milliseconds: NaN };
      }

      results.push({
        test,
        ours: ours.milliseconds,
        theirs: theirs.milliseconds
      });
    }
  }

  const rows = [
    [chalk.blue('Test'), chalk.blue('values-parser'), chalk.blue('v2'), chalk.blue('value-parser')],
    ['----', '-------------', '--', '------------']
  ];

  for (const result of results) {
    const { test, ours, theirs } = result;
    rows.push([
      JSON.stringify(test),
      ours > theirs
        ? chalk.red(ours.toString())
        : theirs > ours
        ? chalk.green(ours.toString())
        : ours.toString(),
      theirs.toString()
    ]);
  }
  const t = table(rows, {
    stringLength: (s: string) => stripAnsi(s).length
  });
  const { log } = console;
  log(chalk.blue(`Ran ${results.length} Tests. Results in ms\n`));
  log(t);
})();
