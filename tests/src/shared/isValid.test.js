const expect = require("chai").expect;
const isValid = require('../../../src/shared/isValid');

describe('#isValid', () => {
  it('should have isValid method', () => {
    expect(isValid).to.be.an('object').and.include.all.keys('isValid');
    expect(isValid.isValid).to.be.an('function');
  });

  it('should validate a body when all is ok', () => {
    let body = {item: 'Teste', quantidade: '2'};
    let params = [
      'item',
      'quantidade'
    ]

    expect(isValid.isValid(body, params)).to.be.true;
  });

  it('should invalidate a body when a key is missing', () => {
    let body = {item: 'Teste'};
    let params = [
      'item',
      'quantidade'
    ]

    expect(isValid.isValid(body, params)).to.be.false;
  });

  it('should invalidate a body when a key type is incorrect', () => {
    let body = {item: 'Teste', quantidade: 10};
    let params = [
      'item',
      'quantidade'
    ]

    expect(isValid.isValid(body, params)).to.be.false;
  });
});
