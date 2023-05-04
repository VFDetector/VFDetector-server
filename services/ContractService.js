var time = require("../modules/util/time");
var Message = require("../models/Message");
var Contract = require("../models/Contract");
var token = require("../modules/util/token");
const Client = require("../models/Client");

/**
 * Message service class.
 * @category models
 * @class Message
 * @constructor
 */
function ContractService() {}

/**
 * Create contract. POST /contract
 *
 * @param {Object} key_value			    - Parameters to create contract.
 *
 * @return {Promise}	A promise which contains an object <code>{error:number, message:string, data:Object}.</code>
 */

ContractService.prototype.log = async function log(user, action, data) {
  try {
    return await Contract.model.updateOne(
      {
        id: data?.id,
      },
      {
        $push: {
          log: {
            user,
            action: action,
            data,
            time: new Date().getTime(),
          },
        },
      },
      {
        upsert: false,
      }
    );
  } catch (error) {
    console.log(error);
  }
};

const log = async (user, action, data) => {
  try {
    await Contract.model.updateOne(
      {
        id: data?.id,
      },
      {
        $push: {
          log: {
            user,
            action: action,
            data,
            time: new Date().getTime(),
          },
        },
      },
      {
        upsert: false,
      }
    );
  } catch (error) {
    console.log(error);
  }
};

/**
 * Create contract. POST /contract
 *
 * @param {Object} key_value			    - Parameters to create contract.
 *
 * @return {Promise}	A promise which contains an object <code>{error:number, message:string, data:Object}.</code>
 */

ContractService.prototype.create = async function create(key_value) {
  let obj_return = {
    error: 0,
    message: "Created contract successfully",
    data: {},
  };
  try {
    const payload = await token.verify(key_value?.tokenID);
    if (payload?.data?.id != key_value?.userID)
      throw { message: "invalid userid or tokenid" };
    let contract = null;
    if (key_value?.type == "rental") {
      contract = await Contract.model.create({
        client: key_value.client,
        user_id: key_value?.userID,
        caution_money: key_value?.cautionMoney,
        total_money: key_value?.totalMoney,
        rental_infor: {
          order: key_value?.product,
          delivery_date: key_value?.deliveryDate,
          return_date: key_value?.returnDate,
        },
        note: key_value?.note,
        staff_signature: key_value?.staffSignature,
        client_signature: key_value?.clientSignature,
        created_date: key_value?.createdDate,
      });
    } else {
      contract = await Contract.model.create({
        client: key_value?.client,
        user_id: key_value?.userID,
        album_shoot_schedule: key_value?.albumShootSchedule,
        location: key_value?.location,
        married_date: key_value?.marriedDate,
        service_pack: key_value?.servicePack,
        total_money: key_value?.totalMoney,
        note: key_value?.note,
        staff_signature: key_value?.staffSignature,
        client_signature: key_value?.clientSignature,
        created_date: key_value?.createdDate,
      });
    }
    if (contract) {
      log(payload?.data, "Initiation", { id: contract?.id });
    }
    obj_return.data = contract;
  } catch (err) {
    obj_return.error = 1;
    obj_return.message = err.message ? err.message : "Create contract fail";
  } finally {
    if (!obj_return.error) return obj_return;
    else throw obj_return;
  }
};

/**
 * Create contract. GET /contract
 *
 * @param {Object} key_value			    - Parameters to create contract.
 *
 * @return {Promise}	A promise which contains an object <code>{error:number, message:string, data:Object}.</code>
 */

