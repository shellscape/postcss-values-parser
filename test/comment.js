'use strict';

const chai = require('chai');
const shallowDeepEqual = require('chai-shallow-deep-equal');
const Parser = require('../lib/parser');

let expect = chai.expect;

describe('Parser → Comment', () => {

  chai.use(shallowDeepEqual);

  let fixtures,
    failures;

  fixtures = [
    // standard comments
    {
      it: 'should parse comments',
      test: '/*before*/ 1px /*between*/ 1px /*after*/',
      expected: [
        { type: 'comment', value: 'before' },
        { type: 'number', value: '1', unit: 'px', raws: { before: ' ' } },
        { type: 'comment', value: 'between', raws: { before: ' ' } },
        { type: 'number', value: '1', unit: 'px', raws: { before: ' ' } },
        { type: 'comment', value: 'after', raws: { before: ' ' } }
      ]
    },
    {
      it: 'should parse comments inside functions',
      test: 'rgba( 0, 55/55, 0/*,.5*/ )',
      expected: [
        { type: 'func', value: 'rgba' },
        { type: 'paren', value: '(' },
        { type: 'number', value: '0', raws: { before: ' ' } },
        { type: 'comma', value: ',' },
        { type: 'number', value: '55', raws: { before: ' ' } },
        { type: 'operator', value: '/' },
        { type: 'number', value: '55' },
        { type: 'comma', value: ',' },
        { type: 'number', value: '0', raws: { before: ' ' } },
        { type: 'comment', value: ',.5' },
        { type: 'paren', value: ')' }
      ]
    },
    {
      it: 'should parse comments at the end of url functions with quoted first argument',
      test: 'url("/demo/bg.png" /*comment*/ )',
      expected: [
        { type: 'func', value: 'url' },
        { type: 'paren', value: '(' },
        { type: 'string', value: '/demo/bg.png', quoted: true, raws: { quote:'"' } },
        { type: 'comment', value: 'comment', raws: { before: ' ' } },
        { type: 'paren', value: ')' }
      ]
    },
    {
      it: 'should parse only one empty comment',
      test: '/**/',
      expected: [
        { type: 'comment', value: '', raws: { before: '' } },
      ]
    },

    // double slash comment
    {
      it: 'should parse double slash comments',
      test: '//before\n 1px //between\n 1px //after\n',
      loose: true,
      expected: [
        { type: 'comment', value: 'before', inline: true },
        { type: 'number', value: '1', unit: 'px', raws: { before: '\n ' } },
        { type: 'comment', value: 'between', inline: true, raws: { before: ' ' } },
        { type: 'number', value: '1', unit: 'px', raws: { before: '\n ' } },
        { type: 'comment', value: 'after', inline: true, raws: { before: ' ' } }
      ]
    },
    {
      it: 'should parse double slash comments inside functions',
      test: 'rgba( 0, 55/55, 0//,.5\n )',
      loose: true,
      expected: [
        { type: 'func', value: 'rgba' },
        { type: 'paren', value: '(' },
        { type: 'number', value: '0', raws: { before: ' ' } },
        { type: 'comma', value: ',' },
        { type: 'number', value: '55', raws: { before: ' ' } },
        { type: 'operator', value: '/' },
        { type: 'number', value: '55' },
        { type: 'comma', value: ',' },
        { type: 'number', value: '0', raws: { before: ' ' } },
        { type: 'comment', value: ',.5' },

      ]
    },
    {
      it: 'should parse double slash comments when url function have nested function',
      test: 'url(var(//comment\n))',
      loose: true,
      expected: [
        { type: 'func', value: 'url' },
        { type: 'paren', value: '(' },
        { type: 'func', value: 'var' },
        { type: 'paren', value: '(' },
        { type: 'comment', value: 'comment' },
        { type: 'paren', value: ')' },
        { type: 'paren', value: ')' }
      ]
    },
    {
      it: 'should parse only one double slash empty comment',
      test: '//\n',
      loose: true,
      expected: [
        { type: 'comment', value: '', inline: true, raws: { before: '' } },
      ]
    },
    {
      it: 'should parse only one double slash empty comment without newline',
      test: '//',
      loose: true,
      expected: [
        { type: 'comment', value: '', inline: true, raws: { before: '' } },
      ]
    },

    // mixed standard and double slash comments
    {
      it: 'should parse mixed comments #1',
      test: '/*before*/\n//between\n/*after*/',
      loose: true,
      expected: [
        { type: 'comment', value: 'before', inline: false, raws: { before: '' } },
        { type: 'comment', value: 'between', inline: true, raws: { before: '\n' } },
        { type: 'comment', value: 'after', inline: false, raws: { before: '\n' } },
      ]
    },
    {
      it: 'should parse mixed comments #2',
      test: '//before\n/*between*/\n//after',
      loose: true,
      expected: [
        { type: 'comment', value: 'before', inline: true, raws: { before: '' } },
        { type: 'comment', value: 'between', inline: false, raws: { before: '\n' } },
        { type: 'comment', value: 'after', inline: true, raws: { before: '\n' } },
      ]
    },

    // these tests are based on the spec rules surrounding legacy
    // quotation-mark–less url notation.
    // https://drafts.csswg.org/css-values-3/#urls
    // anything within a url() function is treated as a whole url, if the argument
    // doesn't start with either kind of quotation mark.
    // postcss-value-parser ignores those rules and allows comments within a url()
    // function if the first param starts with a space.

    // standard comments
    {
      it: 'should not parse comments at the end of url functions with quoted first argument, lead by a space',
      test: 'url( "/demo/bg.png" /*comment*/ )',
      expected: [
        { type: 'func', value: 'url' },
        { type: 'paren', value: '(' },
        { type: 'word', value: ' "/demo/bg.png" /*comment*/ ' },
        { type: 'paren', value: ')' }
      ]
    },
    {
      it: 'should not parse comments at the start of url function with unquoted first argument',
      test: 'url( /*comment*/ /demo/bg.png )',
      expected: [
        { type: 'func', value: 'url' },
        { type: 'paren', value: '(' },
        { type: 'word', value: ' /*comment*/ /demo/bg.png ' },
        { type: 'paren', value: ')' }
      ]
    },
    {
      it: 'should parse comments at the end of url function with unquoted first argument',
      test: 'url( /demo/bg.png /*comment*/ )',
      expected: [
        { type: 'func', value: 'url' },
        { type: 'paren', value: '(' },
        { type: 'word', value: ' /demo/bg.png /*comment*/ ' },
        { type: 'paren', value: ')' }
      ]
    },

    // double slash comments
    {
      it: 'should not parse double slash as comment in url function',
      test: 'url(//bar\n http://domain.com/foo/bar //foo\n)',
      loose: true,
      expected: [
        { type: 'func', value: 'url' },
        { type: 'paren', value: '(' },
        { type: 'operator', value: '/' },
        { type: 'operator', value: '/' },
        { type: 'word', value: 'bar' },
        { type: 'word', value: 'http' },
        { type: 'colon', value: ':' },
        { type: 'operator', value: '/' },
        { type: 'operator', value: '/' },
        { type: 'word', value: 'domain.com/foo/bar' },
        { type: 'operator', value: '/' },
        { type: 'operator', value: '/' },
        { type: 'word', value: 'foo' },
        { type: 'paren', value: ')' },
      ]
    }
  ];

  failures = [{
    it: 'should not parse unclosed comments',
    test: '/*comment*/ 1px /* unclosed '
  }];

  fixtures.forEach((fixture) => {
    it(fixture.it, () => {
      let ast = new Parser(fixture.test, { loose: fixture.loose }).parse(),
        index = 0;

      ast.first.walk((node) => {
        let expected = fixture.expected[index];
        index ++;

        if (expected) {
          expect(node).to.shallowDeepEqual(expected);
        }
      });
    });
  });

  failures.forEach((fixture) => {
    it(fixture.it, () => {
      expect(() => new Parser(fixture.test).parse()).to.throw(Error);
    });
  });

});
