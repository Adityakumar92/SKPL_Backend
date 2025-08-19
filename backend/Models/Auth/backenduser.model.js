const mongoose = require('mongoose');

const BackendUserSchema = new mongoose.Schema(
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
        roleAndPermission: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'RolePermission'
        },
        
    },{
        timestamps: true
    }
)

module.exports = mongoose.model('BackendUser', BackendUserSchema);