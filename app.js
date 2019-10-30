const express = require("express");
const app = express();
app.use(express.json());

const apiRouter = require("./routes/api-router");

const { customErrors } = require("./errors/error");

app.use("/api", apiRouter);

app.use(customErrors);

module.exports = app;
