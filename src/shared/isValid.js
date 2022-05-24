module.exports.isValid = (item, params) => {
  for (let i in params) {
    if (!item.hasOwnProperty(params[i]) || !(typeof item[params[i]] === 'string')) {
      return false;
    }
  }

  return true;
}
