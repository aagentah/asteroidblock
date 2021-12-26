import { expect } from 'chai';

import { getRandomFloat } from '../src/static/scripts/functions/getRandomFloat';

describe('getRandomFloat(min, max)', () => {
  it('should return a number', () => {
    expect(getRandomFloat(1, 100)).to.be.a('number');
  });

  it('should be greater or equal to the minimum value', () => {
    expect(getRandomFloat(1, 100)).to.be.at.least(1);
  });

  it('should be lower than or equal to the maximum value', () => {
    expect(getRandomFloat(1, 100)).to.be.at.most(100);
  });
});
