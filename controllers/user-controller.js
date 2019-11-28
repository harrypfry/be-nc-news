const {
  selectUserByUserName,
  postUser,
  selectUsers
} = require("../models/user-model");

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

exports.getUsers = (req, res, next) => {
  selectUsers(req.query)
    .then(users => {
      res.status(200).send(users);
    })
    .catch(next);
};
