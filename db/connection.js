const knex = require("knex");
const dbConfig = require("../knexfile");

connection = knex(dbConfig);

module.exports = connection;
