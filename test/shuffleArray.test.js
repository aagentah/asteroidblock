import { expect } from 'chai';

import { shuffleArray } from '../src/static/scripts/functions/shuffleArray';

describe('shuffleArray(arr)', () => {
  const arr = [1, 2, 3, 4, 5];
  const mix = shuffleArray(arr);

  it('should still contain the same keys', () => {
    expect(mix).to.have.members(arr);
  });
});
