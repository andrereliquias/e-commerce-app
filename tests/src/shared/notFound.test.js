const expect = require("chai").expect;

const notFound = require('../../../src/shared/notFound');

describe('#notFound', () => {
  it('should have notFound method', () => {
    expect(notFound).to.be.an('object').and.include.all.keys('notFound');
    expect(notFound.notFound).to.be.an('function');
  });

  it('should return a response to a not found resource case', () => {
    let event = {
      path: '/teste/v1/orders/1'
    }

    let responseNotFound = {recurso: event.path, erro: 'Recurso não encontrado'};

    notFound.notFound(event, null, (error, response) => {

      expect(response).to.include.all.keys('statusCode', 'headers', 'body');
      expect(JSON.parse(response.body)).to.include(responseNotFound);
      expect(response.statusCode).to.equal(404);
      expect(error).to.be.null;

    });
  });
});
