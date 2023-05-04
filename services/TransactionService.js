var Transaction = require("../models/Transaction");
var token = require("../modules/util/token");
var ContractService = require("./ContractService");
const { log } = require("./ContractService");

/**
 * Message service class.
 * @category models
 * @class Message
 * @constructor
 */
function TransactionService() {}

/**
 * Create transaction. GET /transaction
 * @param {Object} key_value			    - Parameters to create transaction.
 *
 * @return {Promise}	A promise which contains an object <code>{error:number, message:string, data:Object}.</code>
 */

TransactionService.prototype.get = async function get(key_value) {
  let obj_return = {
    error: 0,
    message: "Get transaction successfully",
    data: {},
  };
  try {
    const payload = await token.verify(key_value?.tokenID);
    if (payload?.data?.id != key_value?.userID)
      throw { message: "invalid userid or tokenid" };
    if (key_value?.refID) {
      const transaction = await Transaction.model.aggregate([
        {
          $match: {
            $or: [
              {
                ref_id: { $regex: key_value.refID, $options: "i" },
              },
            ],
          },
        },
        {
          $lookup: {
            from: "contract",
            localField: "ref_id",
            foreignField: "id",
            as: "contract",
          },
        },
        {
          $lookup: {
            from: "client",
            localField: "client_id",
            foreignField: "id",
            as: "client_detail",
          },
        },
        {
          $lookup: {
            from: "user",
            localField: "user_id",
            foreignField: "id",
            as: "user_detail",
          },
        },
      ]);
      obj_return.data = transaction || [];
    }
  } catch (err) {
    obj_return.error = 1;
    obj_return.message = err.message ? err.message : "Get transaction fail";
  } finally {
    if (!obj_return.error) return obj_return;
    else throw obj_return;
  }
};

/**
 * Create transaction. POST /transaction/create
 *
 * @param {Object} key_value			    - Parameters to create transaction.
 * @param {String} key_value.orderID 	    - Transaction's order ID.
 * @param {String} key_value.amount 	    - Transaction's amount.
 * @param {String} key_value.userID 	    - Transaction's owner.
 *
 * @return {Promise}	A promise which contains an object <code>{error:number, message:string, data:Object}.</code>
 */

TransactionService.prototype.create = async function create(key_value) {
  let obj_return = {
    error: 0,
    message: "Created transaction successfully",
    data: {},
  };
  try {
    const payload = await token.verify(key_value?.tokenID);
    if (payload?.data?.id != key_value?.userID)
      throw { message: "invalid userid or tokenid" };
    const transaction = await Transaction.model.create({
      ref_id: key_value?.refID,
      user_id: key_value?.userID,
      client_id: key_value?.clientID,
      amount: key_value?.amount,
      type: key_value?.type,
      payment_method: key_value?.paymentMethod,
      describle: key_value?.describle,
      status: key_value?.status,
      image: key_value?.image,
    });
    if (transaction) {
      ContractService.log(payload?.data, "Create transaction", {
        id: key_value?.refID,
        amount: key_value?.amount,
        type: key_value?.type,
        payment_method: key_value?.paymentMethod,
        describle: key_value?.describle,
      });
    }
    obj_return.data = transaction;
  } catch (err) {
    obj_return.error = 1;
    obj_return.message = err.message ? err.message : "Create transaction fail";
  } finally {
    if (!obj_return.error) return obj_return;
    else throw obj_return;
  }
};

/**
 * Void transaction. VOID /transaction
 *
 * @param {Object} key_value			    - Parameters to void transaction.
 *
 * @return {Promise}	A promise which contains an object <code>{error:number, message:string, data:Object}.</code>
 */

TransactionService.prototype.void = async function _void(key_value) {
  let obj_return = {
    error: 0,
    message: "Void transaction successfully",
    data: {},
  };
  try {
    const payload = await token.verify(key_value?.tokenID);
    if (payload?.data?.id != key_value?.userID)
      throw { message: "invalid userid or tokenid" };
    let transaction = null;
    transaction = await Transaction.model
      .updateOne(
        {
          id: key_value?.transactionID,
        },
        {
          $set: {
            status: 2,
          },
        },
        {
          upsert: false,
        }
      )
      .then(() => {
        // fetch and return the updated document
        return Transaction.model.findOne({ id: key_value?.transactionID });
      });

    if (transaction) {
      log(payload?.data, `Void transaction with id ${transaction?.id}`, {
        id: transaction?.ref_id,
      });
    }
    obj_return.data = transaction;
    // const transaction = await Transaction.model.create({
    //   ref_id: key_value?.refID,
    //   user_id: key_value?.userID,
    //   client_id: key_value?.clientID,
    //   amount: key_value?.amount,
    //   type: key_value?.type,
    //   payment_method: key_value?.paymentMethod,
    //   describle: key_value?.describle,
    //   status: key_value?.status,
    //   image: key_value?.image,
    // });
    // if (transaction) {
    //   ContractService.log(payload?.data, "Create transaction", {
    //     id: key_value?.refID,
    //     amount: key_value?.amount,
    //     type: key_value?.type,
    //     payment_method: key_value?.paymentMethod,
    //     describle: key_value?.describle,
    //   });
    // }
    // obj_return.data = transaction;
  } catch (err) {
    obj_return.error = 1;
    obj_return.message = err.message ? err.message : "Create transaction fail";
  } finally {
    if (!obj_return.error) return obj_return;
    else throw obj_return;
  }
};

module.exports = new TransactionService();
