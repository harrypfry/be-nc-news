const availableEndpoints = require("../endpoints.json");

exports.getAvailableEndpoints = (req, res, next) => {
  res.status(200).json(availableEndpoints);
};
