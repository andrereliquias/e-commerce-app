'use-strict';

const dynamoClient = require('../../../shared/database');
const response = require('../../../shared/response');
const responseErro = require('../../../shared/error');
const check = require('../../../shared/isValid');
const jwt = require('jsonwebtoken')

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = require('twilio')(accountSid, authToken);

const PARAMS_TO_CHECK = [
  'email',
  'senha'
]

module.exports.firstLoginStep = (event, context, callback) => {
  body = JSON.parse(event.body);

  if(!check.isValid(body, PARAMS_TO_CHECK)) {
    responseErro.erro(callback, event.path, "Request inválido!", 400);
  }

  params = {
    TableName: 'credentialsTable',
    KeyConditionExpression: 'partitionKey = :pkey and sortKey = :svalue',
    ExpressionAttributeValues: {
      ':pkey': body.email,
      ':svalue': body.senha,
    }
  };

  dynamoClient.query(params).then((success) => {

    if (success.Items.length === 0 ) {
      responseErro.erro(callback, event.path, "Usuário ou senha inválido", 401);
    }

    let temporaryAccessToken = jwt.sign(success.Items[0], process.env.ACCESS_TOKEN_SECRET, { expiresIn: '5m' });
    let phoneNumber = success.Items[0].telefone;

    let item = {
      partitionKey: 'TEMPORARY_TOKEN',
      sortKey: temporaryAccessToken,
      token: temporaryAccessToken,
      criadoEm: new Date(Date.now()).toISOString(),
      expiraEm: new Date(Date.now() + 5*60000).toISOString()
    };

    sendSecondValidation(phoneNumber)

    dynamoClient.insert(item, 'credentialsTable').then((success) => {
      delete item.partitionKey;
      delete item.sortKey;

      response.json(callback, item, 200);
    }).catch((err) => {
      responseErro.erro(callback, event.path, err.message);
    });

  }).catch((err) => {
    responseErro.erro(callback, event.path, err.message);
  })
};

const sendSecondValidation = async (phoneNumber) => {
  let response = await twilioClient.verify.services.create({friendlyName: 'e-commerce login'})

  if (true) {
    await twilioClient.verify.services(response.sid).verifications.create({to: phoneNumber, channel: 'sms'})
  }
};
