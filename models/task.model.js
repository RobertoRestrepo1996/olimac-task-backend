const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');


let validStates = {
    values: ['open','in-progress','completed','archived'],
    message:'{VALUE} is not a state valid'
}


let taskSchema = new Schema({
name:{
    type: String,
    required:[true, 'required field'],
},
description:{
    type: String,
    required:[true, 'required field']
},
state:{
    type:String,
    default:'open',
    enum: validStates
},
user:[{
    type: Schema.Types.ObjectId,
    ref:'User'
}]
});

taskSchema.plugin(uniqueValidator, { message: '{PATH} MUST BE UNIQUE' });
module.exports = mongoose.model('Task',taskSchema); 