// exports.handleUser404 = (req, res, send) => {
//   res.send(404).then(body => {
//     res.body = "Error - user not found";
//   });
// };

exports.customErrors = (err, req, res, next) => {
  // console.log("Harry", err);
  if (err) {
    res.status(err.status).send(err);
  } else {
    next(err);
  }
};

exports.psqlErrors = (err, req, res, next) => {
  console.log("In psql errors");
};

exports.send405 = (req, res, next) => {
  res.status(405).send({ msg: "Error: method not allowed" });
};
