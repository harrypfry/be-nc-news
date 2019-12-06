#Northcoders News - Back End

Northcoders News is a web-based application designed to act as a social news hub, largely based on *Reddit*.

Articles are assigned both a topic and author. With the user signed in, the user may vote on articles and post, delete their own and vote on comments. On the right hand side of the home page (if the screen used is >1250px wide), the side padel shows a list of trending topics and the top three users based on an aggregate of their comment and article score.

Node.js, Express and PostgreSQL were used to build the application which will store article, comment and user data. The back end of this NC News application forms a RESTful API, which is utilised in the front end.

#### Deployed Versions 

- [Back End](https://nc-news-hf.herokuapp.com/api/users/)
- [Front End](https://nc-news-hf.netlify.com/)

## Getting Started

### Prerequisites

This application uses npm v13.6.1, Node v12.6.0 and PostgreSQL v11.4. To verify you have the minimum versions of each installed, run the following commands on terminal

```node
npm -v
node -v
psql -V
```

If either command does not return a file path or does not meet the minimum requirement, follow the appropriate instructions below:

- [node (and npm)](https://docs.npmjs.com/getting-started/installing-node)
- [PostgreSQL](https://www.postgresql.org/)

### Installing

Clone the project

```terminal
git clone https://github.com/harrypfry/nc_news
```

Install dependencies

```terminal
npm install
```

Set up databases

```terminal
npm run set-up 
```

Seed databases

```terminal
npm run seed
```

Start the app locally

```terminal
npm run start
```

The app will now be running on http://localhost:9090.

## Using the API

```http
GET /api
```

Describes all available endpoints.

### Responds with

- JSON describing all available endpoints

***

```http
GET /api/topics
```

Serves an array of all topics.

### Responds with

An array of objects, each of which has the keys:

+ `slug`
+ `description`
+ `article_count`

***

```http
POST /api/topics
```

Posts a new topic.

### Request body accepts

An object with the following properties

- `slug`
- `description`

### Responds with

 An object of the posted topic, with keys:

- `slug`
- `description`

***

```http
GET /api/users/:username
```

Serves an object of specified username.

### Responds with

An array of objects, each of which has the keys:

- `username`
- `avatar_url`
- `name`

***

```http
GET /api/articles/:article_id
```

Serves an object of specified article.

### Responds with

An array of objects, each of which has the keys:

- `title`
- `topic`
- `author`
- `body`
- `created_at`
- `votes`
- `comment_count`

***

```http
PATCH /api/articles/:article_id
```

Patches an article with the updated amount of votes.

### Request body accepts

- An object in the following form:
  - `{inc_votes:increase}` where `increase` is the increase in the number of votes

### Responds with

An object of the updated article, with keys:

- `title`
- `topic`
- `author`
- `body`
- `create_at`
- `votes`

***

```http
DELETE /api/articles/:article_id
```

Deletes an article by article id

### Responds with

An empty object

***

```http
POST /api/articles/:article_id/comments
```

Posts a new comment to an article.

### Request body accepts

An object with the following keys

- `username`
- `body`

### Responds with

An object of the posted comment, with keys

- `comment_id`
- `author`
- `article_id`
- `votes`
- `created_at`
- `body`

***

```http
GET /api/articles/:article_id/comments
```

Serves an object of specified article

### Queries

- `sort_by`
- `order`

### Responds with

An array of objects, each of which has the keys

- `comment_id`
- `author`
- `article_id`
- `votes`
- `created_at`
- `body`

***

```http
GET /api/articles
```

Serves an array of all articles

### Accepts Queries

- `author` => filters the articles by specified user
- `topic` => filters the articles by specified filter
- `sort_by` => sorts the articles by any valid column (defaults to `created_at`)
- `order` => the order to be sorted by. Can be set to `asc` or `desc` for ascending or descending (default). 

### Responds with

An array of objects, each of which has the keys

- `title`
- `topic`
- `author`
- `body`
- `create_at`

***

```http
POST /api/articles
```

Posts a new article.

### Request body accepts

An object with the following keys:

- `title`
- `topic`
- `author`
- `body`

### Responds with

An object of the posted article with keys:

- `title`
- `topic`
- `author`
- `body`
- `votes`
- `created_at`

***

```http
PATCH /api/comments/:comment_id
```

Patches a comment with the updated amount of comments.

### Request body accepts

An object in the following form:

- `{inc_votes:increase}` where `increase` is the increase in the number of votes

### Responds with

An object of the updated comment with keys:

- `comment_id`
- `author`
- `article_id`
- `votes`
- `created_at`
- `body`

***

```http
DELETE /api/comments/:comment_id
```

Deletes a comment by comment_id

### Responds with

An empty object.

***

```http
GET /api/users
```

Serves an array of all users

### Responds with

An array of objects, each of which has the keys

- `username`
- `username_url`
- `name`
- `comment_score`
- `article_score`
- `total_score`

***

```http
POST /api/users
```

Adds a new user

### Request body accept

An object with the following keys:

- `username`
- `name`
- `avatar_url`

### Responds with

An object of the posted user, with keys:

- `username`
- `name`
- `avatar_url`
- `comment_score`
- `article_score`
- `total_score`

***

## Running Tests

In order to run the predefined tests for the endpoints, the 'test-api' script will need to be run

```terminal
npm run test-api
```

## Build With

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [Knex.js](https://knexjs.org/)
- [PostgreSQL](https://www.postgresql.org/)
- [Chai](https://www.chaijs.com/)
- [Mocha](https://mochajs.org/)
- [Supertest](https://github.com/visionmedia/supertest)

