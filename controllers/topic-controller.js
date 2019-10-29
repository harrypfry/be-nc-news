const { selectAllTopics } = require("../models/topic-model");

exports.getAllTopics = (req, res, next) => {
  selectAllTopics().then(topics => res.status(200).send(topics));
};

// module.exports = { getAllTopics };
