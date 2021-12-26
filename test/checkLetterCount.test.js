import { expect } from 'chai';

import { checkLetterCount } from '../src/static/scripts/functions/checkLetterCount';

describe('checkLetterCount(input, limit)', () => {
  const shortText = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
  const longText = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';

  it('should return a boolean', () => {
    expect(checkLetterCount(shortText, 140)).to.be.a('boolean');
  });

  it('should return true if length is under limit', () => {
    expect(checkLetterCount(shortText, 140)).to.equal(false);
  });

  it('should return false if length exceeds limit', () => {
    expect(checkLetterCount(longText, 140)).to.equal(true);
  });
});
