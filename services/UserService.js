"use strict";
/*jslint sub: true */
var data = require("../models/data");
var User = require("../models/User");
var token = require("../modules/util/token");
var hash = require("../modules/util/hash");
var time = require("../modules/util/time");
const { v4: uuidv4 } = require("uuid");

/**
 * User service class.
 * @category services/User
 * @class UserService
 * @constructor
 */
function UserService() {}

UserService.prototype.FILTER_SELECT = {
  __v: 0,
  password: 0,
  createdAt: 0,
  updatedAt: 0,
};

UserService.prototype.seed = async function seed() {
  let obj_return = {
    error: 0,
    message: "Populated data successfully",
    data: null,
  };

  try {
    await User.model.deleteMany({});
    obj_return.data = await User.model.insertMany(data.users);
  } catch (err) {
    obj_return.data = err.toString();
    obj_return.error = 1;
  } finally {
    if (obj_return.error) throw obj_return;
    else return obj_return;
  }
};

/**
 * Authenticate user. GET /User/auth
 *
 * @param {Object} key_value				- Parameters to authenticate user.
 * @param {String} key_value.user_name 	- User's user name.
 * @param {String} key_value.password 	- User's password. Password need to be hashed using MD5, SHA-1/256/348/512, RIPMD128/160/256/360, TIGER or JWT. https://crackstation.net/
 *
 * @return {Promise}	A promise which contains an object <code>{error:number, message:string, data:Object}.</code>
 */
UserService.prototype.auth = async function auth(key_value) {
  let obj_return = {
    error: 0,
    message: "Authenticated successfully",
    data: {},
  };
  try {
    const user = await User.model
      .findOne({ username: key_value.username } /*, FILTER_SELECT*/)
      .lean();
    if (!user) throw { message: "Invalid username or password" };
    if (key_value.password != user.password)
      throw { message: "Incorrect password." };
    obj_return.data = {
      id: user.id,
      name: user.name,
      username: user.username,
      token: token.create(user),
    };
  } catch (err) {
    obj_return.error = 1;
    obj_return.message = err.message
      ? err.message
      : "Invalid username or password";
  } finally {
    if (!obj_return.error) return obj_return;
    else throw obj_return;
  }
};

UserService.prototype.get = async function get(key_value) {
  let obj_return = { error: 0, message: "Get user successfully", data: {} };
  try {
    const payload = await token.verify(key_value?.tokenID);
    if (payload?.data?.id != key_value?.userID)
      throw { message: "invalid userid or tokenid" };
    obj_return.data = await User.model.aggregate([
      {
        $match: { id: key_value?.userID },
      },
    ]);
    if (!obj_return.data) throw { message: "User not found." };
  } catch (err) {
    obj_return.error = 1;
    obj_return.message = err.message
      ? err.message
      : "Invalid username or password";
  } finally {
    if (!obj_return.error) return obj_return;
    else throw obj_return;
  }
};

UserService.prototype.create = async function create(key_value) {
  let obj_return = { error: 0, message: "Created successfully", data: {} };
  try {
    const model = new User.model({
      name: key_value.name,
      username: user.username,
      password: hash.hashSync(key_value.password, 8),
    });
    const user = await model.save();
    const _id = user.id,
      name = user.name,
      username = user.username;
    obj_return.data = {
      _id,
      name,
      username,
      token: token.create({ _id, name, username }),
    };
  } catch (err) {
    obj_return.error = 1;
    obj_return.message = err.message
      ? err.message
      : "Invalid email or password";
  } finally {
    if (!obj_return.error) return obj_return;
    else throw obj_return;
  }
};

UserService.prototype.register = async function register(key_value) {
  let obj_return = {
    error: 0,
    message: "Register successfully",
    data: {},
  };
  try {
    const user = await User.model
      .findOne({ username: key_value.username } /*, FILTER_SELECT*/)
      .lean();
    if (user) throw { message: "Username existed" };
    obj_return.data = await User.model.create({
      name: key_value.name,
      username: key_value.username,
      password: key_value.password,
      last_time_read: "",
    });
  } catch (err) {
    obj_return.error = 1;
    obj_return.message = err.message ? err.message : "Can not register user";
  } finally {
    if (!obj_return.error) return obj_return;
    else throw obj_return;
  }
};

UserService.prototype.deactive = async function deactive(key_value) {
  let obj_return = {
    error: 0,
    message: "Deactive successfully",
    data: {},
  };
  try {
    const payload = await token.verify(key_value?.tokenID);
    if (payload?.data?.id != key_value?.id)
      throw { message: "invalid userid or tokenid" };
    else {
      obj_return.data = await User.model.updateOne(
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
    obj_return.message = err.message ? err.message : "Can not register user";
  } finally {
    if (!obj_return.error) return obj_return;
    else throw obj_return;
  }
};

UserService.prototype.updateLastVisitedTime =
  async function updateLastVisitedTime(user_id, last_time_read) {
    let obj_return = {
      error: 0,
      message: "Updated last visited time successfully",
      data: null,
    };

    try {
      const user = await User.model.findOne({ _id: user_id });
      const client_last_time_read =
        last_time_read !== "" ? last_time_read : time.yyyymmddhh();
      /*
		user.last_time_read = client_last_time_read > user.last_time_read ? client_last_time_read : user.last_time_read;
		*/
      user.last_time_read = client_last_time_read;
      await user.save();
      obj_return.data = user;
    } catch (err) {
      obj_return.error = 1;
      obj_return.message = err.message
        ? err.message
        : "Cannot updated last visited time";
    } finally {
      if (obj_return.error) throw obj_return;
      else return obj_return;
    }
  };

module.exports = new UserService();
