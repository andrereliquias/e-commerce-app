const dynamoClient = require('../../../shared/database');
const response = require('../../../shared/response');
const responseErro = require('../../../shared/error');
const responseNotFound = require('../../../shared/notFound');
const check = require('../../../shared/isValid');

module.exports.delete = (event, context, callback) => {

  dynamoClient.read(event.pathParameters, 'ordersTable').then((success) => {

    if (Object.keys(success).length === 0) {
      responseNotFound.notFound(event, context, callback);
    } else {

      dynamoClient.delete(event.pathParameters, 'ordersTable').then((success) => {
        console.log(success)

        response.json(callback, success, 200);
      }).catch((erro) => {
        responseErro.erro(callback, event.path, erro.message);
      });
    }

  }).catch((erro) => {
    console.log('Deu erro')
    responseErro.erro(callback, event.path, erro.message);
  });
}
