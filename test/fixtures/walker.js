/*
  Copyright © 2018 Andrew Powell

  This Source Code Form is subject to the terms of the Mozilla Public
  License, v. 2.0. If a copy of the MPL was not distributed with this
  file, You can obtain one at http://mozilla.org/MPL/2.0/.

  The above copyright notice and this permission notice shall be
  included in all copies or substantial portions of this Source Code Form.
*/
module.exports = {
  values: [
    {
      value: 'calc((foo(768px - 100vw) / 2) - 15px) // batman\n//joker',
      walkers: [
        { length: 2, type: 'Comments' },
        { length: 2, type: 'Funcs' },
        { length: 4, type: 'Numerics' },
        { length: 2, type: 'Punctuations' },
        { length: 0, type: 'Words' }
      ]
    }
  ]
};
