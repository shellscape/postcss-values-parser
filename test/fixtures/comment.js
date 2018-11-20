/*
  Copyright © 2018 Andrew Powell

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of this Source Code Form.
*/
module.exports = {
  snapshot: [
    '/*before*/ 1px /*between*/ 1px /*after*/',
    // TODO: uncomment when function nodes are done
    // 'rgba( 0, 55/55, 0/*,.5*/ )',
    // 'url("/demo/bg.png" /*comment*/ )',
    '/**/',
    '//before\n 1px //between\n 1px //after\n',
    // 'rgba( 0, 55/55, 0//,.5\n )',
    // 'url(var(//comment\n))',
    '//\n',
    '//',
    '/*before*/\n//between\n/*after*/',
    '//before\n/*between*/\n//after'
    // 'url( "/demo/bg.png" /*comment*/ )',
    // 'url( /*comment*/ /demo/bg.png )',
    // 'url( /demo/bg.png /*comment*/ )',
    // 'url(//bar\n http://domain.com/foo/bar //foo\n)',
  ],
  throws: ['/*comment*/ 1px /* unclosed ']
};
