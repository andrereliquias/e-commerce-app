const expect = require("chai").expect;

const response = require('../../../src/shared/response');

describe('#response', () => {
  it('should have json method', () => {
    expect(response).to.be.an('object').and.include.all.keys('json');
    expect(response.json).to.be.an('function');
  });

  it('should return an expected api gateway response in the lambda callback function', () => {
    let endpointResponse = {id: '1', item: 'teste'};
    let endpointStatusCode = 200;

    response.json( (error, response) => {

      expect(response).to.include.all.keys('statusCode', 'headers', 'body');
      expect(JSON.parse(response.body)).to.include(endpointResponse);
      expect(response.statusCode).to.equal(endpointStatusCode);
      expect(error).to.be.null;

    }, endpointResponse, endpointStatusCode);
  });
});
