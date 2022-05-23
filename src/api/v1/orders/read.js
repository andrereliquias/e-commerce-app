const dynamoClient = require('../../../shared/database');
const response = require('../../../shared/response');
const responseErro = require('../../../shared/error');
const responseNotFound = require('../../../shared/notFound');

module.exports.read = (event, context, callback) => {
  let params = {
    TableName: 'ordersTable'
  }

  dynamoClient.search(params).then((success) => {
    response.json(callback, success.Items, 200);
  }).catch((erro) => {
    responseErro.erro(callback, event.resource, erro.message);
  });

}

module.exports.readById = (event, context, callback) => {

  dynamoClient.read(event.pathParameters, 'ordersTable').then((success) => {

    if (Object.keys(success).length !== 0) {
      response.json(callback, success.Item, 200);
    } else {
      responseNotFound.notFound(event, context, callback);
    }

  }).catch((erro) => {
    responseErro.erro(callback, event.resource, erro.message);
  });
}
