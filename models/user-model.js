const connection = require("../db/connection");

exports.selectUserByUserName = ({ params }) => {
  return connection
    .first("*")
    .from("users")
    .where(params)
    .then(user => {
      if (!user) {
        return Promise.reject({ status: 404, msg: "Error: User not found" });
      } else {
        return user;
      }
    });
};