const expect = require("chai").expect;
const create = require('../../../../../src/api/v1/auth/create');
const AWS = require('aws-sdk-mock');
const path = require('path');
AWS.setSDK(path.resolve('./node_modules/aws-sdk'));

AWS.mock('DynamoDB.DocumentClient', 'put', (params, callback) => {
  callback(null, {});
});

describe('#Auth#create', () => {
  describe('when a valid request is made', () => {
    it('should return success', () => {
      const event = {
        resource: "/test/v1/credentials",
        body: JSON.stringify({
          cpf: '00000000000',
          nome: 'Andre',
          email: 'andre@gmail.com',
          telefone: '+5511123456789',
          senha: 'senhamuitoforte'
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
          cpf: '00000000000',
          nome: 'Andre',
          email: 'andre@gmail.com',
          telefone: '+5511123456789',
        })
      }

      create.create(event, {}, (err, resp) => {
        expect(err).to.be.null;
        expect(resp.statusCode).to.equal(400);
      });

    });

    it('should return an error for a invalid phone', () => {
      const event = {
        resource: "/test/v1/orders",
        body: JSON.stringify({
          cpf: '00000000000',
          nome: 'Andre',
          email: 'andre@gmail.com',
          telefone: '51235',
          senha: 'senhamuitoforte'
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
