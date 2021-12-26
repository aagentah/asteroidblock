import { expect } from 'chai';

import { uuid } from '../src/static/scripts/functions/uuid';

describe('uuid', () => {
  it('should return a string', () => {
    expect(uuid()).to.be.a('string');
  });

  it('should equal 36 characters', () => {
    expect(uuid()).to.have.length(36);
  });
});
