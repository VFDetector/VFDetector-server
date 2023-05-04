/* jshint node: true, esversion: 6, undef: true, unused: true, expr: true*/

"use strict";

var router = require("./router");
var Router = new router();
var UserController = require("../controllers/UserController");

/**
 * @fileOverview User RESTful APIs. Please check {@link User}.
 * @author Huynh Chau Trung <hchautrung@yahoo.com>
 * @version 0.1
 */

/**
 * User's API.
 * @namespace User
 */

/**
 * @category User
 * @method Seed user
 *
 * @api POST /User/seed
 *
 * @apiresponse {Object} Returns object literal <code>{error:number, message: string, data: {Object}, status: HTTP status codes}</code>
 * <pre>
 *	error:
 *		0: Seed successfully
 *		1: Error
 *	status:
 *		success: 200.
 *		error  : 400/404
 * </pre>
 */
Router.add("get", "/seed", async (req, res) => {
  let obj_return;
  try {
    obj_return = await UserController.seed();
  } catch (err) {
    obj_return = err;
    res.status(404);
  } finally {
    res.send(obj_return);
  }
});

/**
 * @category User
 * @method Authenticate user
 *
 * @api POST /User/auth
 * @apiquery {Object} [req] 				- Query parameters.
 * @apiquery {String} [req.username]		- User's user name.
 * @apiquery {String} [req.password] 	- User's password. Password need to be hashed using MD5, SHA-1/256/348/512, RIPMD128/160/256/360, TIGER or JWT. https://crackstation.net/
 *
 * @apiresponse {Object} Returns object literal <code>{error:number, message: string, token: string, status: HTTP status codes}</code>
 * <pre>
 *	error:
 *		0: Authenticated successfully
 *		1: Invalid or missing user_name parameter
 *		2: Missing password paramter
 *		3: Wrong username or password
 *		4: Failed to authenticate
 *		5: Failed to create session.
 *	status:
 *		success: 200.
 *		error  : 400/404
 * </pre>
 */
Router.add("post", "/auth", async (req, res) => {
  let obj_return;
  try {
    obj_return = await UserController.auth(req.body);
  } catch (err) {
    obj_return = err;
    res.status(404);
  } finally {
    res.send(obj_return);
  }
});

/**
 * @category User
 * @method Get user
 *
 * @api POST /User/:id
 * @apiparam {String} id
 *
 * @apiresponse {Object} Returns an object <code> {error:number, message:string, data:{}, status: HTTP status codes} </code>
 * <pre>
 *	error:
 *		0 : Success
 *		1 : Error
 *	status:
 *		success: 200
 *		error  : 400/404
 * </pre>
 */
Router.add("get", "/", async function (req, res) {
  let obj_return;
  try {
    obj_return = await UserController.get(req?.query);
  } catch (err) {
    obj_return = err;
    res.status(404);
  } finally {
    res.send(obj_return);
  }
});

/**
 * @category User
 * @method Register user
 *
 * @api GET /User/:id
 * @apiparam {String} id
 *
 * @apiresponse {Object} Returns an object <code> {error:number, message:string, data:{}, status: HTTP status codes} </code>
 * <pre>
 *	error:
 *		0 : Success
 *		1 : Error
 *	status:
 *		success: 200
 *		error  : 400/404
 * </pre>
 */
Router.add("post", "/register", async (req, res) => {
  let obj_return;
  try {
    obj_return = await UserController.register(req.body);
  } catch (err) {
    obj_return = err;
    res.status(404);
  } finally {
    res.send(obj_return);
  }
});

/**
 * @category User
 * @method Deactive user
 *
 * @api GET /User/:id
 * @apiparam {String} id
 *
 * @apiresponse {Object} Returns an object <code> {error:number, message:string, data:{}, status: HTTP status codes} </code>
 * <pre>
 *	error:
 *		0 : Success
 *		1 : Error
 *	status:
 *		success: 200
 *		error  : 400/404
 * </pre>
 */
Router.add("post", "/deactive", async (req, res) => {
  let obj_return;
  try {
    obj_return = await UserController.deactive(req.body);
  } catch (err) {
    obj_return = err;
    res.status(404);
  } finally {
    res.send(obj_return);
  }
});

module.exports = Router.listen();
