exports.handleUser404 = (req, res, send) => {
  res.send(404).then(body => {
    res.body = "Error - user not found";
  });
};
