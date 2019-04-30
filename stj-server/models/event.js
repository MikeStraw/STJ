const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const EventSchema = new Schema(
    {
        number:      {type: Number, required: true},
        desc:        {type: String, required: true},
        meet_id:     {type: String, required: true},
        session_num: {type: Number, required: true},
    }
);

module.exports = mongoose.model('Event', EventSchema);