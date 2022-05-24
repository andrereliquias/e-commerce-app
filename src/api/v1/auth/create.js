'use-strict';

const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();;
const PNF = require('google-libphonenumber').PhoneNumberFormat;

const dynamoClient = require('../../../shared/database');
const response = require('../../../shared/response');
const responseErro = require('../../../shared/error');
const check = require('../../../shared/isValid');

const PARAMS_TO_CHECK = [
  'cpf',
  'nome',
  'email',
  'telefone',
  'senha'
]

module.exports.create = (event, context, callback) => {
  body = JSON.parse(event.body);

  if(!check.isValid(body, PARAMS_TO_CHECK)) {
    responseErro.erro(callback, event.path, "Request inválido!", 400);
  }

  let parsedPhone = ''

  try {
    let phoneNumber = phoneUtil.parse(body.telefone);
    parsedPhone = phoneUtil.format(phoneNumber, PNF.E164)
  } catch (error) {
    responseErro.erro(callback, event.path, "Telefone inválido! - Deve seguir o padrão E164", 400);
  }

  // Realizar validações das informações
  // Realizar criptografia da senha

  let item = {
    partitionKey: body.email,
    sortKey: body.senha,
    cpf: body.cpf,
    nome: body.nome,
    email: body.email,
    telefone: parsedPhone,
    senha: body.senha
  };

  dynamoClient.insert(item, 'credentialsTable').then((success) => {
    delete item.partitionKey;
    delete item.sortKey;

    response.json(callback, item, 201);
  }).catch((erro) => {
    responseErro.erro(callback, event.path, erro.message);
  });

};
