"use strict";
/*jslint sub: true */

var time = require("../modules/util/time");
var Message = require("../models/Message");
var Relation = require("../models/Relation");
var token = require("../modules/util/token");
var data = require("../models/data");

/**
 * Message service class.
 * @category models
 * @class Message
 * @constructor
 */
function RelationService() {}

/**
 * Create inventory. POST /inventory/create
 *
 * @return {Promise}	A promise which contains an object <code>{error:number, message:string, data:Object}.</code>
 */

RelationService.prototype.seed = async function seed(key_value) {
  let obj_return = {
    error: 0,
    message: "Populated data successfully",
    data: null,
  };

  try {
    await Relation.model.deleteMany({});
    obj_return.data = await Relation.model.insertMany(data.relation);
  } catch (err) {
    obj_return.data = err.toString();
    obj_return.error = 1;
  } finally {
    if (obj_return.error) throw obj_return;
    else return obj_return;
  }
};

/**
 * Get relation. GET /client
 *
 * @param {Object} key_value
 *
 * @return {Promise}	A promise which contains an object <code>{error:number, message:string, data:Object}.</code>
 */

RelationService.prototype.get = async function get(key_value) {
  let obj_return = {
    error: 0,
    message: "Get relation successfully",
    data: {},
  };
  try {
    const payload = await token.verify(key_value?.tokenID);
    if (payload?.data?.id != key_value?.userID)
      throw { message: "invalid userid or tokenid" };

    const relation = await Relation.model.find();
    if (relation) obj_return.data = relation;
    else obj_return.data = [];
  } catch (err) {
    obj_return.error = 1;
    obj_return.message = err.message ? err.message : "Get relation fail";
  } finally {
    if (!obj_return.error) return obj_return;
    else throw obj_return;
  }
};

module.exports = new RelationService();
