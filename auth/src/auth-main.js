const debug = require('debug')('auth:main');
const assert = require('assert');
var express = require('express');
require('express-async-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const { NotFound } = require('http-errors');

[
  'APPLICATION_ID',
  'COUCHDB',
  'AUTH_SECRET',
  'REDIS',
  'SESSION_DURATION',
  'TOKEN_DURATION',
  'CLIENT_REDIRECT',
].map(envName => assert(process.env[envName], `missing ${envName} env var`));

var authRouter = require('./routes/auth');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/', authRouter);

app.use(req => {
  const error = new NotFound('not found');
  error.errors = [`no route to ${req.path}`];
  throw error;
});

// error handler endpoint
app.use((err, req, res, next) => {
  const status = err.status || 500;
  if (status === 500) console.error(err);
  res.status(status).send({
    error: err.message,
    status,
    errors: err.errors,
  });
});

module.exports = app;
