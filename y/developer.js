const mongoose = require('mongoose');

let developerSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        firstName: {
            type: String,
            required: true
        },
        lastName: String
    },
    level: {
        type: String,
    },
    address : {
        State:String,
        Suburb: String,
        Street: String,
        Unit: Number
    }
});

module.exports = mongoose.model('Developer', developerSchema);