const argv     = require('minimist')(process.argv.slice(2));  //[0] = node.exe, [1]=.../index.js
const Event    = require('./models/event');
const fs       = require('fs');
const Heat     = require('./models/heat');
const Meet     = require('./models/meet');
const moment   = require('moment-timezone');
const mongoose = require('mongoose');


// main - run the STJ Server
function main()
{
    return new Promise((resolve, reject) =>{

        const pgmOptions = checkCmdLineArgs(argv);
        if (pgmOptions.errors.length > 0 ) {
            usage();
            reject(pgmOptions.errors);
        }

        process.on('unhandledRejection', error => {reject(error);});
        const connectOpts = {
            useNewUrlParser: true,    // uses port number in DSN
            useFindAndModify: false   // findAndModify uses MongoDB's findAndModify
        };
        // TODO: DSN or at least port should be cmd line options
        const mongoDSN = 'mongodb://localhost:27017/stj';

        mongoose.connect(mongoDSN, connectOpts)
                .then( async() => {
                    await runProgram(pgmOptions);
                    mongoose.disconnect().then (resolve);
                });
    });
}

// Check the command line arguments for valid options.
function checkCmdLineArgs(argv)
{
    const pgmOptions = {
        errors: [],
        meetFile: '',
        runExpress: false,
        watchFile: false
    };

    console.log(argv);
    // check for --file with argument
    if (argv.file &&  typeof(argv.file) === 'boolean') {
        pgmOptions.errors.push('The --file option requires an argument.');
    }

    if (argv.watch && ! argv.file) {
        pgmOptions.errors.push('If using --watch, the --file option must also be used.');
    }

    if (argv.noexpress && ! argv.file) {
        pgmOptions.errors.push('If using --noexpress, the --file option must also be used.');
    }

    pgmOptions.meetFile = argv.file;
    pgmOptions.runExpress = !argv.noexpress;
    pgmOptions.watchFile = argv.watch;

    return pgmOptions;
}


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

// Run the requested functionality.  If running express or file watcher, will not return until ^C
// TODO:  probably should add an admin capability to shutdown.
async function runProgram(pgmOptions) {
    console.log("Inside runProgram");

    // meetFile --> save the data into the DB
    if (pgmOptions.meetFile) {
        const meetJson = JSON.parse(fs.readFileSync(pgmOptions.meetFile, 'utf8'));
        await saveMeetToDB(meetJson);
    }

    // watchFile --> watch for changes to meetFile (not implemented yet)
    if (pgmOptions.watchFile) {
        console.log('Watch file processing not implemented yet.');
    }

    if (pgmOptions.runExpress) {
        console.log('Starting up express ...');
        // await startExpress();
    }

    console.log('leaving runProgram');
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


// Save the meet information into the meets, events and heats collection
async function saveMeetToDB(meetJson) {
    const events = extractEventsFromMeetSessions(meetJson);
    const meet   = await saveMeetData(meetJson);
    const meetId = meet._id;
    console.log("Saved/updated meet id: " + meetId);

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


function usage() {
    const help = 'USAGE: node index.js [--file meetFile] [--watch] [--noexpress]\n'    +
                 'Where:   --file meetFile --> insert the JSON formatted meet data file into the Mongo DB.\n' +
                 '         --watch         --> watch the meet information file for updates.\n' +
                 '         --noExpress     --> do not start the node/express API server.\n';
    console.log(help);
}


// ********** Main program starts here
main().then( () => {
    console.log('STJ Server stopping ...');
    process.exit(0);
}).catch( (err) => {
    console.log('FAILURE: ' + err);
    process.exit(1)
});