const mongoose = require('mongoose');

const userInputSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    building_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Building',
    },
    activity_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Activity',
    },
    item_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ItemMaterial',
        default: null
    },
    remark: String,
    item_description: String,
    work_status: String,
    photo_url: String,
    pdf: String,
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'Reject'],
        default: 'Pending'
    }
}, { timestamps: true });

module.exports = mongoose.model('UserInput', userInputSchema);