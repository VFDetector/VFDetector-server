"use strict";
/*jslint sub: true */
var data = require("../models/data");
var time = require("../modules/util/time");
var Message = require("../models/Message");
var ServicePackage = require("../models/ServicePackage");
var token = require("../modules/util/token");

/**
 * Message service class.
 * @category models
 * @class Message
 * @constructor
 */
function ServicePackageService() {}

/**
 * Create servicePackage. GET /servicePackage
 *
 * @param {Object} key_value			    - Parameters to create servicePackage.
 *
 * @return {Promise}	A promise which contains an object <code>{error:number, message:string, data:Object}.</code>
 */

ServicePackageService.prototype.get = async function get(key_value) {
  let obj_return = {
    error: 0,
    message: "Get service Package data successfully",
    data: {},
  };
  try {
    const payload = await token.verify(key_value?.tokenID);
    if (payload?.data?.id != key_value?.userID)
      throw { message: "invalid userid or tokenid" };
    else {
      const servicePackage = await ServicePackage.model.aggregate([
        { $match: { disabled: false } },
        {
          $lookup: {
            from: "service_category",
            localField: "services",
            foreignField: "id",
            as: "service_list",
          },
        },
      ]);
      if (servicePackage) obj_return.data = servicePackage;
      else obj_return.data = [];
    }
  } catch (err) {
    obj_return.error = 1;
    obj_return.message = err.message || "Get service Package data fail";
  } finally {
    if (!obj_return.error) return obj_return;
    else throw obj_return;
  }
};

/**
 * Create servicePackage. POST /servicePackage
 *
 * @param {Object} key_value			    - Parameters to create servicePackage.
 *
 * @return {Promise}	A promise which contains an object <code>{error:number, message:string, data:Object}.</code>
 */

ServicePackageService.prototype.create = async function create(key_value) {
  let obj_return = {
    error: 0,
    message: "Created service Package successfully",
    data: {},
  };
  try {
    const payload = await token.verify(key_value?.tokenID);
    if (payload?.data?.id != key_value?.userID)
      throw { message: "invalid userid or tokenid" };

    obj_return.data = await ServicePackage.model.create({
      name: key_value?.name,
      services: key_value?.services,
      icon: key_value?.icon,
    });
  } catch (err) {
    obj_return.error = 1;
    obj_return.message = err.message || "Created service Package fail";
  } finally {
    if (!obj_return.error) return obj_return;
    else throw obj_return;
  }
};

/**
 * Disable servicePackage. DELETE /servicePackage
 *
 * @param {Object} key_value			    - Parameters to create servicePackage.
 *
 * @return {Promise}	A promise which contains an object <code>{error:number, message:string, data:Object}.</code>
 */

ServicePackageService.prototype.disable = async function disable(key_value) {
  let obj_return = {
    error: 0,
    message: "Disable service Package successfully",
    data: {},
  };
  try {
    const payload = await token.verify(key_value?.tokenID);
    if (payload?.data?.id != key_value?.userID)
      throw { message: "invalid userid or tokenid" };
    else {
      obj_return.data = await ServicePackage.model.updateOne(
        {
          id: key_value?.id,
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
      : "Disable service Package fail";
  } finally {
    if (!obj_return.error) return obj_return;
    else throw obj_return;
  }
};

/**
 * Update servicePackage. PUT /servicePackage
 *
 * @param {Object} key_value			    - Parameters to create servicePackage.
 *
 * @return {Promise}	A promise which contains an object <code>{error:number, message:string, data:Object}.</code>
 */

ServicePackageService.prototype.update = async function update(key_value) {
  let obj_return = {
    error: 0,
    message: "Update service Package successfully",
    data: {},
  };
  try {
    const payload = await token.verify(key_value?.tokenID);
    if (payload?.data?.id != key_value?.userID)
      throw { message: "invalid userid or tokenid" };
    else {
      obj_return.data = await ServicePackage.model.updateOne(
        {
          id: key_value?.id,
        },
        {
          $set: {
            name: key_value?.name,
            services: key_value?.services,
            icon: key_value?.icon,
          },
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
      : "Update service Package fail";
  } finally {
    if (!obj_return.error) return obj_return;
    else throw obj_return;
  }
};

module.exports = new ServicePackageService();
