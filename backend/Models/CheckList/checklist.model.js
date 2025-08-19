const mongoose = require('mongoose');

const ChecklistSchema = new mongoose.Schema(
    {
        icon : {
            type: String,
        },
        name :{
            type: String,
            require: true,
        },
        buildingReq : {
            type: Boolean,
            default: false
        },
        activityReq : {
            type: Boolean,
            default: false
        },
        itemMaterialReq : {
            type: Boolean,
            default: false
        },
        remarkReq : {
            type: Boolean,
            default: false
        },
        workStatusReq : {
            type: Boolean,
            default: false
        },
        itemDescription : {
            type: Boolean,
            default: false
        },
        photoUrlReq : {
            type: Boolean,
            default: false
        },
        pdfUrlReq : {
            type: Boolean,
            default: false
        },
        
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('Checklist', ChecklistSchema);