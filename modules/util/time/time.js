/* jshint node: true, esversion: 6, undef: true, unused: true, expr: true*/
/**
 * A simple class to format datetime.
 *
 * @category modules/util
 * @class datetime
 * @constructor
 */
function datetime(){}

/**
* Get current Unix timestamp. ref: https://coderwall.com/p/rbfl6g/how-to-get-the-correct-unix-timestamp-from-any-date-in-javascript
*
* @method unixTime
* @return {Integer} Return time in integer format
*/
datetime.prototype.unixTime = function unixTime(){
	return Math.round((new Date()).getTime() / 1000);
};

/**
* Get current Unix timestamp in string format.
*
* @method yyyymmddhh
* @return {String} Return time in string format yyyy-mm-dd hh:mm:ss
*/
datetime.prototype.yyyymmddhh = function yyyymmddhh(){
	var now, year, month, day, hour, minute, second;
	
	now = new Date();
	year = "" + now.getFullYear();
	month = "" + (now.getMonth() + 1); if (month.length == 1) { month = "0" + month; }
	day = "" + now.getDate(); if (day.length == 1) { day = "0" + day; }
	hour = "" + now.getHours(); if (hour.length == 1) { hour = "0" + hour; }
	minute = "" + now.getMinutes(); if (minute.length == 1) { minute = "0" + minute; }
	second = "" + now.getSeconds(); if (second.length == 1) { second = "0" + second; }
	return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
};

datetime.prototype.convertMinsToHHMM = function (mins) {
	let h = Math.floor(mins / 60);
	let m = mins % 60;
	h = h < 10 ? '0' + h : h;
	m = m < 10 ? '0' + m : m;
	return `${h}:${m}`;
};

/**
* Sleep in millisecond.
* <pre>
*	The function must be called in async function
*	async function ...(){
*		await this.sleep(10000);
*	}
* </pre>
* @method sleep
* @return {Integer} Millisecond
*/
datetime.prototype.sleep = function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = datetime;