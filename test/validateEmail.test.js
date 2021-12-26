import { expect } from 'chai';

import { validateEmail } from '../src/static/scripts/functions/validateEmail';

describe('validateEmail(str)', () => {
  it('a valid email address should return true', () => {
    expect(validateEmail('test@test.co.uk')).to.equal(true);
  });

  it('an invalid email address should return false', () => {
    expect(validateEmail('test@test')).to.equal(false);
  });

  it('empty value should return false', () => {
    expect(validateEmail()).to.equal(false);
  });
});
