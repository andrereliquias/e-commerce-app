const dynamoClient = require('../../../shared/database');
const response = require('../../../shared/response');
const responseErro = require('../../../shared/error');
const responseNotFound = require('../../../shared/notFound');
const check = require('../../../shared/isValid');

const PARAMS_TO_CHECK = [
  'item',
  'quantidade',
]

module.exports.update = (event, context, callback) => {
  body = JSON.parse(event.body);

  if (!check.isValid(body, PARAMS_TO_CHECK)) {
    responseErro.erro(callback, event.path, "Request inválido!", 400);
  }

  if (!body.hasOwnProperty('concluido') || !(typeof body['concluido'] === 'boolean')) {
    responseErro.erro(callback, event.path, "Request inválido! - Deve possuir o campo 'concluido' do tipo booleano", 400);
  }

  dynamoClient.read(event.pathParameters, 'ordersTable').then((success) => {

    if (Object.keys(success).length === 0) {
      responseNotFound.notFound(event, context, callback);
    } else {
        let params = {
          TableName: 'ordersTable',
          Key: event.pathParameters,
          UpdateExpression: 'set #item = :vItem, #quantidade = :vQuantidade, #concluido = :vConcluido, #modificadoEm = :vmodificadoEm',
          ExpressionAttributeNames: {
            '#item': 'item',
            '#quantidade': 'quantidade',
            '#concluido': 'concluido',
            '#modificadoEm': 'modificadoEm'
          },
          ExpressionAttributeValues: {
            ':vItem': body.item,
            ':vQuantidade': body.quantidade,
            ':vConcluido': body.concluido,
            ':vmodificadoEm': new Date(Date.now()).toISOString()
          },
          ReturnValues: 'ALL_NEW'
        };

      dynamoClient.update(params).then((success) => {
        response.json(callback, success.Attributes, 200);
      }).catch((erro) => {
        responseErro.erro(callback, event.path, erro.message);
      });
    }

  }).catch((erro) => {
    responseErro.erro(callback, event.path, erro.message);
  });
}
