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
    '.23rem',
    '0.5',
    '-0.5',
    '2.',
    '+2',
    '-2',
    '5/5',
    '5 +5',
    '5 + 5',
    '-2px',
    '-16px',
    '-16px -1px -1px -16px',
    '1e10',
    '1E10',
    '1e-10',
    '1E-10',
    '1e+10',
    '1E+10',
    '-.567800E-0012780em',
    '.1E-10',
    '.1E+10'
  ],
  throws: ['+-2.', '.', '.rem', '.2.3rem']
};

// TODO: '1e -10', '1e'
