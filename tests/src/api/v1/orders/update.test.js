const expect = require("chai").expect;
const update = require('../../../../../src/api/v1/orders/update');
const db = require('../../../../../src/shared/database');

describe('#Orders#update', () => {
  describe('when a valid request is made', () => {
    it('should return success', () => {
      Promise.resolve(db.insert({ id: '1'}, 'ordersTable'));

      const event = {
        resource: "/test/v1/orders",
        body: JSON.stringify({item: 'Updated', quantidade: '2', concluido: true}),
        pathParameters: {id: '1'}
      }

      update.update(event, {}, (err, resp) => {
        expect(err).to.be.null;
        expect(resp.statusCode).to.equal(200);
        expect(JSON.parse(resp.body)).to.have.property('quantidade');
        expect(JSON.parse(resp.body)).to.have.property('concluido');
      });
    });
  });

  describe('when a invalid request is made', () => {
    it('should return a not found response with a 404 status code', () => {
      const event = {
        resource: "/test/v1/orders",
        body: JSON.stringify({item: 'Updated new', quantidade: '1', concluido: false}),
        pathParameters: {id: 'abc-def'}
      }

      update.update(event, {}, (err, resp) => {
        expect(err).to.be.null;
        expect(resp.statusCode).to.equal(404);
        expect(JSON.parse(resp.body)).to.have.property('erro');
      });
    })
  });
});
