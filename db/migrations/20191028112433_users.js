exports.up = function(knex) {
  // console.log("creating table 'users'...");
  return knex.schema.createTable("users", usersTable => {
    usersTable
      .string("username")
      .primary()
      .unique();
    usersTable.string("avatar_url").notNullable();
    usersTable.string("name").notNullable();
  });
};

exports.down = function(knex) {
  // console.log("dropping table 'users'...");
  return knex.schema.dropTable("users");
};
