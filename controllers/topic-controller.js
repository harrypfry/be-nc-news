const { selectAllTopics } = require("../models/topic-model");

const getAllTopics = (req, res, next) => {
  selectAllTopics().then(a => res.send(a));
};

module.exports = { getAllTopics };
