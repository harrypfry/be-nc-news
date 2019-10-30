exports.customErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send(err);
  } else {
    next(err);
  }
};

exports.psqlErrors = (err, req, res, next) => {
  switch (err.code) {
    case "22P02":
      res.status(400).send({ msg: "Error: Invalid ID" });
      break;

    default:
      next(err);
  }
};

exports.send405 = (req, res, next) => {
  res.status(405).send({ msg: "Error: Method not allowed" });
};
