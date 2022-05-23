'use strict';

const error = require('./error')

module.exports.notFound = (event, context, callback) => {
  return error.erro(callback, event.path, "Recurso não encontrado", 404);
};
