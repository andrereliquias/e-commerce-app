// this file will set up the settings for the tests executions

const before = require('mocha').before;
let AWS = require('aws-sdk');

before( async() => {
  let db = new AWS.DynamoDB;

  var params = {
    AttributeDefinitions: [
      {
        AttributeName: "id",
        AttributeType: "S"
      }
    ],
    KeySchema: [
       {
      AttributeName: "id",
      KeyType: "HASH"
     }
    ],
    ProvisionedThroughput: {
     ReadCapacityUnits: 5,
     WriteCapacityUnits: 5
    },
    TableName: "ordersTable"
  };

  try {
    await db.createTable(params).promise();
  } catch (error){};
});
