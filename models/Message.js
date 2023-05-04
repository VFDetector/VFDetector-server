var mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const messageSchema = new mongoose.Schema(
  {
    id: { type: String, default: uuidv4, required: true },
    datetime: { type: String, required: true },
    exercise_routine: { type: String, required: true },
    duration: { type: Number, required: true },
    user_id: { type: String, required: true },
    topic: { type: String, required: true },
    created_datetime: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

/**
 * Message model class.
 * @category models
 * @class Message
 * @constructor
 */
function Message() {}

/**
 * database object.
 *
 * @property {database}  model - mongoose model.
 */
Message.prototype.model = mongoose.model("message", messageSchema, "message");

module.exports = new Message();
