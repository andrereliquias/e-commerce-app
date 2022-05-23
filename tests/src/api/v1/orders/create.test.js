const expect = require("chai").expect;
const create = require('../../../../../src/api/v1/orders/create');
const AWS = require('aws-sdk-mock');
const path = require('path');
AWS.setSDK(path.resolve('./node_modules/aws-sdk'));

AWS.mock('DynamoDB.DocumentClient', 'put', (params, callback) => {
  callback(null, {});
});

describe('#create', () => {
  describe('when a valid request is made', () => {
    it('should return success', () => {
      const event = {
        resource: "/test/v1/orders",
        body: JSON.stringify({
          item: "Mesa",
          quantidade: "1"
        })
      }

      create.create(event, {}, (err, resp) => {
        expect(err).to.be.null;
        expect(resp.statusCode).to.equal(201);
      });

    });
  });

  describe('when a invalid request is made', () => {
    it('should return an error', () => {
      const event = {
        resource: "/test/v1/orders",
        body: JSON.stringify({
          item: "Mesa"
        })
      }

      create.create(event, {}, (err, resp) => {
        expect(err).to.be.null;
        expect(resp.statusCode).to.equal(400);
      });

    });
  });
});

AWS.restore('DynamoDB.DocumentClient');
