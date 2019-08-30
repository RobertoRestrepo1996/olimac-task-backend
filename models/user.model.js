const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
const uniqueValidator = require('mongoose-unique-validator');


let validRole = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} is not a role valid'
}


const Schema = mongoose.Schema;
let userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'required field']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'required field']
    },
    password: {
        type: String,
        required: [true, 'required field']
    },
    
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: validRole
    },
    state: {
        type: Boolean,
        default: true
    }
});

userSchema.plugin(uniqueValidator, { message: '{PATH} MUST BE UNIQUE' });
module.exports = mongoose.model('User', userSchema);