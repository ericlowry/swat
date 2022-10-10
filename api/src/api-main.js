const debug = require("debug")("api:main");
const assert = require("assert");
const express = require("express");
require("express-async-errors");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const { NotFound } = require("http-errors");

const apiRouter = require("./routes/api");

assert(process.env.APPLICATION_ID, "missing APPLICATION_ID env var");
assert(process.env.AUTH_SECRET, "missing AUTH_SECRET env var");
assert(process.env.COUCHDB, "missing COUCHDB env var");
assert(process.env.REDIS, "missing COUCHDB env var");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", apiRouter);

app.use((req) => {
  const error = new NotFound("not found");
  error.errors = [`no route to ${req.path}`];
  throw error;
});

// error handler endpoint
app.use((err, req, res, next) => {
  const status = err.status || 500;
  if (status === 500) console.error(err);
  if (status === 401 && err.message === "Access Token Expired")
    res.header(`x-${process.env.APPLICATION_ID}-token-expired`, "true");
  res.status(status).send({
    error: err.message,
    status,
    errors: err.errors,
  });
});

module.exports = app;
