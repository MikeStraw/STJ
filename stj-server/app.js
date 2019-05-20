const bodyParser   = require('body-parser');
const cors         = require('cors');
const debug        = require('debug')('stj-server');
const express      = require('express');
const loginRoutes  = require('./routes/login');
const path         = require('path');

const app      = express();
const nodeEnv  = process.env.ENV ? process.env.ENV : 'production';
const validPin = process.env.PIN ? process.env.PIN : '98765';
debug(`pin set to: ${validPin}`);
app.set('pin', validPin);
app.set('env', nodeEnv);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/login', loginRoutes);
//app.use('/api', apiRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    debug("ERROR..." + err.message + ", status=" + err.status);

    // render the error page
    res.status(err.status || 500);
    res.send(JSON.stringify(err));
});

module.exports = app;