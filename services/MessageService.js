var time  = require("../modules/util/time");
var Message = require("../models/Message");

/**
* Message service class.
* @category models
* @class Message
* @constructor 
*/
function MessageService(){}

/**
* Create message
*
* @param {Object} key_value				        - Parameters to create message.
* @param {String} key_value.datetime
* @param {String} key_value.exercise_routine
* @param {Number} key_value.duration
* @param {String} key_value.user_id
*
* @return {Promise}	A promise which contains an object <code>{error:number, message:string, data:Object}.</code>
*/
MessageService.prototype.create = async function create (key_value) {
    let obj_return = {"error":0, "message":"Created successfully", "data":{}};
    try{
        const created_datetime = time.yyyymmddhh();
        const model = new Message.model({
            datetime: key_value.datetime,
            exercise_routine: key_value.exercise_routine,
            duration: key_value.duration,
            user_id: key_value.user_id,
            topic: key_value.topic,
            created_datetime: created_datetime
        });
        obj_return.data = await model.save();
        obj_return.data.created_datetime = created_datetime;
    }
    catch(err){
        obj_return.error = 1;
        obj_return.message = err.message ? err.message : "Failed to create the order";
    }
    finally{
		if(!obj_return.error) return obj_return;
		else throw obj_return;
	}
};

MessageService.prototype.list = async function list (key_value) {
    let obj_return = {"error":0, "message":"List message successfully", "data":{}};
    try{
        const cond = {};
		/* query date & time range */
		const startOp = key_value.startOp ||  "$gte";
		const endOp = key_value.endOp ||  "$lte";
		if(key_value.exercise) cond.exercise_routine = key_value.exercise;
		if(key_value.startDate && key_value.endDate) cond.datetime = {$gte: key_value.startDate, $lte: key_value.endDate};
		else if(key_value.startDate) cond.datetime = {[startOp]: key_value.startDate};
		else if(key_value.endDate) cond.datetime = {[endOp]: key_value.endDate};
       
		/* query user id */
		if(key_value.userId) cond.user_id = {$eq: key_value.userId};
		obj_return.data = await Message.model.find(cond, {}).sort({datetime: -1});
	}
	catch(err){
		obj_return.error = 1;
        obj_return.message = err.message ? err.message : "Failed to create the order";
    }
    finally{
		if(!obj_return.error) return obj_return;
		else throw obj_return;
	}
};

MessageService.prototype.offline = async function offline (key_value) {
    let obj_return = {"error":0, "message":"List offline message successfully", "data":{}};
    try{
		obj_return.data = await Message.model.find({created_datetime: {$gt: key_value.lastTimeRead}}, {}).sort({datetime: -1});
	}
	catch(err){
		obj_return.error = 1;
        obj_return.message = err.message ? err.message : "Failed to create the order";
    }
    finally{
		if(!obj_return.error)return obj_return;
		else throw obj_return;
	}
};

MessageService.prototype.get = async function get (id) {
    let  obj_return = {"error":0, "message":null, "data":null};
	try{
		obj_return.data = await Message.model.findById(id);
		if(!obj_return.data) throw {message: "Message not found."};
	}
	catch(err){
		obj_return.error = 1;
        obj_return.message = err.message ? err.message : "Failed to create the order";
    }
    finally{
		if(!obj_return.error) return obj_return;
		else throw obj_return;
	}
};


module.exports = new MessageService();