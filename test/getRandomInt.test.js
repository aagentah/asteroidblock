import { expect } from 'chai';

import { getRandomInt } from '../src/static/scripts/functions/getRandomInt';

describe('getRandomInt(min, max)', () => {
  it('should return a number', () => {
    expect(getRandomInt(1, 100)).to.be.a('number');
  });

  it('should be greater or equal to the minimum value', () => {
    expect(getRandomInt(1, 100)).to.be.at.least(1);
  });

  it('should be lower than or equal to the maximum value', () => {
    expect(getRandomInt(1, 100)).to.be.at.most(100);
  });
});
