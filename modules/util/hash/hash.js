/* jshint node: true, sub:true*/
/* globals Promise: false */
"use strict";

var bcrypt = require("bcrypt");

/**
 * A simple class to do hash.
 *
 * @category modules/util
 * @class hash
 * @constructor
 */
function hash(){
	/* if validthis is not set to true, JSHint found an error "Possible strict violation." 
	   Ref {@link https://jslinterrors.com/option-validthis-cant-be-used-in-a-global-scope}
	*/
	/* jshint validthis: true */
	this._cost = this._cost();
}

/**
* An object propety to get hash's method name.
* 
* @property {Object}  METHOD - Object contains hash's method name.
*/
hash.prototype.METHOD = {
	HASH			: "hash.hash",
	COMPARE 		: "hash.compare",
	VALIDATE_HASH	: "hash.validateHash"
};

/**
* Calculate bcrypt cost based on Moore's Law, this sync function and must be called in the entry point first. 
* Ref http://security.stackexchange.com/questions/17207/recommended-of-rounds-for-bcrypt
*
* @private
* @return {Int} Return cost
*/
hash.prototype._cost = function bcryptCost(){
	/*eslint no-octal: "error"*/
	var months = (new Date() - new Date("2000 01 01"))/2592000000; // 2592000000 mili second of a month.
	months = months - 60; //  suppose 5 years (60 months) to buy the new computers.
	var rounds = 64 * Math.pow(2, months/18);
	return (Math.floor(Math.log(rounds) / Math.log(2))) - 1; // minus with 1 to speed up process almost double time
};

/**
* Return cost value
*
* @method cost
* @return {Int} Return bcrypt cost
*/
hash.prototype.cost = function cost(){
	return this._cost;
};

/**
* Hash password based on cost. The hashing process is async. 
*
* @method hash
* @param {String} password 			- Password need to be hashed. The length is limited to 72 characters.
* @param {Int} [cost]				- Used the cost instead of calculated cost
* @param {Function} [callback=null]	- Callback function
*
* @return {Object} Returns an object <code> {error:number, data:string, message:string} </code>
* <pre>
*	error:
*		0: Hashed successfully.
*		1: Failed to hash.
* </pre>
*/
hash.prototype.hash = function hash(password, cost, callback){
	var obj_return = {"error":0, "data":null,"message":"Hashed successfully.", "fn":this.METHOD.HASH};
	callback = callback || function () {};
	var _this = this;
	var resolver = function(resolve, reject){
		bcrypt.genSalt(cost ? cost : _this._cost, function(err, salt) {
	    	bcrypt.hash(password, salt, function(err, hash) {
	    		if(err){
	    			obj_return.error = 1;
	    			obj_return.message = "Failed to hash.";
				}
				else obj_return.data = hash;
				callback(obj_return);
				if(obj_return.error) reject(obj_return);
				else resolve(obj_return);
	    	});
		});
	};

	return new Promise(resolver);
};

/**
* Hash password based on cost. The hashing process is sync.
*
* @method hashSync
* @param {String} password	- Password need to be hashed. The length is limited to 72 characters. 
* @param {Int} [cost]		- Used the cost instead of calculated cost
*
* @return {String}	Return a string.
*/
hash.prototype.hashSync = function hashSync(password, cost){
	return bcrypt.hashSync(password, bcrypt.genSaltSync(cost ? cost : this._cost));
};

/**
* Check the hash is whether hashed from the password. The comparision process is async.
* ref: http://stackoverflow.com/questions/26975452/bcrypt-how-to-determine-whether-two-hashes-refer-to-the-same-password
*
* @method compare
* @param {String} pasword 				- Password in plain text.
* @param {String} hash 					- Hash string.
* @param {Function}  [callback=null]	- Callback function. 
*
* @return {Object} Returns an object <code> {error:number, message:string} </code>
* <pre>
*	error:
*		0: Correct password
*		1: Incorrect password.
*		3: Failed to compare password.
* </pre>
*/
hash.prototype.compare = function compare(password, hash, callback){
	var obj_return = {"error":0, "message":"Correct password.", "fn":this.METHOD.COMPARE};
	callback = callback || function () {};
	var _this = this;
	return new Promise(function(resolve, reject){
		bcrypt.compare(password, hash, function(err, res){
    		if(!res){
    			obj_return.error = 1;
    			obj_return.message = err ? err.toString() : "Incorrect password.";
    		}
    		if(callback) callback(obj_return);
			if(obj_return.error) reject(obj_return);
			else resolve(obj_return);
		});	
	});
};

