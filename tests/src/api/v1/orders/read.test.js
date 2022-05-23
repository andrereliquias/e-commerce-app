const expect = require("chai").expect;
const read = require('../../../../../src/api/v1/orders/read');
const db = require('../../../../../src/shared/database');
const AWS = require('aws-sdk-mock');
const path = require('path');
AWS.setSDK(path.resolve('./node_modules/aws-sdk'));
AWS.mock('DynamoDB.DocumentClient', 'scan', (params, callback) => {
  callback(null, [{ id: "1", item: "mock" }]);
});

describe('#read', () => {
  describe('when a valid request is made', () => {
    it('should return success', () => {
      const event = {
        resource: "/test/v1/orders",
        body: {},
        pathParameters: {}
      }

      read.read(event, {}, (err, resp) => {
        expect(err).to.be.null;
        expect(resp.statusCode).to.equal(200);
        expect(JSON.parse(resp.body)).to.be.an.instanceof(Array);
      });
    });
  });

});

describe('#readById', () => {
  describe('when a order is founded', () => {
    it('should return success with a 200 status code', () => {

      Promise.resolve(db.insert({ id: '2'}, 'ordersTable'));

      const event = {
        resource: "/test/v1/orders",
        body: {},
        pathParameters: { id: '2' }
      }

      read.readById(event, {}, (err, resp) => {
        expect(err).to.be.null;
        expect(resp.statusCode).to.equal(200);
      });
    });
  });

  describe('when a order is not founded', () => {
    it('should return success with a 404 status code', () => {

      const event = {
        resource: "/test/v1/orders",
        body: {},
        pathParameters: { id: '1' }
      }

      read.readById(event, {}, (err, resp) => {
        expect(err).to.be.null;
        expect(resp.statusCode).to.equal(404);
      });
    });
  });

});

AWS.restore('DynamoDB.DocumentClient');
