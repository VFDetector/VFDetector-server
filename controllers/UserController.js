"use strict";
/*jslint sub: true */
var UserService = require("../services/UserService");

/**
 * User controller class.
 * @category controllers/User
 * @class UserController
 * @constructor
 */
function UserController() {}

UserController.prototype.seed = async function seed() {
  let obj_return;
  try {
    obj_return = await UserService.seed();
    obj_return.status = 200;
  } catch (err) {
    obj_return = err;
    obj_return.status = 404;
  } finally {
    if (obj_return.error) throw obj_return;
    else return obj_return;
  }
};

UserController.prototype.auth = async function auth(key_value) {
  let obj_return;
  try {
    obj_return = await UserService.auth(key_value);
    obj_return.status = 200;
  } catch (err) {
    obj_return = err;
    obj_return.status = 404;
  } finally {
    if (!obj_return.error) return obj_return;
    else throw obj_return;
  }
};

UserController.prototype.get = async function get(key_value) {
  let obj_return;
  try {
    obj_return = await UserService.get(key_value);
    obj_return.status = 200;
  } catch (err) {
    obj_return = err;
    obj_return.status = 404;
  } finally {
    if (!obj_return.error) return obj_return;
    else throw obj_return;
  }
};

UserController.prototype.create = async function create(key_value) {
  let obj_return;
  try {
    obj_return = UserService.create(key_value);
    obj_return.status = 200;
  } catch (err) {
    obj_return = err;
    obj_return.status = 404;
  } finally {
    if (!obj_return.error) return obj_return;
    else throw obj_return;
  }
};

UserController.prototype.register = async function register(key_value) {
  let obj_return;
  try {
    obj_return = UserService.register(key_value);
    obj_return.status = 200;
  } catch (err) {
    obj_return = err;
    obj_return.status = 404;
  } finally {
    if (!obj_return.error) return obj_return;
    else throw obj_return;
  }
};

UserController.prototype.deactive = async function deactive(key_value) {
  let obj_return;
  try {
    obj_return = UserService.deactive(key_value);
    obj_return.status = 200;
  } catch (err) {
    obj_return = err;
    obj_return.status = 404;
  } finally {
    if (!obj_return.error) return obj_return;
    else throw obj_return;
  }
};

UserController.prototype.updateLastVisitedTime =
  async function updateLastVisitedTime(user_id, last_time_read) {
    let obj_return;
    try {
      obj_return = await UserService.updateLastVisitedTime(
        user_id,
        last_time_read
      );
      obj_return.status = 200;
    } catch (err) {
      obj_return = err;
      obj_return.status = 404;
    } finally {
      if (obj_return.error) throw obj_return;
      else return obj_return;
    }
  };

module.exports = new UserController();
