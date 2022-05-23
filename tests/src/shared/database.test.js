const expect = require("chai").expect;
const AWS = require('aws-sdk-mock');
const path = require('path');

AWS.setSDK(path.resolve('./node_modules/aws-sdk'));

AWS.mock('DynamoDB.DocumentClient', 'put', (params, callback) => {
  callback(null, {});
});

AWS.mock('DynamoDB.DocumentClient', 'get', (params, callback) => {
  callback(null, {Item: { id: "1", item: "mock" }});
});

AWS.mock('DynamoDB.DocumentClient', 'query', (params, callback) => {
  callback(null, {Items: [{ id: "1", item: "mock" }]});
});

AWS.mock('DynamoDB.DocumentClient', 'update', (params, callback) => {
  callback(null, {Attributes: { id: "1", item: "updated" }});
});

AWS.mock('DynamoDB.DocumentClient', 'delete', (params, callback) => {
  callback(null, {});
});


const database = require('../../../src/shared/database');

describe('#dynamodb', () => {
  describe('insert()', () => {
    it("should have insert method", () => {
      expect(database).to.be.an('object').and.include.all.keys('insert');
      expect(database.insert).to.be.an('function');
    });

    it('should insert a new item', async () => {
      let item = {
        id: '0',
        item: 'insertion'
      };

      let res = await database.insert(item, 'ordersTable');

      expect(res).to.be.an('object');
      expect(res).to.be.empty;
    });
  });

  describe('read()', () => {{
    it("should have read method", () => {
      expect(database).to.be.an('object').and.include.all.keys('read');
      expect(database.read).to.be.an('function');
    });

    // it('should read a item', async () => {
    //   let keys = {
    //     id: '1'
    //   };

    //   let res = (await database.read(keys, 'ordersTable')).Item;

    //   expect(res).to.be.an('object');
    //   expect(Object.keys(res)).to.have.lengthOf(2);
    // });
  }});

  describe('query()', () => {
    it("should have query method", () => {
      expect(database).to.be.an('object').and.include.all.keys('query');
      expect(database.query).to.be.an('function');
    });

    // it('should query a item', async () => {
    //   let params = {
    //     TableName: 'ordersTable',
    //     KeyConditionExpression: '#partitionKey = :pKeyValue',
    //     ExpressionAttributeNames: {
    //       '#partitionKey': 'id'
    //     },
    //     ExpressionAttributeValues: {
    //       ':pKeyValue': '1'
    //     }
    //   }

    //   let res = (await database.query(params)).Items;

    //   expect(res).to.be.an('array');
    //   expect(res).to.have.lengthOf(1);
    //   expect(Object.keys(res[0])).to.have.lengthOf(2);
    // });
  });

  describe('update()', () => {
    it("should have update method", () => {
      expect(database).to.be.an('object').and.include.all.keys('update');
      expect(database.update).to.be.an('function');
    });

    it('should update a item', async () => {
      let params = {
        TableName: 'ordersTable',
        Key: {
          id: '1'
        },
        UpdateExpression: 'set #variable = :value',
        ExpressionAttributeNames: {
          '#variable': 'item'
        },
        ExpressionAttributeValues: {
          ':value': 'updated'
        },
        ReturnValues: 'ALL_NEW'
      };

      let res = (await database.update(params)).Attributes;

      expect(res).to.be.an('object');
      expect(Object.keys(res)).to.have.lengthOf(2);
      expect(res.item).to.equal('updated');
    });
  });

  describe('delete()', () => {
    it("should have delete method", () => {
      expect(database).to.be.an('object').and.include.all.keys('delete');
      expect(database.delete).to.be.an('function');
    });

    it('should delete a item', async () => {
      let keys = {
        id: '1'
      };

      let res = (await database.delete(keys, 'ordersTable'));

      expect(res).to.be.an('object');
      expect(res).to.be.empty;
    });
  });
});

AWS.restore('DynamoDB.DocumentClient');
