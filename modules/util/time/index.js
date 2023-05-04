/* expose time interface. Use singleton for this module */
var time = require('./time');
module.exports = new time();