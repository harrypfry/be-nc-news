const { selectAllTopics, insertTopic } = require("../models/topic-model");

exports.getAllTopics = (req, res, next) => {
  selectAllTopics().then(topics => res.status(200).send({ topics }));
};

exports.postTopic = (req, res, next) => {
  insertTopic(req)
    .then(([topic]) => {
      res.status(201).send({ topic });
    })
    .catch(next);
};
