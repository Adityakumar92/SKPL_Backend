const mongoose = require('mongoose');

const BuildingSchema = new mongoose.Schema(
    {
        building : {
            type: String,
            require: true,
        },
        floor : {
            type: Number,
            require: true,
        },
        location : {
            type: String,
            require: true,
        },
        site_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Site',
            required: true
        },
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('Building', BuildingSchema);