"use strict";
/*jslint sub: true */
var data = require("../models/data");
var Message = require("../models/Message");
var Client = require("../models/Client");
var token = require("../modules/util/token");
const diacritics = require("diacritics");
const { v4: uuidv4 } = require("uuid");

function removeDiacritics(str) {
  return diacritics.remove(str);
}

/**
 * Message service class.
 * @category models
 * @class Message
 * @constructor
 */
function ClientService() {}

ClientService.prototype.seed = async function seed() {
  let obj_return = {
    error: 0,
    message: "Populated data successfully",
    data: null,
  };

  try {
    await Client.model.deleteMany({});
    obj_return.data = await Client.model.insertMany(data.clients);
  } catch (err) {
    obj_return.data = err.toString();
    obj_return.error = 1;
  } finally {
    if (obj_return.error) throw obj_return;
    else return obj_return;
  }
};

/**
 * Create client. GET /client
 *
 * @param {Object} key_value			    - Parameters to create client.
 *
 * @return {Promise}	A promise which contains an object <code>{error:number, message:string, data:Object}.</code>
 */

ClientService.prototype.get = async function get(key_value) {
  let obj_return = {
    error: 0,
    message: "Get client successfully",
    data: {},
  };
  let clients = [];
  try {
    const payload = await token.verify(key_value?.tokenID);
    if (payload?.data?.id != key_value?.userID)
      throw { message: "invalid userid or tokenid" };
    if (key_value?.clientID) {
      clients = await Client.model.aggregate([
        {
          $match: { id: key_value?.clientID },
        },
        {
          $lookup: {
            from: "client",
            localField: "family_id",
            foreignField: "family_id",
            as: "family",
            pipeline: [
              {
                $lookup: {
                  from: "relation",
                  localField: "relation_id",
                  foreignField: "id",
                  as: "relationDetail",
                },
              },
            ],
          },
        },
      ]);
      obj_return.data = clients;
    } else if (key_value?.keyword) {
      const { name, phoneNumber } = JSON.parse(key_value?.keyword);
      if (!!name || !!phoneNumber) {
        const clientQuery = {
          $or: [
            {
              $and: [
                !!name && {
                  $or: [
                    { name: { $regex: name, $options: "i" } },
                    // { name: { $regex: removeDiacritics(name), $options: "i" } },
                  ],
                },
                !!phoneNumber && { phone_number: { $regex: phoneNumber } },
              ].filter((query) => query !== false),
            },
            !!phoneNumber && { phone_number: phoneNumber },
          ].filter((query) => query !== false),
        };
        clients = await Client.model.aggregate([
          {
            $match: clientQuery,
          },
          {
            $lookup: {
              from: "client",
              localField: "family_id",
              foreignField: "family_id",
              as: "family",
              pipeline: [
                {
                  $lookup: {
                    from: "relation",
                    localField: "relation_id",
                    foreignField: "id",
                    as: "relationDetail",
                  },
                },
              ],
            },
          },
        ]);
      }
      obj_return.data = clients;
    } else {
      const client = await Client.model.find();
      if (client) obj_return.data = client;
      else obj_return.data = [];
    }
  } catch (err) {
    obj_return.error = 1;
    obj_return.message = err.message ? err.message : "Create client fail";
  } finally {
    if (!obj_return.error) return obj_return;
    else throw obj_return;
  }
};

/**
 * Create client. POST /client
 *
 * @param {Object} key_value			    - Parameters to create client.
 *
 * @return {Promise}	A promise which contains an object <code>{error:number, message:string, data:Object}.</code>
 */

ClientService.prototype.create = async function create(key_value) {
  let obj_return = {
    error: 0,
    message: "Created client successfully",
    data: {},
  };
  try {
    const payload = await token.verify(key_value?.tokenID);
    if (payload?.data?.id != key_value?.userID)
      throw { message: "invalid userid or tokenid" };
    const client = await Client.model
      .findOne({ phone_number: key_value.phoneNumber } /*, FILTER_SELECT*/)
      .lean();
    if (client) throw { message: "Phone number created with other client" };
    obj_return.data = await Client.model.create({
      name: key_value.name,
      phone_number: key_value.phoneNumber,
      address: key_value.address,
      family_id: key_value?.familyID || uuidv4(),
      ref_client_id: key_value?.refClientID,
      relation_id: key_value?.relationID,
      IC_number: key_value?.ICNumber,
      social_contact: key_value?.socialContact,
    });
  } catch (err) {
    obj_return.error = 1;
    obj_return.message = err.message ? err.message : "Create client fail";
  } finally {
    if (!obj_return.error) return obj_return;
    else throw obj_return;
  }
};

/**
 * Create client. POST /client
 *
 * @param {Object} key_value			    - Parameters to create client.
 *
 * @return {Promise}	A promise which contains an object <code>{error:number, message:string, data:Object}.</code>
 */

ClientService.prototype.update = async function update(key_value) {
  let obj_return = {
    error: 0,
    message: "Created client successfully",
    data: {},
  };
  try {
    const payload = await token.verify(key_value?.tokenID);
    if (payload?.data?.id != key_value?.userID)
      throw { message: "invalid userid or tokenid" };
    obj_return.data = await Client.model.updateOne(
      {
        id: key_value?.clientID,
      },
      {
        $set: {
          name: key_value?.name,
          disabled: key_value?.disabled,
          phone_number: key_value?.phoneNumber,
          address: key_value?.address,
          ref_client_id: key_value?.refClientID,
          family_id: key_value?.familyID,
          relation_id: key_value?.relationID,
          IC_number: key_value?.ICNumber,
          social_contact: key_value?.socialContact,
        },
      },
      {
        upsert: false,
      }
    );
  } catch (err) {
    obj_return.error = 1;
    obj_return.message = err.message
      ? err.message
      : "Can not update client fail";
  } finally {
    if (!obj_return.error) return obj_return;
    else throw obj_return;
  }
};

module.exports = new ClientService();
