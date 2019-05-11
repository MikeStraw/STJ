const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const UserSchema = new Schema(
    {
        first:{type: String, required: true},
        last: {type: String, required: true}
    }
);

module.exports = mongoose.model('User', UserSchema);