const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            require: true,
        },
        phone:{
            type: String,
            default: 'NA'
        },
        email: { 
            type: String, 
            require: true,
            unique: true 
        },
        password: {
            type: String,
            require: true
        },
        block:{
            type: Boolean,
            default: false,
        },
        
    },{
        timestamps: true
    }
)

module.exports = mongoose.model('User', UserSchema);