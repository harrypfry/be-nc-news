const { selectUserByUserName } = require("../models/user-model");

exports.getUserByUsername = (req, res, next) => {
  selectUserByUserName(req)
    .then(user => {
      //console.log(res);
      if (!user) {
        return Promise.reject({ code: 404, msg: "Error: User not found" });
      } else {
        res.status(200).send(user);
      }
    })
    .catch(err => {
      console.log(err.msg);
      res.status(err.code).send(err.msg);
    });
};
