'use strict';

const chai = require('chai');
const shallowDeepEqual = require('chai-shallow-deep-equal');
const Parser = require('../lib/parser');

let expect = chai.expect;

describe('Parser → Atrule', () => {

  chai.use(shallowDeepEqual);

  let fixtures,
    failures;

  fixtures = [
    {
      it: 'should parse atword',
      test: '   @word      ',
      expected: [
        { type: 'atword', value: 'word', raws: { before: '   ', after: '      ' } }
      ]
    },
    {
      it: 'should not parse escaped @ after @ (@\\@)',
      test: '   @\\@word      ',
      expected: [
        { type: 'atword', value: '\\', raws: { before: '   ', after: '' } }
      ]
    }
  ];

  fixtures.forEach((fixture) => {
    it(fixture.it, () => {
      let ast = new Parser(fixture.test).parse();

      ast.first.walk((node, index) => {
        let expected = fixture.expected[index];

        if (expected) {
          expect(node).to.shallowDeepEqual(expected);
        }
      });
    });
  });

  failures && failures.forEach((fixture) => {
    it(fixture.it, () => {
      expect(() => new Parser(fixture.test).parse()).to.throw(Error);
    });
  });

});
