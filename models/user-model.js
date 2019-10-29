const connection = require("../db/connection");

exports.selectUserByUserName = ({ params }) => {
  return connection
    .first("*")
    .from("users")
    .where(params);
};
