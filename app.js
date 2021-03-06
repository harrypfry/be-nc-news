const cors = require("cors");

const express = require("express");
const app = express();
app.use(express.json());

const apiRouter = require("./routes/api-router");

const { customErrors, psqlErrors } = require("./errors/error");
app.use(cors());

app.use("/api", apiRouter);

app.use(customErrors);

app.use(psqlErrors);

module.exports = app;
