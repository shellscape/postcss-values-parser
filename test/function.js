'use strict';

const chai = require('chai');
const shallowDeepEqual = require('chai-shallow-deep-equal');
const Parser = require('../lib/parser');

let expect = chai.expect;

describe('Parser → Function', () => {

  chai.use(shallowDeepEqual);

  let fixtures,
    failures;

  fixtures = [
    {
      it: 'should parse empty url function',
      test: 'url()',
      expected: [
        { type: 'func', value: 'url' },
        { type: 'paren', value: '(' },
        { type: 'paren', value: ')' }
      ]
    },
    {
      it: 'should parse empty url function with values following',
      test: 'url() foo bar baz',
      expected: [
        { type: 'func', value: 'url' },
        { type: 'paren', value: '(' },
        { type: 'paren', value: ')' },
        { type: 'word', value: 'foo' },
        { type: 'word', value: 'bar' },
        { type: 'word', value: 'baz' }
      ]
    },
    {
      it: 'should loosely parse url function with sub func #30',
      test: 'url(var(foo))',
      loose: true,
      expected: [
        { type: 'func', value: 'url' },
        { type: 'paren', value: '(' },
        { type: 'func', value: 'var' },
        { type: 'paren', value: '(' },
        { type: 'word', value: 'foo' },
        { type: 'paren', value: ')' },
        { type: 'paren', value: ')' }
      ]
    },
    {
      it: 'should parse url function',
      test: 'url( /gfx/img/bg.jpg )',
      expected: [
        { type: 'func', value: 'url' },
        { type: 'paren', value: '(' },
        { type: 'word', value: ' /gfx/img/bg.jpg ' },
        { type: 'paren', value: ')' }
      ]
    },
    {
      it: 'should parse url function with single quotes',
      test: 'url( \'/gfx/img/bg.jpg\' )',
      expected: [
        { type: 'func', value: 'url' },
        { type: 'paren', value: '(' },
        { type: 'word', value: ' \'/gfx/img/bg.jpg\' ' },
        { type: 'paren', value: ')' }
      ]
    },
    {
      it: 'should parse url function with single quotes (loose)',
      test: 'url( \'/gfx/img/bg.jpg\' )',
      loose: true,
      expected: [
        { type: 'func', value: 'url' },
        { type: 'paren', value: '(' },
        { type: 'string', value: '/gfx/img/bg.jpg', raws: { before: ' ', after: " ", quote: '\'' } },
        { type: 'paren', value: ')' }
      ]
    },
    {
      it: 'should parse url function with double quotes',
      test: 'url( "/gfx/img/bg.jpg" )',
      expected: [
        { type: 'func', value: 'url' },
        { type: 'paren', value: '(' },
        { type: 'word', value: ' "/gfx/img/bg.jpg" ' },
        { type: 'paren', value: ')' }
      ]
    },
    {
      it: 'should parse url function with double quotes (loose)',
      test: 'url( "/gfx/img/bg.jpg" )',
      loose: true,
      expected: [
        { type: 'func', value: 'url' },
        { type: 'paren', value: '(' },
        { type: 'string', value: '/gfx/img/bg.jpg', raws: { before: ' ', after: " ", quote: '"' } },
        { type: 'paren', value: ')' }
      ]
    },
    {
      it: 'should parse absolute url function',
      test: 'url( http://domain.com/gfx/img/bg.jpg )',
      expected: [
        { type: 'func', value: 'url' },
        { type: 'paren', value: '(' },
        { type: 'word', value: ' http://domain.com/gfx/img/bg.jpg ' },
        { type: 'paren', value: ')' }
      ]
    },
    {
      it: 'should parse absolute url function (loose)',
      test: 'url( http://domain.com/gfx/img/bg.jpg )',
      loose: true,
      expected: [
        { type: 'func', value: 'url' },
        { type: 'paren', value: '(' },
        { type: 'word', value: 'http' },
        { type: 'colon', value: ':' },
        { type: 'operator', value: '/' },
        { type: 'operator', value: '/' },
        { type: 'word', value: 'domain.com/gfx/img/bg.jpg' },
        { type: 'paren', value: ')' }
      ]
    },
    {
      it: 'should parse absolute url function with single quotes',
      test: 'url( \'http://domain.com/gfx/img/bg.jpg\' )',
      expected: [
        { type: 'func', value: 'url' },
        { type: 'paren', value: '(' },
        { type: 'word', value: ' \'http://domain.com/gfx/img/bg.jpg\' ' },
        { type: 'paren', value: ')' }
      ]
    },
    {
      it: 'should parse absolute url function with double quotes',
      test: 'url( "http://domain.com/gfx/img/bg.jpg" )',
      expected: [
        { type: 'func', value: 'url' },
        { type: 'paren', value: '(' },
        { type: 'word', value: ' "http://domain.com/gfx/img/bg.jpg" ' },
        { type: 'paren', value: ')' }
      ]
    },
    {
      it: 'should parse url function with quoted first argument',
      test: 'url("/gfx/img/bg.jpg" hello )',
      expected: [
        { type: 'func', value: 'url' },
        { type: 'paren', value: '(' },
        { type: 'string', value: '/gfx/img/bg.jpg', raws: { quote: '"' } },
        { type: 'word', value: 'hello' },
        { type: 'paren', value: ')' }
      ]
    },
    {
      it: 'should parse absolute url function with quoted first argument',
      test: 'url("http://domain.com/gfx/img/bg.jpg" hello )',
      expected: [
        { type: 'func', value: 'url' },
        { type: 'paren', value: '(' },
        { type: 'string', value: 'http://domain.com/gfx/img/bg.jpg', raws: { quote: '"' } },
        { type: 'word', value: 'hello' },
        { type: 'paren', value: ')' }
      ]
    },
    {
      it: 'should parse absolute url function with quoted first argument (loose)',
      test: 'url("http://domain.com/gfx/img/bg.jpg" hello )',
      loose: true,
      expected: [
        { type: 'func', value: 'url' },
        { type: 'paren', value: '(' },
        { type: 'string', value: 'http://domain.com/gfx/img/bg.jpg', raws: { quote: '"' } },
        { type: 'word', value: 'hello' },
        { type: 'paren', value: ')' }
      ]
    },
    {
      it: 'should parse rgba function',
      test: 'rgba( 29, 439 , 29 )',
      expected: [
        { type: 'func', value: 'rgba' },
        { type: 'paren', value: '(' },
        { type: 'number', value: '29', raws: { before: ' ' } },
        { type: 'comma', value: ',' },
        { type: 'number', value: '439', raws: { before: ' ' } },
        { type: 'comma', value: ',', raws: { before: ' ' } },
        { type: 'number', value: '29', raws: { before: ' ' } },
        { type: 'paren', value: ')' }
      ]
    },
    {
      it: 'should parse calc function with number and var #29',
      test: 'calc(-0.5 * var(foo))',
      expected: [
        { type: 'func', value: 'calc' },
        { type: 'paren', value: '(' },
        { type: 'number', value: '-0.5', unit: '' },
        { type: 'operator', value: '*' },
        { type: 'func', value: 'var' },
        { type: 'paren', value: '(' },
        { type: 'word', value: 'foo' },
        { type: 'paren', value: ')' },
        { type: 'paren', value: ')' }
      ]
    },
    {
      it: 'should parse calc function with nutty numbers',
      test: 'calc(1px + -2vw - 4px)',
      expected: [
        { type: 'func', value: 'calc' },
        { type: 'paren', value: '(' },
        { type: 'number', value: '1', unit: 'px' },
        { type: 'operator', value: '+' },
        { type: 'number', value: '-2', unit: 'vw' },
        { type: 'operator', value: '-' },
        { type: 'number', value: '4', unit: 'px' },
        { type: 'paren', value: ')' }
      ]
    },
    {
      it: 'should parse nested calc functions',
      test: 'calc(((768px - 100vw) / 2) - 15px)',
      expected: [
        { type: 'func', value: 'calc' },
        { type: 'paren', value: '(' },
        { type: 'paren', value: '(' },
        { type: 'paren', value: '(' },
        { type: 'number', value: '768', unit: 'px' },
        { type: 'operator', value: '-' },
        { type: 'number', value: '100', unit: 'vw' },
        { type: 'paren', value: ')' },
        { type: 'operator', value: '/', raws: { before: ' ' } },
        { type: 'number', value: '2', raws: { before: ' ' } },
        { type: 'paren', value: ')' },
        { type: 'operator', value: '-', raws: { before: ' ' } },
        { type: 'number', value: '15', unit: 'px', raws: { before: ' ' } },
        { type: 'paren', value: ')' }
      ]
    },
    {
      it: 'should parse calc function with scss interpolation #23',
      test: 'calc(100% - #{$margin * 2px})',
      expected: [
        { type: 'func', value: 'calc' },
        { type: 'paren', value: '(' },
        { type: 'number', value: '100', unit: '%' },
        { type: 'operator', value: '-' },
        { type: 'word', value: '#' },
        { type: 'word', value: '{' },
        { type: 'word', value: '$margin' },
        { type: 'operator', value: '*' },
        { type: 'number', value: '2', unit: 'px' },
        { type: 'word', value: '}' },
        { type: 'paren', value: ')' }
      ]
    },
    {
      it: 'should parse nested functions',
      test: 'bar(baz(black, 10%), 10%)',
      expected: [
        { type: 'func', value: 'bar' },
        { type: 'paren', value: '(' },
        { type: 'func', value: 'baz' },
        { type: 'paren', value: '(' },
        { type: 'word', value: 'black' },
        { type: 'comma', value: ',' },
        { type: 'number', value: '10' },
        { type: 'paren', value: ')' },
        { type: 'comma', value: ',' },
        { type: 'number', value: '10' },
        { type: 'paren', value: ')' }
      ]
    },
    {
      it: 'should parse a browser-prefix function',
      test: '-webkit-linear-gradient(0)',
      expected: [
        { type: 'func', value: '-webkit-linear-gradient' },
        { type: 'paren', value: '(' },
        { type: 'number', value: '0' },
        { type: 'paren', value: ')' }
      ]
    }
  ];

  failures = [{
    it: 'should not parse url function with missing closing paren',
    test: 'url( /gfx/img/bg.jpg '
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
