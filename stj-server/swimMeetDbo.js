// This module depends on an open Mongoose connection to the Mongo DB
const debug  = require('debug')('stj-server');
const Event  = require('./models/event');
const Heat   = require('./models/heat');
const Meet   = require('./models/meet');
const moment = require('moment-timezone');


// NOTE:  this function updates meetJson to remove the event array from each session.
function extractEventsFromMeetSessions(meetJson) {
    const events = [];
    const sessions = meetJson.sessions;

    sessions.forEach(function(session) {
        session.events.forEach(function(event) {
            event.session_num = session.number;
            events.push(event);
        });
        delete session.events;
    });

    return events;
}


// Extract the entries from the eventJSON and transform the array
// of entries into an array of heats (see Mongoose models)
function extractHeatsFromEvent(eventJson) {
    const eventEntries = eventJson.entries;
    const heatMap      = new Map();
    const heats        = [];

    eventEntries.forEach(function(entry) {
        let   heat = {};
        const heatNumber = entry.heat;

        if (heatMap.has(heatNumber)) {
            heat = heatMap.get(heatNumber);
        }
        else {
            heat.entries  = [];
            heat.number   = heatNumber;
            heatMap.set(heatNumber, heat);
        }
        const heatEntry = makeHeatEntryFromEventEntry(entry);
        heat.entries.push(heatEntry);
    });

    // sort the heat numbers and build the heats
    const heatNumbers = Array.from(heatMap.keys());
    heatNumbers.sort( (a, b) => a - b );   //  force number (not string) comparison
    heatNumbers.forEach(function(heatNum) {
        // sort the heat entries by lane
        const heat = heatMap.get(heatNum);
        heat.entries.sort( (a, b) => a.lane - b.lane );

        heats.push(heat);
    });

    return heats;
}


function makeHeatEntryFromEventEntry(eventEntry) {
    // deep copy eventEntry and remove heat
    const heatEntry = JSON.parse(JSON.stringify(eventEntry));
    delete heatEntry.heat;
    return heatEntry;
}

function saveEventData(eventJson) {
    // we don't want to save the entry data here
    const event      = {"number": eventJson.number, "desc": eventJson.desc,
                        "meet_id": eventJson.meet_id, "session_num": eventJson.session_num};
    const queryObj   = {"meet_id": eventJson.meet_id, "number": eventJson.number, "session_num": eventJson.session_num};
    const updateOpts = {"new": true, "upsert": true, "runValidators": true};

    return Event.findOneAndUpdate(queryObj, event, updateOpts).exec();
}


function saveHeatData(heatJson) {
    const queryObj   = {"event_id": heatJson.event_id, "number": heatJson.number};
    const updateOpts = {"new": true, "upsert": true, "runValidators": true};

    return Heat.findOneAndUpdate(queryObj, heatJson, updateOpts).exec();
}


function saveMeetData(meetJson) {
    // fix TZ so that date is correct and not a few hours early.
    meetJson.date = moment.tz(meetJson.date, "America/New_York").format();

    // insert or update meet in DB
    const queryObj   = {"name": meetJson.name, "date": meetJson.date};
    const updateOpts = {"new": true, "upsert": true, "runValidators": true};

    return Meet.findOneAndUpdate(queryObj, meetJson, updateOpts).exec();
}


module.exports = {

    saveToDB: async function(meetJson) {
        const events = extractEventsFromMeetSessions(meetJson);
        const meet   = await saveMeetData(meetJson);
        const meetId = meet._id;
        debug(`Saved/updated meet id: ${meetId}`);

        for (const event of events) {
            event.meet_id = meetId;

            const savedEvent = await saveEventData(event);
            const eventHeats = extractHeatsFromEvent(event);

            for (const heat of eventHeats) {
                heat.event_id = savedEvent._id;
                await saveHeatData(heat);
            }
        }
    }
};