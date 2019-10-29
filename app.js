const express = require("express");
const app = express();
app.use(express.json());

const apiRouter = require("./routes/api-router");

const { handle404 } = require("./errors/error");

app.use("/api", apiRouter);

// app.use(handle404);

module.exports = app;
