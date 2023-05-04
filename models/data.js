const hash = require("../modules/util/hash");
const crypto = require("crypto");

const defaultPassword = "P@ssw0rd123";

const data = {
  users: [
    {
      name: "Admin",
      username: "admin",
      password: crypto.createHash("md5").update("admin").digest("hex"),
      last_time_read: "",
    },
    {
      name: "Test User 01",
      username: "user-01@gmail.com",
      password: crypto.createHash("md5").update(defaultPassword).digest("hex"),
      last_time_read: "",
    },
    {
      name: "Test User 02",
      username: "user-02@gmail.com",
      password: crypto.createHash("md5").update(defaultPassword).digest("hex"),
      last_time_read: "",
    },
  ],
};

module.exports = data;
