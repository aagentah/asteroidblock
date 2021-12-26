import { expect } from 'chai';

import { getRandomKey } from '../src/static/scripts/functions/getRandomKey';

describe('getRandomKey(arr)', () => {
  const arr = [1, 2, 3, 4, 5];
  const key = getRandomKey(arr);

  it('should return a random key from array', () => {
    expect(arr).to.include(key);
  });
});
