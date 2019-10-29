exports.up = function(knex) {
  return knex.schema.createTable("topics", topicsTable => {
    // console.log("creating table 'topics'...");
    topicsTable
      .string("slug")
      .primary()
      .notNullable();
    topicsTable.string("description").notNullable();
  });
};

exports.down = function(knex) {
  // console.log("dropping table 'topics'...");
  return knex.schema.dropTable("topics");
};
