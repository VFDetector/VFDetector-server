"use strict";
/*jslint sub: true */
var MessageService = require("../services/MessageService");


/**
* User controller class.
* @category controllers/Message
* @class MessageController
* @constructor 
*/
function MessageController(){}

MessageController.prototype.create = async function create(key_value){
	let obj_return;
    try{
		obj_return = await MessageService.create(key_value);
		obj_return.status = 200;
    }
    catch(err){
		obj_return = err;
		obj_return.status = 404;
    }
    finally{
		if(obj_return.error) throw obj_return;
		else return obj_return;
    }
}

MessageController.prototype.list = async function list(key_value){
	let obj_return;
    try{
		obj_return = await MessageService.list(key_value);
		obj_return.status = 200;
    }
    catch(err){
		obj_return = err;
		obj_return.status = 404;
    }
    finally{
		if(obj_return.error) throw obj_return;
		else return obj_return;
    }
}

MessageController.prototype.offline = async function offline (key_value) {
    let obj_return;
    try{
		obj_return = await MessageService.offline(key_value);
	}
	catch(err){
		obj_return = err;
		obj_return.status = 404;
    }
    finally{
		if(obj_return.error) throw obj_return;
		else return obj_return;
    }
};

MessageController.prototype.get = async function get (id) {
    let obj_return;
    try{
		obj_return = await MessageService.get(id);
	}
	catch(err){
		obj_return = err;
		obj_return.status = 404;
    }
    finally{
		if(obj_return.error) throw obj_return;
		else return obj_return;
    }
};

module.exports = new MessageController();
