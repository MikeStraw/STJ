const debug = require('debug')('stj-server');
const Event = require('../models/event');
//const Heat  = require('../models/heat');
const Meet  = require('../models/meet');

exports.getEvents = async function(req, res, next) {
    const meetId  = req.params.meetId;
    const sessNum = req.params.sessNum;
    debug('getEvents: meetId=%s, sessNum=%d', meetId, sessNum);

    if (! meetId || ! sessNum) {
        debug('apiController.getEvents: No meet-id or session number for getEvents ...');
        res.status(400).json({ message: 'Required parameter meetId or sessNum missing.' });
    }
    else {
        try {
            const events = await Event.find({'meet_id': meetId, 'session_num': sessNum});
            res.json(events);
        }
        catch(err) {
            debug('apiController.getEvents: caught database error: %O.', err);
            return res.status(500).json( {message: 'Database error on the server.'} );
        }
    }
};

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