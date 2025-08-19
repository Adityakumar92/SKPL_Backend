const mongoose = require('mongoose');

const RolePermissionSchema = new mongoose.Schema(
    {
        role:{
            type: String,
            required: true,
            unique: true 
        },
        dashboard:{
            type: Boolean,
            default: false
        },
        submission:{
            type: String,
            enum: ['view', 'edit', 'NA'],
            default: 'NA'
        },
        about:{
            type: String,
            enum: ['view', 'edit', 'NA'],
            default: 'NA'
        },
        contact:{
            type: String,
            enum: ['view', 'edit', 'NA'],
            default: 'NA'
        },
        siteManagement:{
            type: String,
            enum: ['view', 'edit', 'all', 'NA'],
            default: 'NA'
        },
        buildingManagement:{
            type: String,
            enum: ['view', 'edit', 'all', 'NA'],
            default: 'NA'
        },
        roleManagement:{
            type: String,
            enum: ['view', 'edit', 'all', 'NA'],
            default: 'NA'
        },
        backendUserManagement:{
            type: String,
            enum: ['view', 'edit', 'all', 'NA'],
            default: 'NA'
        },
        userManagement:{
            type: String,
            enum: ['view', 'edit', 'all', 'NA'],
            default: 'NA'
        },
        checklistManagement : {
            type: String,
            enum: ['view', 'edit', 'all', 'NA'],
            default: 'NA'
        },
        activityManagement : {
            type: String,
            enum: ['view', 'edit', 'all', 'NA'],
            default: 'NA'
        },
        itemsMaterialManagement : {
            type: String,
            enum: ['view', 'edit', 'all', 'NA'],
            default: 'NA'
        },
    },{
        timestamps: true
    }
)

module.exports = mongoose.model('RolePermission', RolePermissionSchema)