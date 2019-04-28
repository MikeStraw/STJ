const debug   = require('debug')('stj-server');
const express = require('express');
const path    = require('path');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

module.exports = app;