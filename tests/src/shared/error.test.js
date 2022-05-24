const expect = require("chai").expect;

const error = require('../../../src/shared/error');

describe('#erro', () => {
  it('should have erro method', () => {
    expect(error).to.be.an('object').and.include.all.keys('erro');
    expect(error.erro).to.be.an('function');
  });

  it('should return a response with a defined object', () => {
    let responseErro = {recurso: '/teste/v1/teste', erro: 'Something went wrong'};

    error.erro( (error, response) => {

      expect(response).to.include.all.keys('statusCode', 'headers', 'body');
      expect(JSON.parse(response.body)).to.include(responseErro);
      expect(response.statusCode).to.equal(500);
      expect(error).to.be.null;

    }, '/teste/v1/teste');
  });

  it('should return a response with a personalized message and status code', () => {
    let responseErro = {recurso: '/teste/v1/orders/12', erro: 'Erro ao conectar com o banco de dados'};

    error.erro( (error, response) => {

      expect(response).to.include.all.keys('statusCode', 'headers', 'body');
      expect(JSON.parse(response.body)).to.include(responseErro);
      expect(response.statusCode).to.equal(500);
      expect(error).to.be.null;

    }, '/teste/v1/orders/12', 'Erro ao conectar com o banco de dados', 500);
  });
});
