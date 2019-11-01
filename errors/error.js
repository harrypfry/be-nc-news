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
      res.status(400).send({ msg: createErrorMessage(err) });
      break;
    case "23502":
      res.status(400).send({ msg: createErrorMessage(err) });
      break;
    case "23503":
      res.status(404).send({ msg: createErrorMessage(err) });
      break;
    case "42703":
      res.status(400).send({ msg: createErrorMessage(err) });
      break;
    default:
      next(err);
  }
};

exports.send405 = (req, res, next) => {
  res.status(405).send({ msg: "Error: Method not allowed" });
};

const createErrorMessage = err => {
  return err.message.split(" - ")[1];
};
