const mongoose = require('mongoose');
const Athlete  = require('./athlete');
const Schema   = mongoose.Schema;

const RelaySchema = new Schema(
    {
        name:     {type: String, required: true},
        athletes: [Athlete]
    }
);

module.exports = RelaySchema;