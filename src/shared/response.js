'use strict';

module.exports.json = (callback, body = {}, status = 200) => {
  return callback(null, {
    statusCode: status,
    headers: {
      "Access-Control-Allow-Origin" : "*",
      'Access-Control-Allow-Credentials': true
    },
    body: (body != null) ? JSON.stringify(body) : ""
  });
};
