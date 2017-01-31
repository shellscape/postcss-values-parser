'use strict';

const expect = require('chai').expect;
const Parser = require('../lib/parser');
const ParserError = require('../lib/errors/ParserError');

describe('Parser → Number', () => {

  let fixtures = [
    {
      test: '.23rem',
      expected: { value: '.23', unit: 'rem', length: 1 }
    },
    {
      test: '.2.3rem',
      expected: { value: '.2', unit: '.3rem', length: 1 }
    },
    {
      test: '2.',
      expected: { value: '2.', unit: '', length: 1 }
    },
    {
      test: '+2',
      expected: { value: '+2', unit: '', length: 1 }
    },
    {
      test: '-2',
      expected: { value: '-2', unit: '', length: 1 }
    },
    {
      test: '+-2.',
      expected: { throw: true }
    },
    {
      test: '5/5',
      expected: { value: '5', unit: '', length: 3 }
    },
    {
      test: '5+ 5',
      expected: { throw: true }
    },
    {
      test: '5 +5',
      expected: { throw: true }
    },
    {
      test: '5+5',
      expected: { throw: true }
    },
    {
      test: '5 + 5',
      expected: { value: '5', unit: '', length: 3 }
    },
    {
      test: '.',
      expected: { fail: true, length: 1 }
    },
    {
      test: '.rem',
      expected: { fail: true, length: 1 }
    }
  ];

  fixtures.forEach((fixture) => {
    it('should ' + (fixture.expected.throw ? 'not ' : '')  + 'parse ' + fixture.test, () => {
      let node,
        ast;

      function parse () {
        ast = new Parser(fixture.test).parse();
        node = ast.first.last;
      }

      if (fixture.expected.throw) {
        expect(parse).to.throw(ParserError);
      }
      else {
        parse();

        expect(ast.first.nodes.length).to.equal(fixture.expected.length);

        if (fixture.expected.fail) {
          expect(node.value).to.equal(fixture.test);
        }
        else {
          expect(node.value).to.equal(fixture.expected.value);
          expect(node.unit).to.equal(fixture.expected.unit);
        }
      }
    });
  });

});

describe('Parser → Number : Loose', () => {

  let fixtures = [
    {
      test: '-2',
      expected: { value: '-2', unit: '', length: 1 }
    },
    {
      test: '  -2',
      expected: { value: '-2', unit: '', length: 1 }
    },
    {
      test: '+-2.',
      expected: { value: '-2.', unit: '', length: 2 }
    },
    {
      test: '5+ 5',
      expected: { value: '5', unit: '', length: 3 }
    },
    {
      test: '1+ 5 + +5',
      expected: { value: '+5', unit: '', length: 5 }
    },
    {
      test: '5+5',
      expected: { value: '5', unit: '', length: 3 }
    },
    {
      test: '5+-+-+-+5',
      expected: { value: '+5', unit: '', length: 8 }
    }
  ];

  fixtures.forEach((fixture) => {
    it('should ' + (fixture.expected.throw ? 'not ' : '')  + 'parse ' + fixture.test, () => {
      let ast = new Parser(fixture.test, { loose: true }).parse(),
        node = ast.first.last;

      expect(ast.first.nodes.length).to.equal(fixture.expected.length);
      expect(node.value).to.equal(fixture.expected.value);
      expect(node.unit).to.equal(fixture.expected.unit);
    });
  });

});
