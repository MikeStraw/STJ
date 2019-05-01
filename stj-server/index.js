const argv     = require('minimist')(process.argv.slice(2));  //[0] = node.exe, [1]=.../index.js
const fs       = require('fs');
const mongoose = require('mongoose');
const meetDbo  = require('./swimMeetDbo');


// main - run the STJ Server
function main()
{
    return new Promise((resolve, reject) =>{

        const pgmOptions = checkCmdLineArgs(argv);
        if (pgmOptions.help) {
            usage();
            resolve();
        }
        if (pgmOptions.errors.length > 0 ) {
            usage();
            reject(pgmOptions.errors);
        }

        process.on('unhandledRejection', error => {reject(error);});
        const connectOpts = {
            useNewUrlParser: true,    // uses port number in DSN
            useFindAndModify: false   // findAndModify uses MongoDB's findAndModify
        };
        const mongoDSN = 'mongodb://localhost:27017/stj';  // TODO: DSN or at least port should be cmd line options

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
        help: false,
        meetFile: false,
        runExpress: false,
        watchFile: false
    };

    console.log(argv);
    if (argv.file &&  typeof(argv.file) === 'boolean') {
        pgmOptions.errors.push('The --file option requires an argument.');
    }

    if (argv.watch && ! argv.file) {
        pgmOptions.errors.push('If using --watch, the --file option must also be used.');
    }

    if (argv.noexpress && ! argv.file) {
        pgmOptions.errors.push('If using --noexpress, the --file option must also be used.');
    }

    pgmOptions.help = argv.help;
    pgmOptions.meetFile = argv.file;
    pgmOptions.runExpress = !argv.noexpress;
    pgmOptions.watchFile = argv.watch;

    return pgmOptions;
}


// Run the requested functionality.  If running express or file watcher, will not return until ^C
// TODO:  probably should add an admin capability to shutdown.
async function runProgram(pgmOptions) {
    console.log("Inside runProgram");

    // meetFile --> save the data into the DB
    if (pgmOptions.meetFile) {
        const meetJson = JSON.parse(fs.readFileSync(pgmOptions.meetFile, 'utf8'));
        await meetDbo.saveToDB(meetJson);
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


function usage() {
    const help = 'USAGE: node index.js [--file meetFile] [--watch] [--noexpress]\n'    +
                 'Where:  --help          --> prints this help message.\n' +
                 '        --file meetFile --> insert the JSON formatted meet data file into the Mongo DB.\n' +
                 '        --noexpress     --> do not start the node/express API server.\n' +
                 '        --watch         --> watch the meet information file for updates.\n';

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