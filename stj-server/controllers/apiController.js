const debug = require('debug')('stj-server');
//const Event = require('../models/event');
//const Heat  = require('../models/heat');
const Meet  = require('../models/meet');

exports.getMeets = async function(req, res, next) {
    try {
        const meets = await Meet.find({});
        res.json( meets );
    }
    catch(err) {
        debug('ERROR from Meet.find().');
        next(err);
    }
};