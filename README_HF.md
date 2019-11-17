NC News

This repository is a backend API for a news app. It utilises a PostgreSQL server to allow the user to read, write and delete comments and articles, as well as up-vote or downvote them.

PREREQUISITES

A computer running either Mac OS or Linux with Node.JS installed

INSTALLATION

initialise npm
npm init -y

install developer dependancies for testing
npm install mocha chai chai-sorted supertest -D

install general dependancies
npm install express knex pg

add the following scripts to package.json
"resetAndSeed": "npm run setup-dbs && npm run seed",
"setup-dbs": "psql -f ./db/setup.sql",
"seed": "knex seed:run",
"test-app": "mocha spec/app.spec.js",
"test-utils": "mocha spec/utils.spec.js",

SETTING UP A CONFIG.JS FILE

A config.js file needs to be cre

RUNNING THE TESTS

The tests that have been written test each endpoint thoroughly using TDD, testing all the written endpoints and handling all methods.

The available endpoints and methods are...
GET /api/topics

GET /api/users/:username

GET /api/articles:article_id
PATCH /api/articles/:article_id

POST /api/articles/:article_id/comments
GET /api/articles/articles_id/comments

GET /articles

PATCH /api/articles/:comment_id
DELETE /api/comments/:comment_id

GET /api

URLs and methods not mentioned above will be handled with 404 and 405 status codes respectively

To run the tests use command
npm run test-app

DEPLOYMENT

run command
npm run seed:prod

This pushes the development database onto the Heroku server
