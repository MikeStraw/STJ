const debug = require('debug')('stj-server');
const Event = require('../models/event');
const Heat  = require('../models/heat');
const Meet  = require('../models/meet');

exports.getEvents = async function(req, res, next) {
    const meetId  = req.params.meetId;
    const sessNum = req.params.sessNum;
    debug('getEvents: meetId=%s, sessNum=%d', meetId, sessNum);

    if (! meetId || ! sessNum) {
        debug('apiController.getEvents: No meet-id or session number for getEvents ...');
        return res.status(400).json({ message: 'Required parameter meetId or sessNum missing.' });
    }

    try {
        const events = await Event.find({'meet_id': meetId, 'session_num': sessNum});
        return res.json(events);
    }
    catch(err) {
        debug('apiController.getEvents: caught database error: %O.', err);
        return res.status(500).json( {message: 'Database error on the server.'} );
    }
};

exports.getHeats = async function(req, res, next) {
    const eventId = req.params.eventId;
    debug('getHeats: eventId=%s', eventId);

    if (! eventId) {
        debug('apiController.getHeats: No event-id ...');
        return res.status(400).json({ message: 'Required parameter eventId missing.' });
    }

    try {
        const heats = await Heat.find({'event_id': eventId});
        return res.json(heats);
    }
    catch(err) {
        debug('apiController.getHeats: caught database error: %O.', err);
        return res.status(500).json( {message: 'Database error on the server.'} );
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