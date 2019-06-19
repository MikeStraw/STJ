const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const EventSchema = new Schema(
    {
        desc:        {type: String, required: true},
        meet_id:     {type: String, required: true},
        number:      {type: Number, required: true},
        num_lanes:   {type: Number, required: true},
        session_num: {type: Number, required: true}
    }
);

module.exports = mongoose.model('Event', EventSchema);