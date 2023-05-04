"use strict";
/*jslint sub: true */
var data = require("../models/data");
var time = require("../modules/util/time");
var Message = require("../models/Message");
var ServiceCategory = require("../models/ServiceCategory");
var token = require("../modules/util/token");

/**
 * Message service class.
 * @category models
 * @class Message
 * @constructor
 */
function ServiceCategoryService() {}

/**
 * Create serviceCategoryService. GET /serviceCategoryService/seed
 *
 * @param {Object} key_value			    - Parameters to create serviceCategoryService.
 *
 * @return {Promise}	A promise which contains an object <code>{error:number, message:string, data:Object}.</code>
 */

ServiceCategoryService.prototype.seed = async function seed(key_value) {
  let obj_return = {
    error: 0,
    message: "Populated data successfully",
    data: {},
  };
  try {
    await ServiceCategory.model.deleteMany({});
    obj_return.data = await ServiceCategory.model.insertMany(
      data.serviceCategories
    );
  } catch (err) {
    obj_return.error = 1;
    obj_return.message = err.message ? err.message : "Populated data fail";
  } finally {
    if (!obj_return.error) return obj_return;
    else throw obj_return;
  }
};

/**
 * Get serviceCategoryService. GET /serviceCategoryService
 *
 * @param {Object} key_value			    - Parameters to Get serviceCategoryService.
 *
 * @return {Promise}	A promise which contains an object <code>{error:number, message:string, data:Object}.</code>
 */

ServiceCategoryService.prototype.get = async function get(key_value) {
  let obj_return = {
    error: 0,
    message: "Get ServiceCategory data successfully",
    data: {},
  };
  try {
    const payload = await token.verify(key_value?.tokenID);
    if (payload?.data?.id != key_value?.userID)
      throw { message: "invalid userid or tokenid" };
    else {
      const serviceCategory = await ServiceCategory.model.find({
        disabled: false,
      });
      if (serviceCategory) obj_return.data = serviceCategory;
      else obj_return.data = [];
    }
  } catch (err) {
    obj_return.error = 1;
    obj_return.message = err.message
      ? err.message
      : "Get ServiceCategory data fail";
  } finally {
    if (!obj_return.error) return obj_return;
    else throw obj_return;
  }
};

/**
 * Create serviceCategoryService. POST /serviceCategoryService
 *
 * @param {Object} key_value			    - Parameters to create serviceCategoryService.
 *
 * @return {Promise}	A promise which contains an object <code>{error:number, message:string, data:Object}.</code>
 */

ServiceCategoryService.prototype.create = async function create(key_value) {
  let obj_return = {
    error: 0,
    message: "Created ServiceCategory successfully",
    data: {},
  };
  try {
    const payload = await token.verify(key_value?.tokenID);
    if (payload?.data?.id != key_value?.userID)
      throw { message: "invalid userid or tokenid" };

    obj_return.data = await ServiceCategory.model.create({
      name: key_value.name,
    });
  } catch (err) {
    obj_return.error = 1;
    obj_return.message = err.message
      ? err.message
      : "Created ServiceCategory fail";
  } finally {
    if (!obj_return.error) return obj_return;
    else throw obj_return;
  }
};

/**
 * Disable serviceCategoryService. DELETE /serviceCategoryService
 *
 * @param {Object} key_value			    - Parameters to create serviceCategoryService.
 *
 * @return {Promise}	A promise which contains an object <code>{error:number, message:string, data:Object}.</code>
 */

ServiceCategoryService.prototype.disable = async function disable(key_value) {
  let obj_return = {
    error: 0,
    message: "Disable ServiceCategory successfully",
    data: {},
  };
  try {
    const payload = await token.verify(key_value?.tokenID);
    if (payload?.data?.id != key_value?.userID)
      throw { message: "invalid userid or tokenid" };
    else {
      obj_return.data = await ServiceCategory.model.updateOne(
        {
          _id: key_value?.id,
        },
        {
          $set: { disabled: true },
        },
        {
          upsert: false,
        }
      );
    }
  } catch (err) {
    obj_return.error = 1;
    obj_return.message = err.message
      ? err.message
      : "Disable ServiceCategory fail";
  } finally {
    if (!obj_return.error) return obj_return;
    else throw obj_return;
  }
};

module.exports = new ServiceCategoryService();
