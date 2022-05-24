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
  'token',
  'codigo'
]

module.exports.secondLoginStep = (event, context, callback) => {
  body = JSON.parse(event.body);

  if(!check.isValid(body, PARAMS_TO_CHECK)) {
    responseErro.erro(callback, event.path, "Request inválido!", 400);
  }

  params = {
    TableName: 'credentialsTable',
    KeyConditionExpression: 'partitionKey = :pkey and sortKey = :svalue',
    ExpressionAttributeValues: {
      ':pkey': 'TEMPORARY_TOKEN',
      ':svalue': body.token,
    }
  };

  dynamoClient.query(params).then((success) => {

    if (success.Items.length === 0) {
      responseErro.erro(callback, event.path, "Token inválido", 401);
    }

    jwt.verify(success.Items[0].token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {

      if (!user) {
        responseErro.erro(callback, event.path, "Token já expirado", 401);
      }

      checkCode(user.telefone, body.codigo)

      delete user.iat;
      delete user.exp;

      let accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30m' });

      let item = {
        partitionKey: 'TOKEN',
        sortKey: accessToken,
        token: accessToken,
        criadoEm: new Date(Date.now()).toISOString(),
        expiraEm: new Date(Date.now() + 5*60000).toISOString()
      };

      dynamoClient.insert(item, 'credentialsTable').then((success) => {
        delete item.partitionKey;
        delete item.sortKey;

        response.json(callback, item, 200);
      }).catch((err) => {
        responseErro.erro(callback, event.path, err.message);
      });
    });

  }).catch((err) => {
    responseErro.erro(callback, event.path, err.message);
  })
};

const checkCode = async (phoneNumber, code) => {
  return;

  let response = await twilioClient.verify.services.create({friendlyName: 'e-commerce login'})

  if (response.sid) {
    await twilioClient
    .verify.services(response.sid)
    .verificationChecks
    .create({to: phoneNumber, code: code})
  }
};
