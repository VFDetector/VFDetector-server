/* expose hash interface. Use singleton for this module */
var hash = require('./hash');
module.exports = new hash();