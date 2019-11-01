const { selectUserByUserName } = require("../models/user-model");

exports.getUserByUsername = (req, res, next) => {
  selectUserByUserName(req)
    .then(user => {
      res.status(200).send({ user });
    })
    .catch(next);
};