/**
* Check the hash is whether hashed from the password. The comparision process is sync.
* ref: http://stackoverflow.com/questions/26975452/bcrypt-how-to-determine-whether-two-hashes-refer-to-the-same-password
*
* @method compare
* @param {String} password 	- Password in plain text.
* @param {String} hash 		- Hash string
*
* @return {Boolean} Boolean.
*/
hash.prototype.compareSync = function compareSync(password, hash){
	return bcrypt.compareSync(password, hash);
};

/**
* Check input is hashed. Note: checking is based on length and character set only.
* <pre>
* SHA-1, SHA-224, SHA-256, SHA-384, SHA-512, SHA-512/224, SHA-512/256
* 160 bits (40 characters length) in the output of SHA-1
* 224 bits (56 characters length) in the output of SHA-224
* 256 bits (64 characters length) in the output of SHA-256
* 384 bits (96 characters length) in the output of SHA-384
* 512 bits (128 characters length) in the output of SHA-512
* 224 bits (56 characters length) in the output of SHA-512/224
* 256 bits (64 characters length) in the output of SHA-512/256
* /^[a-f0-9]$/i

* bcrypt (60 characters length) $2a$[Cost]$[Base64Salt][Base64Hash]
* /^\$2[ayb]\$[0-9]{2}\$[A-Za-z0-9\.\/]{53}$/i

* PBKDF2 (minimum 40 characters length correspond to derived key length) 
* /^[a-f0-9]{40,}$/i

* scrypt (minimum 40 characters length correspond to derived key length)
* /^[^-A-Za-z0-9+/=]$/i
* </pre>
*
* @method isHash
* @param {String} hash 					- Hashed input.
* @param {Integer} [min=72]				- Minimum hash length.
* @param {Integer} [max=72]				- Maximum hash length.
* @param {Function}  [callback=null]	- Callback function. 
*
* @return {Object} Returns an object <code> {error:number, hash:number, message:string} </code>
* <pre>
*	error:
*		0: Valid hash
*		1: Missing hash parameter.
*		2: Hash must be of length min to max. Or hash cannot be exceeded max characters in length.
*		3: Invalid hash.
*		4: Failed to validate hash.
*	hash:
*		0	: Invalid hash
*		1-10: Correspond to SHA-1, SHA-224, SHA-256, SHA-384, SHA-512, SHA-512/224, SHA-512/256, bcrypt, PBKDF2 and scrypt.
* </pre>
*/
hash.prototype.validateHash = function validateHash(hash, min, max, callback){
	var len = hash ? hash.length : 0,
		idx =0, ret = 0,
		str_sha_regex = 	/^[a-zA-Z0-9\-]+$/,
		str_bcrypt_regex =	/^\$2[ayb]\$[0-9]{2}\$[A-Za-z0-9\.\/]{53}$/,
		str_pbkdf2_regex =	/^[a-fA-F0-9]{40,}$/,
		str_scrypt_regex =	/^[^-a-zA-Z0-9+/=]+$/;
	var obj_return = {"error":0, "hash":0, "message":"Valid hash", "fn":this.METHOD.VALIDATE_HASH};
	
	if(min === undefined || min === null) min = 40;
	if(max === undefined || max === null) max = 128;
	callback = callback || function () {};
	return new Promise(function(resolve, reject){
		try{
			if(hash === undefined || hash === null || hash === ""){
				obj_return.error = 1;
				obj_return.message = "Missing hash parameter.";
			}
			else if(len < min || len > max){
				obj_return.error = 2;
				obj_return.message = (min === max) ? "Hash cannot be exceeded " + max + " characters in length." :
													 "Hash must be of length " + min +  " to " + max + ".";
			}
			if(!obj_return.error){
				if(((idx = [40,56,64,96,128].indexOf(len)) !== -1) && str_sha_regex.test(hash)) ret = ++idx;
				else if((len === 60) && str_bcrypt_regex.test(hash)) ret = 8;
				else if((len >= 40) && str_pbkdf2_regex.test(hash)) ret = 9;
				else if((len >= 40) && str_scrypt_regex.test(hash)) ret = 10;
				if(!ret){
					obj_return.error = 3;
					obj_return.message = "Invalid hash.";
				}
				else obj_return.hash = ret;
			}
		}
		catch(err){
			obj_return.error = 4;
			obj_return.message = err.toString();
		}
		callback(obj_return);
		if(ret) resolve(obj_return);
		else reject(obj_return);
	});
};

module.exports = hash;