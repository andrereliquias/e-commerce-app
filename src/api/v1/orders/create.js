'use-strict';

const uuid = require('uuid');
const dynamoClient = require('../../../shared/database');
const response = require('../../../shared/response');
const responseErro = require('../../../shared/error');
const check = require('../../../shared/isValid');

const PARAMS_TO_CHECK = [
  'item',
  'quantidade'
]

module.exports.create = (event, context, callback) => {
  body = JSON.parse(event.body);

  if(!check.isValid(body, PARAMS_TO_CHECK)) {
    responseErro.erro(callback, event.path, "Request inválido!", 400);
  }

  let item = {
    id: uuid.v4(),
    item: body.item,
    quantidade: body.quantidade,
    concluido: false,
    criadoEm: new Date(Date.now()).toISOString(),
    modificadoEm: null
  };

  dynamoClient.insert(item, 'ordersTable').then((success) => {
    response.json(callback, item, 201);
  }).catch((erro) => {
    responseErro.erro(callback, event.path, erro.message);
  });

};
