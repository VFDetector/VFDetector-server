var jwt = require("jsonwebtoken");
var uuid = require("uuid");
var fs = require("fs");
var private_key = fs.readFileSync(__dirname + "/private.key", "utf8");
var public_key = fs.readFileSync(__dirname + "/public.pem", "utf8");

/**a
 * A simple class wrap jwt. Need to create private and public key first using openssl
 *	openssl genrsa -out private.pem 2048
 *	openssl rsa -in private.pem -out public.pem -outform PEM -pubout
 *
 * @category modules/util/token
 * @class token
 * @constructora
 */
function token() {}

/**
 * Create token.
 *
 * @method create
 * @param {Object} key_value 			- key value
 * @param {String} key_value.user_id		- Unique user id
 * @param {String} key_value.user_name	- Unique user name
 * @param {String} [key_value.iss]		- Issuer
 * @param {String} [key_value.resources]	- Extra resources.
 * @param {Integer}[key_value.idx]		- Index number, auto increment in most cases.
 * @return {String}
 */
token.prototype.create = function create(
  key_value,
  userid,
  user_name,
  resources,
  idx
) {
  key_value.iss = key_value.iss || "Microbox";
  key_value.jti = key_value.jti || uuid.v4();
  key_value.resources = key_value.resources || "";
  key_value.idx = key_value.idx || "";
  /*
	return jwt.sign({iss:'Microbox', jti:uuid.v4(), user_id:user_id, user_name:user_name, resources:resources, idx:idx}, private_key, {algorithm: 'RS256'});
	*/
  const token = jwt.sign(key_value, private_key, { algorithm: "RS256" });
  console.log(token);
  return token;
};

/**
 * Decode token. Only use this method if we know the token is trusted.
 *
 * @method create
 * @param {String} token
 * @param {Object} options Option
 * @return {String}
 */
token.prototype.decode = function decode(token, options) {
  return jwt.decode(token, options);
};

/**
 * Verify the signature is valid and also return payload. Should not use decode to avoid untrusted token.
 *
 * @param {String} token			- Token input string.
 * @param {Integer} system		- 0: verify internal public key, 1 verify with Azure ADD public key.
 * @param {Function} [callback]	- Callback function.
 *
 * @return {Promise} A promise which contains an object <code>{error:number, message:string, data: object}</code>
 * <pre>
 *	error:
 *		0: Verified successfully.
 *		1: Failed to verify.
 * </pre>
 */
token.prototype.verify = function verify(token, key, callback) {
  var pub_key,
    obj_return = { error: 0, message: "Verified successfully.", data: null };

  if (key == undefined) pub_key = public_key;
  else
    pub_key = `-----BEGIN CERTIFICATE-----\n${key}\n-----END CERTIFICATE-----`;

  var resolver = (resolve, reject) => {
    jwt.verify(token, pub_key, (err, decoded) => {
      if (err) {
        obj_return.error = 1;
        obj_return.message = err.toString();
      } else obj_return.data = decoded;
      if (callback) callback(obj_return);
      if (obj_return.error) reject(obj_return);
      else resolve(obj_return);
    });
  };

  return new Promise(resolver);
};

module.exports = token;
