const mongoose = require('mongoose');

let taskSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,

    name:{type:String, required:true},
    assign:{type:String},
    dueDate:{type:Date},
    status:{type:String},
    description:{type:String}
});

module.exports = mongoose.model('Task', taskSchema);