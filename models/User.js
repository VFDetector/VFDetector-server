var mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

function User() {}

const userSchema = new mongoose.Schema(
  {
    id: { type: String, default: uuidv4, required: true },
    name: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    last_time_read: { type: String, default: null, required: false },
    disabled: { type: Boolean, default: false, required: false },
    phoneNumber: { type: Array, required: false },
  },
  {
    timestamps: true,
  }
);

/**
 * database object.
 *
 * @property {database}  model - mongoose model.
 */
User.prototype.model = mongoose.model("user", userSchema, "user");

module.exports = new User();