ContractService.prototype.get = async function get(key_value) {
  let obj_return = {
    error: 0,
    message: "Get contract successfully",
    data: {},
  };
  let clientIds = [];
  let listContract = [];
  let totalContract = 0;
  try {
    const payload = await token.verify(key_value?.tokenID);
    if (payload?.data?.id != key_value?.userID)
      throw { message: "invalid userid or tokenid" };
    if (!!key_value?.contractID) {
      const contractData = await Contract.model.aggregate([
        {
          $match: { id: key_value?.contractID },
        },
        {
          $lookup: {
            from: "user",
            localField: "user_id",
            foreignField: "id",
            as: "user_detail",
          },
        },
        {
          $lookup: {
            from: "client",
            localField: "client",
            foreignField: "id",
            as: "client_detail",
          },
        },
        {
          $lookup: {
            from: "service_package",
            localField: "service_pack.id",
            foreignField: "id",
            as: "service_package_detail",
            pipeline: [
              {
                $lookup: {
                  from: "service_category",
                  localField: "services",
                  foreignField: "id",
                  as: "category",
                },
              },
            ],
          },
        },
      ]);
      obj_return.data = contractData;
    } else {
      try {
        const { name, phoneNumber } = JSON.parse(key_value?.keyword);
        // pagination parameter
        const offset = parseInt(key_value?.offset);
        const limit = parseInt(key_value?.limit);
        const skip = limit * offset;
        const clientQuery = [
          !!name && { name: { $regex: name, $options: "i" } },
          !!phoneNumber && { phone_number: { $regex: phoneNumber } },
        ].filter((query) => query !== false);
        if (clientQuery.length > 0) {
          const result = await Client.model.find({
            $and: clientQuery,
          });
          clientIds = result.map((e) => e.id);
        }
        if ((!!name || !!phoneNumber) && clientIds.length == 0) {
          totalContract = 0;
        } else {
          // get total number of contract
          totalContract = await Contract.model.countDocuments({
            disabled: false,
            ...(clientIds.length > 0 && { client: { $in: clientIds } }),
          });

          listContract = await Contract.model.aggregate([
            {
              $match: {
                disabled: false,
                ...(clientIds.length > 0 && { client: { $in: clientIds } }),
              },
            },
            { $sort: { created_date: -1 } },
            { $skip: skip },
            { $limit: limit },
            {
              $lookup: {
                from: "client",
                localField: "client",
                foreignField: "id",
                as: "client_detail",
              },
            },
          ]);
        }
        const remain = totalContract - limit * (offset + 1);
        obj_return.data = {
          listData: listContract,
          limit: limit,
          offset: offset,
          amount: listContract?.length || 0,
          total: totalContract,
          remain: remain > 0 ? remain : 0,
        };
      } catch (error) {
        console.log(error);
      }
    }
  } catch (err) {
    obj_return.error = 1;
    obj_return.message = err.message ? err.message : "Get contract fail";
  } finally {
    if (!obj_return.error) return obj_return;
    else throw obj_return;
  }
};

/**
 * Create contract. GET /contract
 *
 * @param {Object} key_value			    - Parameters to create contract.
 *
 * @return {Promise}	A promise which contains an object <code>{error:number, message:string, data:Object}.</code>
 */

ContractService.prototype.getTotal = async function getTotal(key_value) {
  let obj_return = {
    error: 0,
    message: "Get contract successfully",
    data: {},
  };
  try {
    const payload = await token.verify(key_value?.tokenID);
    if (payload?.data?.id != key_value?.userID)
      throw { message: "invalid userid or tokenid" };
    const total = await Contract.model.countDocuments({ disabled: false });

    obj_return.data = {
      total,
    };
  } catch (err) {
    obj_return.error = 1;
    obj_return.message = err.message ? err.message : "Get contract fail";
  } finally {
    if (!obj_return.error) return obj_return;
    else throw obj_return;
  }
};

/**
 * Create contract. GET /contract
 *
 * @param {Object} key_value			    - Parameters to create contract.
 *
 * @return {Promise}	A promise which contains an object <code>{error:number, message:string, data:Object}.</code>
 */

ContractService.prototype.active = async function active(key_value) {
  let obj_return = {
    error: 0,
    message: "Get contract successfully",
    data: {},
  };
  try {
    const payload = await token.verify(key_value?.tokenID);
    if (payload?.data?.id != key_value?.userID)
      throw { message: "invalid userid or tokenid" };
    let contract = null;
    contract = await Contract.model.updateOne(
      {
        id: key_value?.contractID,
      },
      {
        $set: {
          disabled: false,
          client_signature: key_value?.clientSignature,
          staff_signature: key_value?.staffSignature,
        },
      },
      {
        upsert: false,
      }
    );
    if (contract) {
      log(payload?.data, "Active", { id: key_value?.contractID });
    }
    obj_return.data = contract;
  } catch (err) {
    obj_return.error = 1;
    obj_return.message = err.message ? err.message : "Get contract fail";
  } finally {
    if (!obj_return.error) return obj_return;
    else throw obj_return;
  }
};

/**
 * Deactive contract. GET /contract
 *
 * @param {Object} key_value			    - Parameters to create contract.
 *
 * @return {Promise}	A promise which contains an object <code>{error:number, message:string, data:Object}.</code>
 */

ContractService.prototype.deactive = async function deactive(key_value) {
  let obj_return = {
    error: 0,
    message: "Deactive contract successfully",
    data: {},
  };
  try {
    const payload = await token.verify(key_value?.tokenID);
    if (payload?.data?.id != key_value?.userID)
      throw { message: "invalid userid or tokenid" };
    let contract = null;
    contract = await Contract.model.updateOne(
      {
        id: key_value?.contractID,
      },
      {
        $set: {
          disabled: true,
        },
      },
      {
        upsert: false,
      }
    );
    if (contract) {
      log(payload?.data, "Deactive", { id: key_value?.contractID });
    }
    obj_return.data = contract;
  } catch (err) {
    obj_return.error = 1;
    obj_return.message = err.message ? err.message : "Get contract fail";
  } finally {
    if (!obj_return.error) return obj_return;
    else throw obj_return;
  }
};

module.exports = new ContractService();
