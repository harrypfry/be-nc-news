const { selectUserByUserName, postUser } = require("../models/user-model");

exports.getUserByUsername = (req, res, next) => {
  selectUserByUserName(req)
    .then(user => {
      res.status(200).send({ user });
    })
    .catch(next);
};

exports.postUser = (req, res, next) => {
  postUser(req.body)
    .then(([user]) => {
      res.status(201).send({ user });
    })
    .catch(next);
};
