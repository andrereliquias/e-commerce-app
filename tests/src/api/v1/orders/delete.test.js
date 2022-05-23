const expect = require("chai").expect;
const purge = require('../../../../../src/api/v1/orders/delete');
const db = require('../../../../../src/shared/database');

describe('#Orders#delete', () => {
  describe('when a valid request is made', () => {
    it('should return success', () => {
      Promise.resolve(db.insert({ id: '1'}, 'ordersTable'));

      const event = {
        resource: "/test/v1/orders",
        body: {},
        pathParameters: {id: '1'}
      }

      purge.delete(event, {}, (err, resp) => {
        expect(err).to.be.null;
        expect(resp.statusCode).to.equal(204);
        expect(Object.keys(JSON.parse(resp.body)).length).to.equal(0)
      });
    });
  });

  describe('when a invalid request is made', () => {
    it('should return a not found response with a 404 status code', () => {
      const event = {
        resource: "/test/v1/orders",
        body: {},
        pathParameters: {id: 'abc-def'}
      }

      purge.delete(event, {}, (err, resp) => {
        expect(err).to.be.null;
        expect(resp.statusCode).to.equal(404);
        expect(JSON.parse(resp.body)).to.have.property('erro');
      });
    })
  });
});
