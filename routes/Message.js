/* jshint node: true, esversion: 6, undef: true, unused: true, expr: true*/

"use strict";

var router = require("./router");
var Router = new router();
var MessageController = require("../controllers/MessageController");
const MessageService = require("../services/MessageService");

/**
* @category Messsage
* @method Create message
*
* @api POST /Message/
* @apibody {Object} param					- Message object
* @apibody {String} param.datetime			- Date & Time in string format YYYY-MM-DD hh:mm:ss.
* @apibody {String} param.exercise_routine	- Exercise routine
* @apibody {Number} param.duration			- Exercise duration
* @apibody {String} [param.topic]			- Message's topic
* @apibody {String} [param.user_id]			- Created user id.
*
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
Router.add("post", "/", async (req, res) => {
	let  obj_return;
	try{
		obj_return = await MessageController.create(req.body);
	}
	catch(err){
		obj_return = err;
		res.status(404);
	}
	finally{
		res.send(obj_return);
	}
});

/**
* @category Messsage
* @method List messages
*
* @api GET /Message/
* @apiquery {Object} [req] 					- Query parameters.
* @apiquery {String} [req.exercise_routine]	- Exercise routine filter.
* @apiquery {String} [req.startDate] 		- Start time filter
* @apiquery {String} [req.endDate] 			- End time filter
* @apiquery {String} [req.startOp] 			- Comparision operators
* @apiquery {String} [req.endOp] 			- Comparision operators
*
*
* @apiresponse {Object} Returns object literal <code>{error:number, message: string, data: {Object}, status: HTTP status codes}</code>
* <pre>
*	error:
*		0: List successfully
*		1: Error
*	status:
*		success: 200.
*		error  : 400/404
* </pre>
*/
Router.add("get", "/", async (req, res) => {
	let  obj_return;
	try{
		obj_return = await MessageController.list(req.query);
	}
	catch(err){
		obj_return = err;
		res.status(404);
	}
	finally{
		res.send(obj_return);
	}
});

/**
* @category Messsage
* @method List offline messages for a particular user.
*
* @api GET /Message/offline
* @apiquery {Object} [req] 					- Query parameters.
* @apiquery {String} [req.lastTimeRead]		- lastTimeRead returns from User API.
*
*
* @apiresponse {Object} Returns object literal <code>{error:number, message: string, data: {Object}, status: HTTP status codes}</code>
* <pre>
*	error:
*		0: List offline message successfully
*		1: Error
*	status:
*		success: 200.
*		error  : 400/404
* </pre>
*/
Router.add("get", "/offline", async (req, res) => {
	let  obj_return;
	try{
		obj_return = await MessageController.offline(req.query);
	}
	catch(err){
		obj_return = err;
		res.status(404);
	}
	finally{
		res.send(obj_return);
	}
});

/**
* @category Messsage
* @method Get a particular message
*
* @api GET /Message/:id
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
Router.add("get", "/:id", async function(req, res){
	let  obj_return;
	try{
		obj_return = await MessageController.get(req.params.id);
	}
	catch(err){
		obj_return = err;
		res.status(404);
	}
	finally{
		res.send(obj_return);
	}
});

module.exports = Router.listen();